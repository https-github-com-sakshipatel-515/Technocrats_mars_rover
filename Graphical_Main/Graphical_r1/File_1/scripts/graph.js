function Shadow( parameters ) 
{this.type     = "shadow";
	this.id       = get_unique_integer( );
	this.color    = parameters.color;
	this.offset_x = parameters.offset_x;
	this.offset_y = parameters.offset_y;
	this.blur     = parameters.blur;	
}
Shadow.prototype.draw = function ( context ) {
context.shadowColor   = this.color;
	context.shadowBlur    = this.blur;
	context.shadowOffsetX = this.offset_x;
	context.shadowOffsetY = this.offset_y;
};

//Canvas Text Object
function Text( parameters ) 
{this.type    = "text";
	this.id      = get_unique_integer( );
	this.color   = parameters.color;
	this.x       = parameters.x;
	this.y       = parameters.y;
	this.font    = parameters.font_weight + " " + parameters.font_size + " " + parameters.font_family;
	this.height  = parseFloat( parameters.font_size );
	this.string  = parameters.string;
	this.shadow  = new Shadow( parameters.shadow );
	}

Text.prototype.draw = function ( context ) {
context.textAlign    = "left";
		context.textBaseLine = "middle";
		context.fillStyle    = this.color;
		context.font         = this.font;
		var tw = context.measureText( this.string ).width;
		this.x = this.x - ( tw  / 2 );
		this.y = this.y + ( this.height / 2 );
        this.shadow.draw( context );
		context.fillText( this.string, this.x, this.y );
};

//Canvas Line Object
function Line( parameters )
{this.type       = "line";
	this.id         = get_unique_integer( ); 
	this.color      = parameters.color;
	this.x1         = parameters.x1;
	this.y1         = parameters.y1;
	this.x2         = parameters.x2;
	this.y2         = parameters.y2;
	this.width      = parameters.width;
	this.cap_style  = "round";
	this.shadow     = new Shadow( parameters.shadow );
	this.text       = new Text( parameters.text );
	this.circle_in  = null;
	this.circle_out = null;
}

Line.prototype.draw = function ( context ) {
this.x1 = this.circle_out.x;
	this.y1 = this.circle_out.y;
	this.x2 = this.circle_in.x;
	this.y2 = this.circle_in.y;
	context.strokeStyle  = this.color;
	var lwc = context.lineWidth;
	context.lineWidth    = this.width;
	var csc  = context.lineCap;
	context.lineCap      = this.cap_style;
	context.beginPath( );
	context.moveTo( this.x1, this.y1 );
	context.lineTo( this.x2, this.y2 );
	this.shadow.draw( context );
    context.stroke( );
    context.lineWidth = lwc;
	context.lineCap   = csc;
	if ( this.x1 <= this.x2 )
	{this.text.x = this.x1 + ( Math.abs( this.x2 - this.x1 ) / 2 );
}
else
	{this.text.x = this.x2 + ( Math.abs( this.x1 - this.x2 ) / 2 );
}
if ( this.y1 <= this.y2 )
	{this.text.y = this.y1 + ( Math.abs( this.y2 - this.y1 ) / 2 );
}
	else
	{this.text.y = this.y2 + ( Math.abs( this.y1 - this.y2 ) / 2 );
		
	}
	
};	
function Circle( parameters )
{this.type      = "circle";
	this.id        = get_unique_integer( );
	this.color     = parameters.color;
	this.radius    = parameters.radius;
	this.diameter  = this.radius * 2;
	this.x         = parameters.x;
	this.y         = parameters.y;
	this.shadow    = new Shadow( parameters.shadow );
	this.text      = new Text( parameters.text );
	this.lines_in  = [ ];
	this.lines_out = [ ];
}

Circle.prototype.draw = function ( context ) {
context.fillStyle = this.color;
context.beginPath( );
context.arc( this.x, this.y, this.radius, 0, 6.283185307179586 );
this.shadow.draw( context );
context.fill( );
context.closePath( );
this.text.x = this.x;
	this.text.y = this.y;
	this.text.draw( context );
};

//Adding an incident line
Circle.prototype.add_line_in = function ( line ) {
    line.x2 = this.x;
	line.y2 = this.y;
	line.circle_in = this;
    this.lines_in.push( line );
}

//Adding an incident line
Circle.prototype.add_line_out = function ( line ) {
	line.x1 = this.x;
	line.y1 = this.y;
	line.circle_out = this;
this.lines_out.push( line );
}

//Let us calculate whether a point lies within and on this circle.
Circle.prototype.point_in = function ( x, y ) {
	var ma = Math.abs;
	var  r = this.radius;		
	var dl = ma( x - this.x );
	var dt = ma( y - this.y );
	var dl2 = dl * dl;
	var dt2 = dt * dt;
	var  rr =  r *  r;
	if ( ( dl2 + dt2 ) <= rr ) { return true; }
	else { return false; }
}

//Canvas Handler Object
function Canvas_Handler( parameters )
{this.canvas  = parameters.canvas;
	this.context = parameters.context;
	this.canvas_invalid = false;
    this.mouse_crd = null;
	this.dragging = false;
	this.circle_dragging = null;
    this.dragging_target_x = null;
	this.dragging_target_y = null;
	this.mouse_offset_x = null;
	this.mouse_offset_y = null;
	this.dragging_timer_id = null;
	this.dragging_timer_then = 0;
	this.handle_dragging_timer = this.on_dragging_timer_tick.bind( this );
	this.circles = [ ];
	this.lines   = [ ];
	this.line_ids = { };
	this.texts = [ ];
	this.text_ids = { };
	this.handle_mouse_down = this.on_mouse_down.bind( this );
	this.handle_mouse_up   = this.on_mouse_up.bind(   this );
	this.handle_mouse_move = this.on_mouse_move.bind( this );
	this.canvas.addEventListener( "mousedown", this.handle_mouse_down, false );
	this.canvas.addEventListener( "mouseup",   this.handle_mouse_up,   false );
	this.canvas.addEventListener( "mousemove", this.handle_mouse_move, false );
}
Canvas_Handler.prototype.draw_all = function ( ) {

//Avoid Redrawing, if the canvas is not invalid!
if ( !this.canvas_invalid ) return null;
	this.context.clearRect( this.canvas.offsetLeft, this.canvas.offsetTop, 
    this.canvas.width,this.canvas.height);
	var i = this.lines.length;
    while ( i-- )
	{this.lines[ i ].draw( this.context );
    }
	i = this.texts.length;
	while ( i-- )
	{this.texts[ i ].draw( this.context );
		
	}
i = this.circles.length;
while ( i-- )
{this.circles[ i ].draw( this.context );
}
this.canvas_invalid = false;
};

//Let us add a circle to the graph handler's data structure.
Canvas_Handler.prototype.add_circle = function ( circle ) {
this.circles.push( circle );
var i = circle.lines_in.length;
while ( i-- )
	{if ( typeof( this.line_ids[ circle.lines_in[ i ].id ] ) === "undefined" )
		{this.lines.push( circle.lines_in[ i ] );
         this.line_ids[ circle.lines_in[ i ].id ] = this.lines.length - 1;
}
if ( typeof( this.text_ids[ circle.lines_in[ i ].text.id ] ) === "undefined" )
		{this.texts.push( circle.lines_in[ i ].text );
   this.text_ids[ circle.lines_in[ i ].text.id ] = this.texts.length - 1;
			}
		}
	i = circle.lines_out.length;
	while ( i-- )
    {if ( typeof( this.line_ids[ circle.lines_out[ i ].id ] ) === "undefined" )
		{this.lines.push( circle.lines_out[ i ] );
          this.line_ids[ circle.lines_out[ i ].id ] =  this.lines.length - 1;
}
		if ( typeof( this.text_ids[ circle.lines_out[ i ].text.id ] ) === "undefined" )
		{this.texts.push( circle.lines_out[ i ].text );
this.text_ids[ circle.lines_out[ i ].text.id ] =  this.texts.length - 1;
			}
		}
	this.canvas_invalid = true;
};

//Now we need to maintain the lookup objects with the correct array positions for both the lines and texts arrays.
Canvas_Handler.prototype.update_id_lookups = function ( ) {
var i = this.lines.length;
while ( i-- )
	{this.line_ids[ this.lines[ i ].id ] = i;
    }
	i = this.texts.length;
	while ( i-- )
	{this.text_ids[ this.texts[ i ].id ] = i;
}
};

// This will translate the mouse crd relative to the canvas crd.
Canvas_Handler.prototype.get_mouse_crd = function ( x, y ) {
var cr = this.canvas.getBoundingClientRect( );
	return {x: x - cr.left,
		y: y - cr.top
		};
	};

//Finding the first circle on the canvas(if any) that contains the given point (x,y) and returning -1 if no circle contains this point.
Canvas_Handler.prototype.point_in_circle = function ( x, y ) {
var i = this.circles.length;
	var ci = -1;
	while ( i-- )
	{if ( this.circles[ i ].type != "circle" ) continue;
		if ( this.circles[ i ].point_in( x, y ) )
		{ci = i;
			break;
          }
		}
	return ci;
};

//Let's create a smoother Transition effect by interpolating the circle's position between its current position and the target position when a circle is being dragged.
Canvas_Handler.prototype.on_dragging_timer_tick = function ( ) {
	var ma = Math.abs;
    var dl = ma( this.circle_dragging.x - this.dragging_target_x );
	var dt = ma( this.circle_dragging.y - this.dragging_target_y );
	this.canvas_invalid = true;
	if ( !this.dragging && dl < 3 && dt < 3 )
	{this.circle_dragging.x = this.dragging_target_x;
		this.circle_dragging.y = this.dragging_target_y;
		var ce = new CustomEvent( "dragging:stopped", {
			detail: { 
             circle: this.circle_dragging
           },
			bubles: true,
			cancelable: false
} );
this.canvas.dispatchEvent( ce );
var ci = this.point_in_circle( this.mouse_crd.x, this.mouse_crd.y );
if ( ci != -1 )
		{this.canvas.style.cursor = "pointer";
			}
		else
		{this.canvas.style.cursor = "default";
			}
		this.circle_dragging = null;
		this.mouse_offset_x = null;
		this.mouse_offset_y = null;
		this.dragging_target_x = null;
		this.dragging_target_y = null;
		clearInterval( this.dragging_timer_id );
        this.dragging_timer_id = null;
		}
	else
	{this.circle_dragging.x = this.circle_dragging.x + ( 0.6 * ( this.dragging_target_x - this.circle_dragging.x ) );
		this.circle_dragging.y = this.circle_dragging.y + ( 0.6 * ( this.dragging_target_y - this.circle_dragging.y ) );
		var ce = new CustomEvent( "dragging:continuing", {
			detail: { 
				circle: this.circle_dragging
			},
			bubles: true,
			cancelable: false
			} );
this.canvas.dispatchEvent( ce );
}
};

//Updating the cursor, if the mouse is over the circle or not over the circle.
Canvas_Handler.prototype.on_mouse_move = function ( event ) {

//Keeping track of its crd relative to the canvas.
this.mouse_crd = this.get_mouse_crd( event.clientX, event.clientY );
if ( this.dragging )
	{this.canvas.style.cursor = "move";
     this.canvas_invalid = true;
     this.dragging_target_x = this.mouse_crd.x - this.mouse_offset_x;
     this.dragging_target_y = this.mouse_crd.y - this.mouse_offset_y;
     return null;
}
var ci = this.point_in_circle( this.mouse_crd.x, this.mouse_crd.y );
if ( ci != -1 )
	{this.canvas.style.cursor = "pointer";
var ce = new CustomEvent( "mouse:over", {
detail: { circle: this.circles[ ci ]
},
bubles: true,
cancelable: false
} );
this.canvas.dispatchEvent( ce );
}
else
	{this.canvas.style.cursor = "default";
var ce = new CustomEvent( "mouse:out", {
detail: {
},
	bubles: true,
    cancelable: false
	} );
		
this.canvas.dispatchEvent( ce );
}
}

//Checking if the current mouse crd are over a circle, when the mouse button is being pressed. If yes, Begin the dragging sequence
Canvas_Handler.prototype.on_mouse_down = function ( event ) {
    
//Only one circle can be dragged at a time
this.mouse_crd = this.get_mouse_crd( event.clientX, event.clientY );
var ci = this.point_in_circle( this.mouse_crd.x, this.mouse_crd.y );
if ( ci != -1 && this.dragging_timer_id === null )
	{this.canvas.style.cursor = "move";
this.canvas_invalid = true;
this.dragging = true;
this.circle_dragging = this.circles[ ci ];
this.circles.unshift( this.circles.splice( ci, 1 )[ 0 ] );
var i = this.circle_dragging.lines_out.length;
while ( i-- )
		{var line_index = this.line_ids[ this.circle_dragging.lines_out[ i ].id ];
         this.lines.unshift( this.lines.splice( line_index, 1 )[ 0 ] );
          var text_index = this.text_ids[ this.circle_dragging.lines_out[ i ].text.id ];
          this.texts.unshift( this.texts.splice( text_index, 1 )[ 0 ] );
          this.update_id_lookups( );
}
i = this.circle_dragging.lines_in.length;
		while ( i-- )
        {var line_index = this.line_ids[ this.circle_dragging.lines_in[ i ].id ];
         this.lines.unshift( this.lines.splice( line_index, 1 )[ 0 ] );
			var text_index = this.text_ids[ this.circle_dragging.lines_in[ i ].text.id ];
			this.texts.unshift( this.texts.splice( text_index, 1 )[ 0 ] );
			this.update_id_lookups( );
        }
		this.mouse_offset_x = this.mouse_crd.x - this.circle_dragging.x;
		this.mouse_offset_y = this.mouse_crd.y - this.circle_dragging.y;
        this.dragging_target_x = this.mouse_crd.x - this.mouse_offset_x;
		this.dragging_target_y = this.mouse_crd.y - this.mouse_offset_y;
        this.dragging_timer_id = setInterval( this.handle_dragging_timer, 1000 / 16.666666667 );
		var ce = new CustomEvent( "dragging:started", {
			detail: { circle: this.circle_dragging
				
			},
			bubles: true,
			cancelable: false
			} );
		this.canvas.dispatchEvent( ce );
}
this.canvas.style.cursor = "move";
};

//Updating the target position(which will be the last known target position that the circle's position must be interpolated to) incase the mouse button has been released but the circle which was dragged may have not yet reached its target position
Canvas_Handler.prototype.on_mouse_up = function ( event ) {
	this.mouse_crd = this.get_mouse_crd( event.clientX, event.clientY );
	var ci = this.point_in_circle( this.mouse_crd.x, this.mouse_crd.y );
	if ( this.dragging )
	{this.canvas.style.cursor = "move";
this.canvas_invalid = true;
this.dragging_target_x = this.mouse_crd.x - this.mouse_offset_x;
this.dragging_target_y = this.mouse_crd.y - this.mouse_offset_y;
this.dragging = false;
}
	if ( ci != -1 )
	{this.canvas.style.cursor = "pointer";
    }
	else
	{this.canvas.style.cursor = "default";
    }
	};

//Graph Primitives
function Edge( parameters )
{this.type      = "edge";
	this.id        = get_unique_integer( );
	this.weight    = parameters.label;
	this.node_out  = null;
	this.node_in   = null;
}
Edge.prototype.set_node_out = function ( node ) {
if ( this.node_out === null )
	{this.node_out = node;
}
};
Edge.prototype.set_node_in = function ( node ) {
if ( this.node_in === null )
	{this.node_in = node;
}
};
function Node( parameters )
{this.type      = "node";
	this.id        = get_unique_integer( );
	this.x         = parameters.x;
	this.y         = parameters.y;
	this.label     = parameters.label;
	this.edges_out = [ ];
	this.edges_in  = [ ];	
	}

Node.prototype.add_edge_out = function ( edge ) {
this.edges_out.push( edge );
	};

Node.prototype.add_edge_in = function ( edge ) {
this.edges_in.push( edge );
};
Node.prototype.update_edges = function ( ) {
var i = this.edges_out.length;
while ( i-- )
{var edge = this.edges_out[ i ];
var dl = this.edges_out[ i ].node_out.x - this.edges_out[ i ].node_in.x;
 dl2 = dl * dl;
 var dt = this.edges_out[ i ].node_out.y - this.edges_out[ i ].node_in.y;
 dt2 = dt * dt;
var de = Math.sqrt( dl2 + dt2 );
edge.weight = de;
}
i = this.edges_in.length;
while ( i-- )
{var edge = this.edges_in[ i ];
var dl = this.edges_in[ i ].node_out.x - this.edges_in[ i ].node_in.x;
dl2    = dl * dl;
var dt = this.edges_in[ i ].node_out.y - this.edges_in[ i ].node_in.y;
dt2    = dt * dt;
var de = Math.sqrt( dl2 + dt2 );
edge.weight = de;
		}
};

//a Graph Handler object
function Graph_Handler( parameters )
{this.number_of_nodes  = parameters.number_of_nodes;
this.node_location_bounds = parameters.node_location_bounds;
this.adjacency_matrix = [ ];
this.edges            = [ ];
this.nodes            = [ ];
this.populate_nodes( );
this.connect_graph( );
}

//Generating the nodes of the graph at random locations!
Graph_Handler.prototype.populate_nodes = function ( )
{for ( var i = 0; i < this.number_of_nodes; ++i )
	{var x = get_random_integer( this.node_location_bounds.x1, this.node_location_bounds.x2 );
		var y = get_random_integer( this.node_location_bounds.y1, this.node_location_bounds.y2 );
		var node = new Node( { x: x, y: y, label: i } );
		this.nodes.push( node );
		}
}

//Generating the Adjacency Matrix!
Graph_Handler.prototype.connect_graph = function (  ) {
for ( var i = 0; i < this.number_of_nodes; ++i )
	{var row = [ ];
for ( var j = 0; j < this.number_of_nodes; ++j )
		{row.push( -1 );
}
this.adjacency_matrix.push( row );
}
for ( var i = 0; i < this.number_of_nodes; ++i )
	{for ( var j = i + 1; j < this.number_of_nodes; ++j )
		{if ( get_random_integer( 0, 2 ) === 1 )
			{var dl = this.nodes[ i ].x - this.nodes[ j ].x;
				dl2    = dl * dl;
				var dt = this.nodes[ i ].y - this.nodes[ j ].y;
				dt2    = dt * dt;
                var de = Math.sqrt( dl2 + dt2 );
                var edge = new Edge( { weight: de } );
				edge.set_node_out( this.nodes[ i ] );
				edge.set_node_in(  this.nodes[ j ] );
				this.nodes[ i ].add_edge_out( edge );
				this.nodes[ j ].add_edge_in(  edge );
				this.edges.push( edge );
				this.adjacency_matrix[ i ][ j ] = de;
				this.adjacency_matrix[ j ][ i ] = de;
				}
			}
		}
};

//Based on the distances of Adjacent Nodes, updating the Adjacency Matrix.
Graph_Handler.prototype.update_adjacency_matrix = function ( )
{var i = this.edges.length;
	while ( i-- )
	{var node_out = this.edges[ i ].node_out;
		var node_in  = this.edges[ i ].node_in;
		var dl = node_out.x - node_in.x;
		dl2    = dl * dl;
		var dt = node_out.y - node_in.y;
		dt2    = dt * dt;
		var de = Math.sqrt( dl2 + dt2 );
		this.adjacency_matrix[ node_out.label ][ node_in.label  ] = de;
		this.adjacency_matrix[ node_in.label  ][ node_out.label ] = de;
		}
};

//Returning an internal integer that is incremented in each function call.
var get_unique_integer = ( function ( ) {
    var inc = 0;
return function ( ) {
		inc += 1;
		return inc;
		};
} ) ( );
function get_random_integer( min, max ) 
{return Math.floor( Math.random( ) * ( max - min + 1 ) + min );
	}
function get_clamped_value( value, min, max )
{if ( value > max ) value = max;
	if ( value < min ) value = min;
	return value;
}
function on_load( )
{var non = 10;
	var nr = 28;
	var ndc = "#0000FF";
	var edc = "#FF9900";	
	var spc = "#28ED56";	
	var nspc = "#FF9900";
	var NODE_VISITED_COLOR     = "#0000FF";
	var NODE_NOT_VISITED_COLOR = "#FF66FF";
	var snc = "#28ED56";
	var enc   = "#ff0000";
	var sn = null;
	var en   = null;
	var ns = 0;
    var ngb       = document.createElement( "div" );
	ngb.id        = "ngb";
	ngb.className = "button purple_background visible";
	ngb.innerHTML = "New Graph";
	document.body.appendChild( ngb );
	ngb.onclick = function ( event ) {
		event.preventDefault( );
		try
		{document.body.removeChild( document.getElementById( "overlay" ) );
}catch ( error ) { }
		
		document.body.removeChild( canvas );
		document.body.removeChild( brb );
		document.body.removeChild( ngb );
		on_load( );
		}
	
	ngb.addEventListener( "selectstart", function( event ) { 
		event.preventDefault( ); 
		return false; 
		}, false );
    var brb       = document.createElement( "div" );
	brb.id        = "brb";
	brb.className = "button green_background hidden";
	brb.innerHTML = "Begin";
	document.body.appendChild( brb );
	brb.style.left = ngb.offsetLeft + ngb.clientWidth + 10 + "px";
	brb.addEventListener( "selectstart", function( event ) { 
    event.preventDefault( ); 
    return false; 
}, false );
	
    var canvas           = document.createElement( "canvas" );
	canvas.innerHTML     = "Your browser does not support HTML5 canvas.";
	canvas.id            = "canvas";
	canvas.width         = window.innerWidth;
	canvas.height        = window.innerHeight;
	canvas.style.width   = window.innerWidth + "px";
	canvas.style.height  = window.innerHeight + "px";
	canvas.style.margin  = "0px";
	canvas.style.padding = "0px";
	document.body.appendChild( canvas );
    var context = canvas.getContext( "2d" );
	var canvas_handler = new Canvas_Handler( { canvas: canvas, context: context } );
	var graph_handler  = new Graph_Handler( { 
		
		number_of_nodes: non,
		node_location_bounds: {
			x1: nr * 2,
			x2: window.innerWidth  - ( nr * 2 ),
			y1: 80 + nr,
			y2: window.innerHeight - 180 - nr
	}
} );
	var shadow_parameters = {
		color: "rgba( 1, 1, 1, 0.9 )",
		offset_x: 0,
		offset_y: 0,
		blur: 15
		
	};
	var circles = { };
		for ( var i = 0; i < graph_handler.number_of_nodes; ++i )
	{if ( typeof( circles[ graph_handler.nodes[ i ].id ] ) === "undefined" )
    {var circle = new Circle( {
		color: ndc,
				radius: nr,
				x: graph_handler.nodes[ i ].x,
				y: graph_handler.nodes[ i ].y,
				shadow: shadow_parameters,
				text: {
				color: "#fff",
					x: graph_handler.nodes[ i ].x,
					y: graph_handler.nodes[ i ].y,
					font_weight: "bold",
					font_size: "20pt",
					font_family: "monospace",
					string: graph_handler.nodes[ i ].label,
					shadow: shadow_parameters
				}
} );
circles[ graph_handler.nodes[ i ].id ] = circle;
}for ( var j = i + 1; j < graph_handler.number_of_nodes; ++j )
		{if ( graph_handler.adjacency_matrix[ i ][ j ] != -1 )
			{if ( typeof( circles[ graph_handler.nodes[ j ].id ] ) === "undefined" )
				{var circle = new Circle( {
				color: ndc,
						radius: nr,
						x: graph_handler.nodes[ j ].x,
						y: graph_handler.nodes[ j ].y,
						shadow: shadow_parameters,
						text: {
				            color: "#fff",
							x: graph_handler.nodes[ j ].x,
							y: graph_handler.nodes[ j ].y,
							font_weight: "bold",
							font_size: "20pt",
							font_family: "monospace",
							string: graph_handler.nodes[ j ].label,
							shadow: shadow_parameters
				}
               } );
                 circles[ graph_handler.nodes[ j ].id ] = circle;
				}
				var c1 = circles[ graph_handler.nodes[ i ].id ];
				var c2 = circles[ graph_handler.nodes[ j ].id ];
				var line_string = parseFloat( graph_handler.adjacency_matrix[ i ][ j ].toFixed( 2 ) );
                var line = new Line( {
		            color: edc,
					x1: c1.x,
					y1: c1.y,
					x2: c2.x,
					y2: c2.y,
					width: 10,
					shadow: shadow_parameters,
					text: {
						color: "#fff",
						x: 0,
						y: 0,
						font_weight: "bold",
						font_size: "15pt",
						font_family: "monospace",
						string: line_string,
						shadow: {
		                    color: "rgba( 1, 1, 1, 1.0 )",
							offset_x: 0,
							offset_y: 0,
							blur: 5
}
}
} );
c1.add_line_out( line );
c2.add_line_in(  line );
}
}
}
var i = 0;
for ( key in circles )
	{canvas_handler.add_circle( circles[ key ] );
     i += 1;
}
if ( i != non )
	{console.warn( "Number of circles does not equal number of nodes." );
		console.log( i, non );
		
	}
 
    //Let's Begin with the Algorithm!
	function shortest_path_algorithm( parameters )
 
     //This function is used for the implementation of a Queue.
	{function Queue( )
		{this.queue = [ ];
			
		}Queue.prototype.enqueue = function( item )
		{this.queue.push( item );
           this.queue.sort( function( a, b ) { return a.distances[ a.node.label ] - b.distances[ b.node.label ] } );
}
Queue.prototype.dequeue = function( )
		{this.queue.sort( function( a, b ) { return a.distances[ a.node.label ] - b.distances[ b.node.label ] } );
         return this.queue.shift( );
			}
Queue.prototype.size = function( )
		{return this.queue.length;
			
		}
Queue.prototype.peak = function( )
		{return ( this.queue[ 0 ] !== null ) ? this.queue[ 0 ] : null;
			
		}
        var overlay            = document.createElement( "div" );
		overlay.id             = "overlay";
		overlay.innerHTML      = "&nbsp;";	
		overlay.style.position = "absolute";
		overlay.style.left     = "0px";
		overlay.style.top      = "0px";
		overlay.style.zIndex   = 1;
		document.body.appendChild( overlay );
		overlay.width        = window.innerWidth;
		overlay.height       = window.innerHeight;
		overlay.style.width  = window.innerWidth  + "px";
		overlay.style.height = window.innerHeight + "px";
		var circles = parameters.canvas_handler.circles;
		var lines   = parameters.canvas_handler.lines;
        var circle_lookup = { };
		var number_of_nodes  = parameters.graph_handler.nodes.length;
		var nodes            = parameters.graph_handler.nodes;
		var adjacency_matrix = parameters.graph_handler.adjacency_matrix;
		var sn    = parameters.sn;
		var en      = parameters.en;
        graph_handler.update_adjacency_matrix( );
		var distances    = [ ];
		var visited      = [ ];
		var pds = [ ];
        var i = circles.length;
		while ( i-- )
		{distances.push( Number.MAX_VALUE );
			visited.push( 0 );
			pds.push( -1 );
			circles[ i ].color = NODE_NOT_VISITED_COLOR;
			if ( typeof( circle_lookup[ circles[ i ].text.string ] ) === "undefined" )
			{circle_lookup[ circles[ i ].text.string ] = circles[ i ];
}
			}
		i = lines.length;
		while ( i-- )
		{lines[ i ].color = nspc;
			}
		parameters.canvas_handler.canvas_invalid = true;
		distances[ sn.label ] = 0;
		var queue = new Queue( );
		queue.enqueue( { node: sn, distances: distances } );
		while ( queue.size( ) != 0 )
        {var u = queue.dequeue( );
        visited[ u.node.label ] = 1;
        circle_lookup[ u.node.label ].color = NODE_VISITED_COLOR;
        parameters.canvas_handler.canvas_invalid = true;
			
			for ( var v = 0; v < number_of_nodes; ++v )
			{if ( adjacency_matrix[ u.node.label ][ v ] === -1 ) continue;
				var asd = distances[ u.node.label ] + adjacency_matrix[ u.node.label ][ v ];
				if ( asd < distances[ v ] )
				{distances[ v ] = asd;
                 pds[ v ] = u.node;
					if ( visited[ v ] != 1 )
					{queue.enqueue( { 
							node: nodes[ v ], 
							distances: distances, 
						} );
						}
				}
			}
			}
		var current_node = en;
		var predecessor_node = pds[ current_node.label ];
		if ( predecessor_node != -1 )
		{var current_circle = circle_lookup[ current_node.label ];
           current_circle.color = spc;
           parameters.canvas_handler.canvas_invalid = true;	
			var predecessor_circle = circle_lookup[ predecessor_node.label ];
			i = current_circle.lines_out.length;
			while ( i-- )
			{var line = current_circle.lines_out[ i ];
				if ( line.circle_in.text.string  === predecessor_circle.text.string ||
					line.circle_out.text.string === predecessor_circle.text.string )
				{line.color = spc;
					parameters.canvas_handler.canvas_invalid = true;	
					break;
				}
				}
i = current_circle.lines_in.length;
			
			while ( i-- )
			{var line = current_circle.lines_in[ i ];
               if ( line.circle_in.text.string  === predecessor_circle.text.string ||
				line.circle_out.text.string === predecessor_circle.text.string )
				{line.color = spc;
				parameters.canvas_handler.canvas_invalid = true;	
				break;
				}
}
			current_node = predecessor_node;
            predecessor_node = pds[ current_node.label ];
			
			while ( predecessor_node != -1 )
			{current_circle = circle_lookup[ current_node.label ];
			current_circle.color = spc;
            parameters.canvas_handler.canvas_invalid = true;
             predecessor_circle = circle_lookup[ predecessor_node.label ];
              i = current_circle.lines_out.length;
            while ( i-- )
				{var line = current_circle.lines_out[ i ];
					if ( line.circle_in.text.string  === predecessor_circle.text.string ||
						line.circle_out.text.string === predecessor_circle.text.string    )
					{line.color = spc;
						parameters.canvas_handler.canvas_invalid = true;
						break;
						}
				}
i = current_circle.lines_in.length;
              while ( i-- )
				{var line = current_circle.lines_in[ i ];
				if ( line.circle_in.text.string  === predecessor_circle.text.string ||
                 line.circle_out.text.string === predecessor_circle.text.string    )
					{line.color = spc;
						parameters.canvas_handler.canvas_invalid = true;
				     break;
						}
				}
				current_node = predecessor_node;
				predecessor_node = pds[ current_node.label ];
}
if ( current_node.label === sn.label )
			{current_circle = circle_lookup[ current_node.label ];
             current_circle.color = spc;
             parameters.canvas_handler.canvas_invalid = true;
}
}
		var brb       = document.getElementById( "brb" );
		brb.innerHTML = "Reset";
		brb.className = "button red_background visible";
		brb.onclick   = null;
		brb.onclick   = reset;
        return distances;
}
 
    //Resetting the Graph
  function reset( )
 {var circles = canvas_handler.circles;
var lines   = canvas_handler.lines;
var i = circles.length;
while( i-- )
		{circles[ i ].color = ndc;
}
i = lines.length;
while( i-- )
		{lines[ i ].color = edc;
         }
        sn = null;
		en   = null;
		ns = 0;
		var brb       = document.getElementById( "brb" );
		brb.innerHTML = "Begin";
		brb.className = "button green_background hidden";	
		brb.onclick   = null;
		var overlay = document.getElementById( "overlay" );
		document.body.removeChild( overlay );
		canvas_handler.canvas_invalid = true;
		}
	
 //Dragging events are handled using this function
	function dragging_udpate( event )
	{var circle = event.detail.circle;
		var node = graph_handler.nodes[ parseInt( circle.text.string, 10 ) ];
		node.x = circle.x;
		node.y = circle.y;
        node.update_edges( );
		graph_handler.update_adjacency_matrix( );
        var i = node.edges_out.length;
		while ( i-- )
		{circle.lines_out[ i ].text.string = parseFloat( node.edges_out[ i ].weight.toFixed( 2 ) );
         }
		i = node.edges_in.length;
		while ( i-- )
		{circle.lines_in[ i ].text.string = parseFloat( node.edges_in[ i ].weight.toFixed( 2 ) );
        }
     }
	canvas.addEventListener( "selectstart", function( event ) { 
event.preventDefault( ); 
return false; 
}, false );
	
    canvas.addEventListener( "dragging:started", function ( event ) {
		dragging_udpate( event );
        var circle = event.detail.circle;
		if ( ns === 0 )
		{circle.color = snc;
         sn = graph_handler.nodes[ parseInt( circle.text.string, 10 ) ];
			ns = 1;
}else if ( ns === 1 )
		{try
			{circles[ en.id   ].color = ndc;
} catch ( error ) { }
circle.color = enc;
en = graph_handler.nodes[ parseInt( circle.text.string, 10 ) ];
ns = 2;
	}
     else if ( ns === 2 )
		{try
        {circles[ sn.id ].color = ndc;
} catch ( error ) { }
     try
        {circles[ en.id   ].color = ndc;
} catch ( error ) { }
circle.color = snc;
sn = graph_handler.nodes[ parseInt( circle.text.string, 10 ) ];
en = null;
ns = 1;
	}
if ( en != null && sn.id === en.id )
		{try
        {circles[ sn.id ].color = ndc;
} catch ( error ) { }
        try
			{circles[ en.id   ].color = ndc;
				} 
            catch ( error ) { }
			circle.color = snc;
			sn = graph_handler.nodes[ parseInt( circle.text.string, 10 ) ];
			en   = null;
			ns = 1;
			
		}
		var brb = document.getElementById( "brb" );
		if ( sn != null && en != null )
		{brb.className = "button green_background visible";
			var shortest_path_parameters = {
				canvas_handler: canvas_handler,
				graph_handler: graph_handler,
				sn: sn,
				en: en
				};
			brb.onclick = function ( ) { 
             shortest_path_algorithm( shortest_path_parameters ); 
};
}
else
    {brb.className = "button green_background hidden";
     brb.onclick   = null;
}
}, false );
	canvas.addEventListener( "dragging:continuing", function ( event ) {
dragging_udpate( event );
}, false );
canvas.addEventListener( "dragging:stopped", function ( event ) {
dragging_udpate( event );
}, false );
	function render( timestamp )
	   {requestAnimationFrame( render );
        canvas_handler.draw_all( );
       }
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                 window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    requestAnimationFrame( render );
}
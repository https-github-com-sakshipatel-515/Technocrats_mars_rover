var non = 5;
var nr  = 28;
var nsw = 5;
var nbc = "#0000FF";
var nfc = "#4e9a06";
var ntc = "#ff0000";
var nnvc = "#FF9900";
var nvc  = "#0000FF";
var spec = "#28ED56";
var ebc = "#FF9900";
var envc = "#FF9900";
var nfsmi = -1;
var ntsmi   = -1;
var nse  =  0;
var canvas = null;

//This function is used to create the Adjacency matrix for the graph.
function create_adjm( )
{adjm = [ ];
	for ( row = 0; row < non; ++row )
	{row_temp = [ ];
for ( col = 0; col < non; ++col )
		{row_temp.push( -1 );
		}
adjm.push( row_temp );
}
for ( row = 0; row < non; ++row )
{for ( col = row; col < non; ++col )
		{if ( row === col )
			{continue; 
}
adjacent = random_integer_in_range( 0, 1 );
if ( adjacent === 1 )
			{adjm[ row ][ col ] = adjacent;
             adjm[ col ][ row ] = adjacent;
}else{adjacent = -1;
adjm[ row ][ col ] = adjacent;
adjm[ col ][ row ] = adjacent;
}
}
}
return adjm;
}

//Based on the Adjacency Matrix, a graph with all the nodes and edges is created using this function.
function cg( canvas, adjm )

//This function creates a canvas node.
{function create_cnoe( x, y, label ) 
	{var circle = new fabric.Circle( {
      strokeWidth: nsw,
radius: nr,
fill: nbc,
stroke: nbc
} );
		circle.hasControls = circle.hasBorders = false;
        circle.setShadow( "0px 0px 10px rgba( 0, 0, 0, 0.7 )" );
		var text = new fabric.Text( label.toString( ), {
		fontSize: 20,
        fontFamily: "Verdana, sans-serif",
        fill: "#fff"
} );
var cnoe = new fabric.Group( [ circle, text ], {
left: x,
top: y,
} );
cnoe.hasControls = cnoe.hasBorders = false;
     return cnoe;
}
 
 //This function creates a Canvas Edge.
function create_ced( canvas, crd, label ) 
	{var ced =  new fabric.Line( crd, {
fill: ebc,
stroke: ebc,
strokeWidth: 10,
selectable: false,
} );
		
		 ced.setShadow( "0px 0px 10px rgba( 0, 0, 0, 0.7 )" );
         var text = new fabric.Text( label.toString( ), {
         left: ( crd[ 0 ] + crd[ 2 ] ) / 2,
          top:  ( crd[ 1 ] + crd[ 3 ] ) / 2,
		fontSize: 20,
fontFamily: "Verdana, sans-serif",
fill: "#fff",
selectable: false
} );
text.setShadow( "0px 0px 5px rgba( 0, 0, 0, 0.9 )" );
canvas.add( text );
ced.edge_label = text;
return ced;
}
window_height = window.innerHeight;
window_width  = window.innerWidth;
	nodes = [ ];
	for ( i = 0; i < non; ++i )
	{var node_crd = { x: random_float_in_range((nr * 2 ) + nsw, window_width  - ( nr * 2 ) - nsw ), y: random_float_in_range( 70,window_height - ( nr * 2 ) - nsw )  };
		nodes.push( node_crd );
		var cnoe = create_cnoe( nodes[ i ].x, nodes[ i ].y, i );
		canvas.add( cnoe );
		cnoe.moveTo( 1 );
		nodes[ i ].cnoe = cnoe;
		nodes[ i ].ceds = [ ];
	}
	for ( row = 0; row < non; ++row )
	{for ( col = 0; col < non; ++col )
		{if ( adjm[ row ][ col ] != -1 )
			{var dex = nodes[ row ].x - nodes[ col ].x;
				var dey = nodes[ row ].y - nodes[ col ].y;
				var distance = Math.sqrt( ( dex * dex ) + ( dey * dey ) );
				adjm[ row ][ col ] = distance;
				var distance = parseFloat( distance ).toFixed( 2 );
			var ced = create_ced( canvas, [ nodes[ row ].x, nodes[ row ].y, nodes[ col ].x, nodes[ col ].y ], distance );
				canvas.add( ced ); 
				ced.moveTo( 0 );
				nodes[ row ].ceds.push( [ ced, "out", col ] );
				nodes[ col ].ceds.push( [ ced, "in", row ] );
				}
}
}
return nodes;
}
function random_float_in_range( mn, mx )
{return mn + ( mx - mn ) * Math.random( );
	}
function random_integer_in_range( mn, mx )
{return Math.floor( mn + ( 1 + mx - mn ) * Math.random( ) );
	
}function sleep( milliseconds ) 
{var start = new Date( ).getTime( );
	for ( var i = 0; i < 1e7; ++i ) 
    {if ( ( new Date( ).getTime( ) - start ) > milliseconds )
		{break;
		 	
		}	
    }
}

//Begin/Reset Button is created using this function.
function create_button( )
{var button       = document.createElement( "div" );
	button.id        = "button";
	button.className = "button green_background hidden";
	button.innerHTML = "Begin";
	document.body.appendChild( button );
}
function shortest_path_algorithm( canvas, nodes, adjm, nfsmi, ntsmi )
{function Queue( )
	{this.queue = [ ];
		
	}Queue.prototype.enqueue = function( item )
	{this.queue.push( item );
this.queue.sort( function( a, b ) { return a.distance[ a.node ] - b.distance[ b.node ] } );
}Queue.prototype.dequeue = function( )
	{this.queue.sort( function( a, b ) { return a.distance[ a.node ] - b.distance[ b.node ] } );
return this.queue.shift( );
}Queue.prototype.size = function( )
	{return this.queue.length;
		
	}Queue.prototype.peak = function( )
	{return ( this.queue[ 0 ] !== null ) ? this.queue[ 0 ] : null;
		
	}
	var ola            = document.createElement( "div" );
	ola.id             = "ola";
	ola.innerHTML      = "&nbsp;";	
	ola.style.position = "absolute";
	ola.style.left     = "0px";
	ola.style.top      = "0px";
	ola.style.zIndex   = 1;
	document.body.appendChild( ola );
	ola.width        = window.innerWidth;
	ola.height       = window.innerHeight;
	ola.style.width  = window.innerWidth  + "px";
	ola.style.height = window.innerHeight + "px";
	var distance    = [ ];
	var vsi      = [ ];
	var pde = [ ];
     for ( var i = 0; i < non; ++i )
	{distance.push( Number.MAX_VALUE );
		vsi.push( 0 );
		pde.push( -1 );
		nodes[ i ].cnoe.item( 0 ).set( { fill: nnvc, stroke: nnvc } );
		for ( var j = 0; j < nodes[ i ].ceds.length; ++j )
		{nodes[ i ].ceds[ j ][ 0 ].set( { fill: envc, stroke: envc } );
		}
		}
	distance[ nfsmi ] = 0;
	var queue = new Queue( );
	queue.enqueue( { node: nfsmi, distance: distance, vsi: vsi, pde: pde } );
	while ( queue.size( ) != 0 )
    {var u = queue.dequeue( );
		vsi[ u.node ] = 1;
		nodes[ u.node ].cnoe.item( 0 ).set( { fill: nvc, stroke: nvc } );
		for ( var v = 0; v < non; ++v )
		{if ( adjm[ u.node ][ v ] === -1 ) continue;
			var asd = distance[ u.node ] + adjm[ u.node ][ v ];
			if ( asd < distance[ v ] )
			{distance[ v ] = asd;
				pde[ v ] = u.node;
				if ( vsi[ v ] != 1 )
				{queue.enqueue( { node: v, distance: distance, vsi: vsi, pde: pde } );
				}
            }
		}	
    }
	var prv = pde[ ntsmi ];
	if ( prv != -1 )
	{nodes[ ntsmi ].cnoe.item( 0 ).set( { fill: spec, stroke: spec } );
     var ced_index = -1;
for ( var i = 0; i < nodes[ ntsmi ].ceds.length; ++i )
		{if ( nodes[ ntsmi ].ceds[ i ][ 2 ] === prv )
			{ced_index = i;
            break;
            }
}
if ( ced_index != -1 )
		{nodes[ ntsmi ].ceds[ ced_index ][ 0 ].set( { fill: spec, stroke: spec } );
}
		
		while ( prv != -1 )
		{nodes[ prv ].cnoe.item( 0 ).set( { fill: spec, stroke: spec } );
         var next = pde[ prv ];
         if ( next != -1 )
			{ced_index = -1;
            for ( var i = 0; i < nodes[ prv ].ceds.length; ++i )
				{if ( nodes[ prv ].ceds[ i ][ 2 ] === next )
					{ced_index = i;
				     break;
}
}
if ( ced_index != -1 )
				{nodes[ prv ].ceds[ ced_index ][ 0 ].set( { fill: spec, stroke: spec } );
			}
			}
			prv = pde[ prv ];
		}
		}
	canvas.renderAll( );
	var button       = document.getElementById( "button" );
	button.innerHTML = "Reset";
	button.className = "button red_background visible";
	button.onclick   = null;
	button.onclick   = function ( ) { reset( nodes ); };
	return distance;
}

//Resetting the Graph is done by this function.
function reset( nodes )
{for ( i = 0; i < non; ++i )
	{nodes[ i ].cnoe.item( 0 ).set( { fill: nbc, stroke: nbc } );
		for ( j = 0; j < nodes[ i ].ceds.length; ++j )
		{nodes[ i ].ceds[ j ][ 0 ].set( { fill: ebc, stroke: ebc } );
		}
}
	canvas.renderAll( );
	nfsmi = -1;
	ntsmi = -1;
	nse   =  0;
	var button       = document.getElementById( "button" );
	button.innerHTML = "Begin";
	button.className = "button green_background hidden";	
	button.onclick   = null;
	var ola = document.getElementById( "ola" );
	document.body.removeChild( ola );
	}
function create_loading_message( )
{   var lba       = document.createElement( "div" );
	lba.id        = "lba";
	lba.className = "lba";
	lba.innerHTML = "&nbsp;"
	document.body.appendChild( lba );
    var loading_text        = document.createElement( "span" );
	loading_text.id         = "loading_text";
	loading_text.className  = "loading_text";
	loading_text.innerHTML  = "Loading...";	
	document.body.appendChild( loading_text );
	loading_text.style.left = ( window.innerWidth / 2  ) - ( loading_text.clientWidth / 2  ) + "px";
	loading_text.style.top  = ( window.innerHeight / 2 ) - ( loading_text.clientHeight / 2 ) + "px";
}
window.onload = initialize;
function initialize( )
{create_loading_message( );
window.setTimeout( function ( ) {
	    var c_et    = document.createElement( "canvas" );
		c_et.width  = window.innerWidth;
		c_et.height = window.innerHeight;
		c_et.id     = "canvas";
		document.body.appendChild( c_et );
	    canvas = new fabric.Canvas( "canvas", { selection: false, backgroundColor: "#333" } );
	    fabric.Object.prototype.originX = fabric.Object.prototype.originY = "center";	
	     var adjm = create_adjm( );
	var nodes = cg( canvas, adjm );
	canvas.on( "object:selected", function( event ) {
	var cnoe = event.target;
			var tnn = parseInt( cnoe.item( 1 ).get( "text" ), 10 );
		nse += 1;			
		if ( nse === 3 )
			{nodes[ nfsmi ].cnoe.item( 0 ).set( { fill: nbc, stroke: nbc } );
			nodes[ ntsmi ].cnoe.item( 0 ).set( { fill: nfc, stroke: nfc } );
			nfsmi = ntsmi;
			ntsmi = -1;
			nse = 2;
}
	if ( nse === 1 && tnn != ntsmi )
			{cnoe.item( 0 ).set( { fill: nfc, stroke: nfc } );
			nfsmi = tnn;
}
else if ( nse === 2 && tnn != nfsmi )
			{cnoe.item( 0 ).set( { fill: ntc, stroke: ntc } );
			ntsmi = tnn;
}
		if ( ntsmi === -1 )
			{nse = 1;
           }
		var button = document.getElementById( "button" );
		if ( ntsmi != -1 && nfsmi != -1 )
			{button.className = "button green_background visible";
				button.onclick   = function ( ) { 
					shortest_path_algorithm( canvas, nodes, adjm, nfsmi, ntsmi ); 
				};
}else{button.className = "button green_background hidden";
				button.onclick   = null;
			}
			canvas.renderAll( );
		} );
	canvas.on( "object:moving" , function( event ) {
var cnoe = event.target;
var tnn = parseInt( cnoe.item( 1 ).get( "text" ), 10 );	
var node = nodes[ tnn ];
node.x = cnoe.get( "left" );
node.y = cnoe.get( "top"  );
        for ( i = 0; i < node.ceds.length; ++i )
			{if ( node.ceds[ i ][ 1 ] === "out" )
				{node.ceds[ i ][ 0 ].set( { "x1": node.x, "y1": node.y } );
				var dex = node.ceds[ i ][ 0 ].get( "x1" ) - node.ceds[ i ][ 0 ].get( "x2" );
					var dey = node.ceds[ i ][ 0 ].get( "y1" ) - node.ceds[ i ][ 0 ].get( "y2" );
				    var distance = Math.sqrt( ( dex * dex ) + ( dey * dey ) );
				    adjm[ tnn ][ node.ceds[ i ][ 2 ] ] = distance;
					adjm[ node.ceds[ i ][ 2 ] ][ tnn ] = distance;
				    distance = parseFloat( distance ).toFixed( 2 );
				     node.ceds[ i ][ 0 ].edge_label.set( { 
                   left: ( node.ceds[ i ][ 0 ].get( "x1" ) + node.ceds[ i ][ 0 ].get( "x2" ) ) / 2,
						top:  ( node.ceds[ i ][ 0 ].get( "y1" ) + node.ceds[ i ][ 0 ].get( "y2" ) ) / 2,
						text: distance.toString( )
				} );
					node.ceds[ i ][ 0 ].setCoords( );}
				else
				{node.ceds[ i ][ 0 ].set( { "x2": node.x, "y2": node.y } );
				var dex = node.ceds[ i ][ 0 ].get( "x1" ) - node.ceds[ i ][ 0 ].get( "x2" );
					var dey = node.ceds[ i ][ 0 ].get( "y1" ) - node.ceds[ i ][ 0 ].get( "y2" );
				var distance = Math.sqrt( ( dex * dex ) + ( dey * dey ) );
                adjm[ tnn ][ node.ceds[ i ][ 2 ] ] = distance;
					adjm[ node.ceds[ i ][ 2 ] ][ tnn ] = distance;
				distance = parseFloat( distance ).toFixed( 2 );
            node.ceds[ i ][ 0 ].edge_label.set( { 
                  left: ( node.ceds[ i ][ 0 ].get( "x1" ) + node.ceds[ i ][ 0 ].get( "x2" ) ) / 2,
						top:  ( node.ceds[ i ][ 0 ].get( "y1" ) + node.ceds[ i ][ 0 ].get( "y2" ) ) / 2,
						text: distance.toString( )
					} );
					node.ceds[ i ][ 0 ].setCoords( );
			
				}
           }
			node.cnoe.setCoords( );
			canvas.renderAll( );
} );
	    document.body.removeChild( document.getElementById( "lba" ) );
		document.body.removeChild( document.getElementById( "loading_text" ) );
	}, 500 );

}

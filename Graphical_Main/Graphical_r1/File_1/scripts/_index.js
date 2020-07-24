var non = 5;
var nr  = 28;
var nsw = 5;

var nbc  = "#45f";
var nfc  = "#4e9a06";
var ntc  = "#ff0000";
var nnvc = "#0000FF";
var nvc  = "#0000FF";
var spec = "#9335d9";
var ebc  = "#FF9900";
var envc = "#FF9900";
var nfsmi = -1;
var ntsmi   = -1;
var ns  =  0;
var canvas = null;

//This will create the adjacency matrix for the graph.
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
			}
			else
			{adjacent = -1;
             adjm[ row ][ col ] = adjacent;
			 adjm[ col ][ row ] = adjacent;
			}
		}
	}
	return adjm;
}

//Based on the adjacency matrix, let us create the graph with all the nodes and edges.
function cg( canvas, adjm )

//Creating a canvas node
{function create_cno( x, y, label )
	{var C = new fabric.Circle( {
     strokeWidth: nsw,
     radius: nr,
     fill: nbc,
     stroke: nbc
} );
C.hasControls = C.hasBorders = false;
C.setShadow( "0px 0px 10px rgba( 0, 0, 0, 0.7 )" );
var text = new fabric.Text( label.toString( ), {
fontSize: 20,
fontFamily: "Verdana, sans-serif",
fill: "#fff"
} );
var cno = new fabric.Group( [ C, text ], {
left: x,
top: y,
} );
cno.hasControls = cno.hasBorders = false;
return cno;
}
 
 //Creating a canvas Edge
function ccee( canvas, crd, label ) 
	{var c_ee =  new fabric.Line( crd, {
          fill: ebc,
          stroke: ebc,
          strokeWidth: 5,
          selectable: false,
} );
c_ee.setShadow( "0px 0px 10px rgba( 0, 0, 0, 0.7 )" );
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
c_ee.edge_label = text;
return c_ee;
}
window_height = window.innerHeight;
window_width  = window.innerWidth;
nodes = [ ];
for ( i = 0; i < non; ++i )
	{   var nco = { x: random_float_in_range( ( nr * 2 ) + nsw, window_width  - ( nr * 2 ) - nsw ),
		                         y: random_float_in_range( 70, window_height - ( nr * 2 ) - nsw )  };
		nodes.push( nco );
		var cno = create_cno( nodes[ i ].x, nodes[ i ].y, i );
		canvas.add( cno );
		cno.moveTo( 1 );
		nodes[ i ].cno = cno;
		nodes[ i ].c_ees = [ ];
	}
	for ( row = 0; row < non; ++row )
	{for ( col = 0; col < non; ++col )
		{if ( adjm[ row ][ col ] != -1 )
			{var delx = nodess[ row ].x - nodes[ col ].x;
				var dely = nodes[ row ].y - nodes[ col ].y;
				var distance = Math.sqrt( ( delx * delx ) + ( dely * dely ) );
				adjm[ row ][ col ] = distance;
				var distance = parseFloat( distance ).toFixed( 2 );
			    var c_ee = ccee( canvas, [ nodes[ row ].x, nodes[ row ].y, nodes[ col ].x, nodes[ col ].y ], distance );
			 	canvas.add( c_ee ); 
				c_ee.moveTo( 0 );
				nodes[ row ].c_ees.push( [ c_ee, "out", col ] );
				nodes[ col ].c_ees.push( [ c_ee, "in", row ] );
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
	
}
function sleep( milliseconodes ) 
{var start = new Date( ).getTime( );
	for ( var i = 0; i < 1e7; ++i ) 
	{if ( ( new Date( ).getTime( ) - start ) > milliseconodes )
		{break;
		 	
		}
   }
}

//Let us create Begin/Reset Button.
function cb( )
{   var button       = document.createElement( "div" );
	button.id        = "button";
	button.className = "button blue_background hidden";
	button.innerHTML = "Begin";
	document.body.appendChild( button );
	
}
function shortest_path_algorithm( canvas, nodes, adjm, nfsmi, ntsmi )
{function Queue( )
	{this.queue = [ ];
		
	}
 Queue.prototype.enqueue = function( item )
	{this.queue.push( item );
     this.queue.sort( function( a, b ) { return a.distances[ a.node ] - b.distances[ b.node ] } );
}
Queue.prototype.dequeue = function( )
	{this.queue.sort( function( a, b ) { return a.distances[ a.node ] - b.distances[ b.node ] } );
    return this.queue.shift( );
	}
Queue.prototype.size = function( )
	{return this.queue.length;
	}
Queue.prototype.peak = function( )
	{return ( this.queue[ 0 ] !== null ) ? this.queue[ 0 ] : null;	
	}
	var block            = document.createElement( "div" );
	block.id             = "block";
	block.innerHTML      = "&nbsp;";	
	block.style.position = "absolute";
	block.style.left     = "0px";
	block.style.top      = "0px";
	block.style.zIndex   = 4;
	document.body.appendChild( block );
	block.width        = window.innerWidth;
	block.height       = window.innerHeight;
	block.style.width  = window.innerWidth  + "px";
	block.style.height = window.innerHeight + "px";
	var distances    = [ ];
	var visited      = [ ];
	var pds = [ ];
	for ( var i = 0; i < non; ++i )
	{distances.push( Number.MAX_VALUE );
		visited.push( 0 );
		pds.push( -1 );
		nodes[ i ].cno.item( 0 ).set( { fill: nnvc, stroke: nnvc } );
		for ( var j = 0; j < nodes[ i ].c_ees.length; ++j )
		{nodes[ i ].c_ees[ j ][ 0 ].set( { fill: envc, stroke: envc } );
		}
		}
	distances[ nfsmi ] = 0;
	var queue = new Queue( );
	queue.enqueue( { node: nfsmi, distances: distances, visited: visited, pds: pds } );
	while ( queue.size( ) != 0 )
    {var u = queue.dequeue( );
     visited[ u.node ] = 1;
     nodes[ u.node ].cno.item( 0 ).set( { fill: nvc, stroke: nvc } );
     for ( var v = 0; v < non; ++v )
		{if ( adjm[ u.node ][ v ] === -1 ) continue;
     var asd = distances[ u.node ] + adjm[ u.node ][ v ];
    if ( asd < distances[ v ] )
			{distances[ v ] = asd;
              pds[ v ] = u.node;
				if ( visited[ v ] != 1 )
				{queue.enqueue( { node: v, distances: distances, visited: visited, pds: pds } );
				}
			}
		  }
		}
	var previous = pds[ ntsmi ];
	if ( previous != -1 )
	{nodes[ ntsmi ].cno.item( 0 ).set( { fill: spec, stroke: spec } );
     var c_ee_index = -1;
		for ( var i = 0; i < nodes[ ntsmi ].c_ees.length; ++i )
		{if ( nodes[ ntsmi ].c_ees[ i ][ 2 ] === previous )
			{c_ee_index = i;
              break;
}
}
if ( c_ee_index != -1 )
		{nodes[ ntsmi ].c_ees[ c_ee_index ][ 0 ].set( { fill: spec, stroke: spec } );
}
		while ( previous != -1 )
		{nodes[ previous ].cno.item( 0 ).set( { fill: spec, stroke: spec } );
	     var next = pds[ previous ];
        if ( next != -1 )
			{c_ee_index = -1;
		for ( var i = 0; i < nodes[ previous ].c_ees.length; ++i )
				{if ( nodes[ previous ].c_ees[ i ][ 2 ] === next )
					{c_ee_index = i;
				     break;
                   }
			}
		if ( c_ee_index != -1 )
				{nodes[ previous ].c_ees[ c_ee_index ][ 0 ].set( { fill: spec, stroke: spec } );
                }
			}
			previous = pds[ previous ];
           }
		}
	canvas.renderAll( );
	var button       = document.getElementById( "button" );
	button.innerHTML = "Reset";
	button.className = "button red_background visible";
	button.onclick   = null;
	button.onclick   = function ( ) { reset( nodes ); };
	return distances;
}

//Resetting the Graph.
function reset( nodes )
{for ( i = 0; i < non; ++i )
	{nodes[ i ].cno.item( 0 ).set( { fill: nbc, stroke: nbc } );
		for ( j = 0; j < nodes[ i ].c_ees.length; ++j )
		{nodes[ i ].c_ees[ j ][ 0 ].set( { fill: ebc, stroke: ebc } );
		}
     }
	canvas.renderAll( );
	nfsmi = -1;
	ntsmi = -1;
	ns    =  0;
	var button       = document.getElementById( "button" );
	button.innerHTML = "Begin";
	button.className = "button blue_background hidden";	
	button.onclick   = null;
	var block = document.getElementById( "block" );
	document.body.removeChild( block );
	
}
function create_loading_message( )
{var loading_background       = document.createElement( "div" );
	loading_background.id        = "loading_background";
	loading_background.className = "loading_background";
	loading_background.innerHTML = "&nbsp;"
	document.body.appendChild( loading_background );
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
cb( );
var cel    = document.createElement( "canvas" );
cel.width  = window.innerWidth;
cel.height = window.innerHeight;
cel.id     = "canvas";
document.body.appendChild( cel );
canvas = new fabric.Canvas( "canvas", { selection: false, backgroundColor: "#333" } );
fabric.Object.prototype.originX = fabric.Object.prototype.originY = "center";	
var adjm = create_adjm( );
var nodes = cg( canvas, adjm );
canvas.on( "object:selected", function( event ) {
var cno = event.target;
var tnn = parseInt( cno.item( 1 ).get( "text" ), 10 );
ns += 1;			
if ( ns === 3 )
{nodes[ nfsmi ].cno.item( 0 ).set( { fill: nbc, stroke: nbc } );
nodes[ ntsmi ].cno.item( 0 ).set( { fill: nfc, stroke: nfc } );
nfsmi = ntsmi;
ntsmi = -1;
ns = 2;
}
if ( ns === 1 && tnn != ntsmi )
			{cno.item( 0 ).set( { fill: nfc, stroke: nfc } );
			nfsmi = tnn;
            }
			else if ( ns === 2 && tnn != nfsmi )
			{cno.item( 0 ).set( { fill: ntc, stroke: ntc } );
			ntsmi = tnn;
            }
		if ( ntsmi === -1 )
			{ns = 1;
           }
var button = document.getElementById( "button" );
		
			if ( ntsmi != -1 && nfsmi != -1 )
			{button.className = "button blue_background visible";
				button.onclick   = function ( ) { 
				shortest_path_algorithm( canvas, nodes, adjm, nfsmi, ntsmi ); 
				};
               }
			else
			{button.className = "button blue_background hidden";
				button.onclick   = null;
			
			}
			canvas.renderAll( );
	
		} );
	canvas.on( "object:moving" , function( event ) {

			var cno = event.target;
            var tnn = parseInt( cno.item( 1 ).get( "text" ), 10 );
             var node = nodes[ tnn ];
		
			node.x = cno.get( "left" );
			node.y = cno.get( "top"  );
		
			for ( i = 0; i < node.c_ees.length; ++i )
			{if ( node.c_ees[ i ][ 1 ] === "out" )
				{node.c_ees[ i ][ 0 ].set( { "x1": node.x, "y1": node.y } );
                    var delx = node.c_ees[ i ][ 0 ].get( "x1" ) - node.c_ees[ i ][ 0 ].get( "x2" );
					var dely = node.c_ees[ i ][ 0 ].get( "y1" ) - node.c_ees[ i ][ 0 ].get( "y2" );
				    var distance = Math.sqrt( ( delx * delx ) + ( dely * dely ) );
				
					adjm[ tnn ][ node.c_ees[ i ][ 2 ] ] = distance;
					adjm[ node.c_ees[ i ][ 2 ] ][ tnn ] = distance;
                    distance = parseFloat( distance ).toFixed( 2 );
				    node.c_ees[ i ][ 0 ].edge_label.set( { 
				     left: ( node.c_ees[ i ][ 0 ].get( "x1" ) + node.c_ees[ i ][ 0 ].get( "x2" ) ) / 2,
						top:  ( node.c_ees[ i ][ 0 ].get( "y1" ) + node.c_ees[ i ][ 0 ].get( "y2" ) ) / 2,
						text: distance.toString( )
					
					} );
					node.c_ees[ i ][ 0 ].setCoords( );
                }
				else
				{node.c_ees[ i ][ 0 ].set( { "x2": node.x, "y2": node.y } );
				var delx = node.c_ees[ i ][ 0 ].get( "x1" ) - node.c_ees[ i ][ 0 ].get( "x2" );
				var dely = node.c_ees[ i ][ 0 ].get( "y1" ) - node.c_ees[ i ][ 0 ].get( "y2" );
				var distance = Math.sqrt( ( delx * delx ) + ( dely * dely ) );
				
					adjm[ tnn ][ node.c_ees[ i ][ 2 ] ] = distance;
					adjm[ node.c_ees[ i ][ 2 ] ][ tnn ] = distance;
				    distance = parseFloat( distance ).toFixed( 2 );
				    node.c_ees[ i ][ 0 ].edge_label.set( { 
				    left: ( node.c_ees[ i ][ 0 ].get( "x1" ) + node.c_ees[ i ][ 0 ].get( "x2" ) ) / 2,
				    top:  ( node.c_ees[ i ][ 0 ].get( "y1" ) + node.c_ees[ i ][ 0 ].get( "y2" ) ) / 2,
				    text: distance.toString( )
					} );
					node.c_ees[ i ][ 0 ].setCoords( );
			}
		}
         node.cno.setCoords( );
         canvas.renderAll( );
       } );
	    document.body.removeChild( document.getElementById( "loading_background" ) );
		document.body.removeChild( document.getElementById( "loading_text" ) );
	}, 500 );
}

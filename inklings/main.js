var canvas,
	context,
	gameover = true,
	imagesLoaded = 0,
	imagesToLoad = 0,
	drawings = [],
	rubbers = [],
	lines = [],
	previewLine = null,
	rubberImage = null,
	rubberIntervalID = null,
	lineLimit = 5,
	offsets = [

		16, 20,
		34, 10,
		41, 15,
		24, 26,
		19, 21,
		34, 16,
		21, 19,
		30, 21,
		18, 21,
		18, 20,
		16, 17,
		42, 19,
		49, 12,
		26, 18,
		26, 15,
		23, 15,
		19, 11,
		13, 13

	];

function init() {

	var i;

	Goal.init();

	for ( i = 0; i < offsets.length / 2; i++ ) {

		drawings.push( new Drawing( 
			Math.random() * canvas.width * 2 / 3 + canvas.width / 6,
			Math.random() * canvas.height * 2 / 3 + canvas.height / 6,
			offsets[i * 2],
			offsets[i * 2 + 1],
			'images/image' + ( i + 1 ) + '.png'
		) );

	}

	rubberImage = new Image();

	rubberImage.onload = function() {

		imagesLoaded++;

		start();

	};

	rubberImage.src = 'images/rubber.png';

	imagesToLoad++;

	context.lineWidth = 3;

};

function start() {

	if ( imagesToLoad === imagesLoaded ) {

		canvas.addEventListener( 'mousedown', function( event ) {

			if ( event.button === 0 ) {

				previewLine = new Line( event.clientX, event.clientY );
				previewLine.addDot( event.clientX, event.clientY );

			}

		}, false );


		canvas.addEventListener( 'mousemove', function( event ) {

			if ( event.button === 0 && previewLine ) {

				previewLine.setEnd( event.clientX, event.clientY );

			}

		}, false );


		canvas.addEventListener( 'mouseup', function( event ) {

			if ( event.button === 0 && previewLine ) {

				if ( lines.length === lineLimit ) {

					lines.shift();

				}

				lines.push( previewLine );
				previewLine = null;

			}

		}, false );


		document.addEventListener( "keydown", function( event ) {

			if ( event.keyCode === 27 /* ECS */ ) {

				clearInterval( rubberIntervalID );
				gameover = true;

			}

		}, false );


		document.addEventListener( "keyup", function( event ) {

		}, false );

		rubberIntervalID = setInterval( addRubber, 3000 );
		addRubber();

		gameover = false;
		step();

	}

}

function step() {

	update();
	draw();

	if ( !gameover ) {

		requestAnimationFrame( step, canvas );

	}

};

function update() {

	var i, j, max, d, vec, dir;

	if ( !drawings.length ) {

		fin();
		return;

	}

	for ( i = 0; i < drawings.length; i++ ) {

		drawings[i].update();

		if ( drawings[i].isPointInBox( Goal.position ) ) {

			drawings.splice( i, 1 );
			addPoint();

		}

	}

	for ( i = 0; i < lines.length; i++ ) {

		for ( j = 0; j < drawings.length; j++ ) {

			if ( lines[i].collidesWithRoamer( drawings[j] ) ) {

				lines[i].bounceOff( drawings[j] );
				// drawings[j].movement.mulSelf( -1 );

			}

		}

		for ( j = 0; j < rubbers.length; j++ ) {

			if ( lines[i].collidesWithRoamer( rubbers[j] ) ) {

				lines.splice( i, 1 );
				rubbers.splice( j, 1 );
				i--;

			}

		}

	}

	out : for ( i = 0; i < rubbers.length; i++ ) {

		rubbers[i].update();
		max = Infinity;

		for ( j = 0; j < drawings.length; j++ ) {

			if ( rubbers[i].collidesWithRoamer( drawings[j] ) ) {

				drawings.splice( j, 1 );
				rubbers.splice( i, 1 );

				continue out;

			}

			vec = drawings[j].position.sub( rubbers[i].position );
			d = vec.normSquared();

			if ( d < max ) {

				max = d;
				pos = vec;

			}

		}

		rubbers[i].movement = pos.normalizeSelf().mulSelf( 1.2 );

	}

};

function draw() {

	var i;

	context.clearRect( 0, 0, canvas.width, canvas.height );

	Goal.draw();

	for ( i = 0; i < drawings.length; i++ ) {

		drawings[i].draw();

	}

	for ( i = 0; i < rubbers.length; i++ ) {

		rubbers[i].draw();

	}

	if ( previewLine ) {

		context.strokeStyle = 'gray';
		previewLine.draw();

	}

	context.strokeStyle = 'black';

	for ( i = 0; i < lines.length; i++ ) {

		lines[i].draw();

	}

};

function addRubber() {

	var mid = new Vector( canvas.width / 2, canvas.height / 2, 0 ),
		radius = mid.rotate2D( Math.random() * Math.PI * 2 );

	if ( Math.abs( radius.y ) > mid.y ) {

		radius.mulSelf( mid.y / Math.abs( radius.y ) + 0.1 );

	} else {

		radius.mulSelf( mid.x / Math.abs( radius.x ) + 0.1 );

	}

	mid.addSelf( radius );

	rubbers.push( new Rubber( mid.x, mid.y, rubberImage ) );

};

function addPoint() {

	var p = document.querySelector('#points'),
		points = parseInt( p.innerHTML );

	p.innerHTML = ++points;

}

function fin() {

	gameover = true;
	clearInterval( rubberIntervalID );
	document.querySelector('#points').innerHTML += "<br />well done!";

}

function extend( destination, source ) {

	for ( var key in source ) {

		if ( source.hasOwnProperty( key ) ) {

			destination[key] = source[key];

		}

	}

	return destination;

};

window.onload = function () {

	canvas = document.createElement( "canvas" );
	context = null;

	if ( !!window.CanvasRenderingContext2D ) {

		context = canvas.getContext( "2d" );

	}

	if ( !context ) {

		return;

	}

	document.querySelector( "#container" ).appendChild( canvas );
	canvas.style.backgroundColor = "lightblue";
	canvas.style["background-image"] = "url('images/paper.jpeg')";

	canvas.width = window.innerWidth,
	canvas.height = window.innerHeight;

	init();

};

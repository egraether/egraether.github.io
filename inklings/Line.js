var Line = function( x, y ) {

	this.dots = [ new Vector( x, y ) ];

};

Line.prototype = {

	update : function() {

	},

	draw : function() {

		var i;

		context.beginPath();
		context.moveTo( this.dots[0].x, this.dots[0].y );
		context.lineTo( this.dots[1].x, this.dots[1].y );

		// for ( i = 1; i < this.dots.length; i++ ) {
		// 
		// 	context.lineTo( this.dots[i].x, this.dots[i].y );
		// 
		// }

		context.closePath();

		context.stroke();

	},

	addDot : function( x, y ) {

		this.dots.push( new Vector( x, y ) );

	},

	setEnd : function( x, y ) {

		var dot = this.dots[ this.dots.length - 1 ];

		dot.x = x;
		dot.y = y;

	},

	collidesWithRoamer: function( roamer ) {

		var p1 = this.dots[0],
			p2 = this.dots[1],
			p3 = roamer.position.clone(),
			p4 = roamer.position.clone();

		p4.x += 60;

		if ( this.linesOverlap( p1, p2, p3, p4 ) ) {

			return true;

		}

		p3.copy( p4 );
		p4.y += 100;

		if ( this.linesOverlap( p1, p2, p3, p4 ) ) {

			return true;

		}

		p3.copy( p4 );
		p4.x -= 60;

		if ( this.linesOverlap( p1, p2, p3, p4 ) ) {

			return true;

		}

		p3.copy( p4 );
		p4.y -= 100;

		if ( this.linesOverlap( p1, p2, p3, p4 ) ) {

			return true;

		}

		return false;

	},

	linesOverlap : function( p1, p2, p3, p4 ) {

		var bx = p2.x - p1.x,
			by = p2.y - p1.y,
			dx = p4.x - p3.x,
			dy = p4.y - p3.y,
			b_dot_d_perp = bx * dy - by * dx;

		if ( b_dot_d_perp === 0 ) {

		  return false;

		}

		var cx = p3.x - p1.x,
			cy = p3.y - p1.y,
			t = ( cx * dy - cy * dx ) / b_dot_d_perp,
			u = ( cx * by - cy * bx ) / b_dot_d_perp;

		return ( t >= 0 && t <= 1 && u >= 0 && u <= 1 );

	},

	bounceOff : function( roamer ) {

		var angle,
			vec = this.dots[0].sub( this.dots[1] ),
			nor = new Vector( vec.y, -vec.x );

		roamer.movement.mulSelf( -1 );

		angle = vec.angle( roamer.movement );

		if ( nor.dot( roamer.movement ) > 1 ) {

			angle = 2 * angle - Math.PI;

		} else {

			angle = Math.PI - 2 * angle;

		}


		roamer.movement.rotate2DSelf( angle );

	}

};
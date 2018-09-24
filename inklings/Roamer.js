var Roamer = function( x, y ) {

	this.position = new Vector( x, y );
	this.offset = new Vector();

	this.movement = new Vector( Math.random() - 0.5 , Math.random() - 0.5 );
	this.movement.normalizeSelf();

	this.image = null;

};

Roamer.prototype = {

	update : function() {

		this.position.addSelf( this.movement );

		if ( this.position.x < 0 || this.position.x + 60 > canvas.width ) {

			this.movement.x *= -1;

		}

		if ( this.position.y < 0 || this.position.y + 100 > canvas.height ) {

			this.movement.y *= -1;

		}

	},

	draw : function() {

		context.drawImage( 
			this.image, 
			this.position.x - this.offset.x, 
			this.position.y - this.offset.y
		);

	},

	collidesWithRoamer : function( roamer ) {

		var p = roamer.position.clone();

		if ( this.isPointInBox( p ) ) {

			return true;

		}

		p.x += 60;

		if ( this.isPointInBox( p ) ) {

			return true;

		}

		p.y += 100;

		if ( this.isPointInBox( p ) ) {

			return true;

		}

		p.x -= 60;

		if ( this.isPointInBox( p ) ) {

			return true;

		}

		return false;

	},

	isPointInBox : function( p ) {

		var pos = this.position;

		return ( p.x > pos.x && p.x < pos.x + 60 && p.y > pos.y && p.y < pos.y + 100 );

	}

};
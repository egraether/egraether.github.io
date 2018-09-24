var Rubber = function( x, y, image ) {

	Roamer.call( this, x, y );
	this.image = image;

	this.offset = new Vector( 0, 0 );

}

Rubber.prototype = new Roamer();

extend( Rubber.prototype, {

	update : function() {

		this.position.addSelf( this.movement );

	},

	draw : function() {

		context.fillStyle = "red";

		context.fillRect( this.position.x, this.position.y, 60, 100 );
		context.drawImage( this.image, this.position.x, this.position.y, this.image.width, this.image.height );

	}

});
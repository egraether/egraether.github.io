var Drawing = function( x, y, ox, oy, imagePath ) {

	Roamer.call( this, x, y );

	this.offset = new Vector( ox, oy );

	this.image = new Image();

	this.image.onload = function() {

		imagesLoaded++;

		start();

	};

	this.image.src = imagePath;

	imagesToLoad++;

}

Drawing.prototype = new Roamer();

extend( Drawing.prototype, {

});
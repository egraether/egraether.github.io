var Goal = {

	init : function() {

		this.position = new Vector( 
			Math.random() * canvas.width * 2 / 3 + canvas.width / 6,
			Math.random() * canvas.height * 2 / 3 + canvas.height / 6
		);

		this.size = 50;

		this.image = new Image();

		this.image.onload = function() {

			imagesLoaded++;

			start();

		};

		this.image.src = 'images/goal.png';

		imagesToLoad++;

	},

	update : function() {

	},

	draw : function() {

		context.fillStyle = 'lightgreen';

		context.beginPath();
		context.arc( this.position.x, this.position.y, this.size, 0, Math.PI * 2, true );
		context.fill();

		context.drawImage( 
			this.image, 
			this.position.x - this.image.width / 2, 
			this.position.y - this.image.height / 2
		);

	}

};
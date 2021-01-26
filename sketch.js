const flock = []

function setup() {
	createCanvas(windowWidth, windowHeight-5);
	for(let i=0; i<100; i++){
	flock.push(new Boid(i))
	}
}

function windowResized() {
   resizeCanvas(windowWidth, windowHeight-5);
}

function draw() {
	background(51);

	for(const boid of flock) {
		// boid.edges();
		boid.flock(flock);
		boid.update();
		boid.show();
	}
}
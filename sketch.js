const flock = []

function setup() {
	createCanvas(windowWidth, windowHeight);
	for(let i=0; i<100; i++){
	flock.push(new Boid(i))
	}
}

function draw() {
	background(51);

	for(const boid of flock) {
		boid.edges();
		boid.flock(flock);
		boid.update();
		boid.show();
	}
}
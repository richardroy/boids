class Boid {
	constructor(id) {
		this.id = id;
		this.position = createVector(random(width), random(height));
		this.velocity = p5.Vector.random2D();
		this.velocity.setMag(2);
		this.acceleration = createVector();
		this.maxForce = 0.1;
		this.maxSpeed = 5;
		this.perception = 50;

		this.wanderAngle = random()*PI*2;;
	}

	edges() {
		if(this.position.x > width + 20)
			this.position.x = -20;
		else if (this.position.x < -20)
			this.position.x = width + 20

		if(this.position.y > height + 20)
			this.position.y = -20
		else if (this.position.y < -20)
			this.position.y = height + 20
	}

	align(boids) {
		let steering = createVector(); 
		let total = 0;
		for(let other of boids) {
			let d = dist(this.position.x, this.position.y, other.position.x, other.position.y)
			if(other != this && d < this.perception) {
				steering.add(other.velocity);
				total += 1
			}
		}
		if(total > 0){
			steering.div(total);
			steering.setMag(this.maxSpeed)
			steering.sub(this.velocity);
			steering.limit(this.maxForce);
		}

		return steering
	}

	seperation(boids) {
		let steering = createVector(); 
		let total = 0;
		for(let other of boids) {
			let d = dist(this.position.x, this.position.y, other.position.x, other.position.y)
			if(other != this && d < this.perception) {
				let diff = p5.Vector.sub(this.position, other.position);
				diff.div(d)
				steering.add(diff);
				total += 1
			}
		}
		if(total > 0){
			steering.div(total);
			steering.setMag(this.maxSpeed)
			steering.sub(this.velocity);
			steering.limit(this.maxForce);
		}

		return steering
	}

	cohesion(boids) {
		let steering = createVector(); 
		let total = 0;
		for(let other of boids) {
			let d = dist(this.position.x, this.position.y, other.position.x, other.position.y)
			if(other != this && d < this.perception) {
				steering.add(other.position);
				total += 1
			}
		}
		if(total > 0){
			steering.div(total);
			steering.sub(this.position);
			steering.setMag(this.maxSpeed)
			steering.sub(this.velocity);
			steering.limit(this.maxForce);

			if(this.id == -1) {
				console.log('**************************')
				console.log('position: ', this.position)
				console.log('maxSpeed: ', this.maxSpeed)
				console.log('velocity: ', this.velocity)
				console.log('maxForce: ', this.maxForce)
				console.log('steering: ', steering)
				console.log('**************************')
			}
		}

		return steering
	}

	flock(boids) {
		this.acceleration.set(0.0);
		let alignment = this.align(boids);
		let cohesion = this.cohesion(boids);
		let seperation = this.seperation(boids);
		let wander = this.wander();

		this.acceleration.add(alignment.mult(1.0));
		this.acceleration.add(cohesion.mult(1.0));
		this.acceleration.add(seperation.mult(1.0));
		this.acceleration.add(wander.mult(0.75));
	}

	update() {
		this.position.add(this.velocity);
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed)
	}

	wander() {
		let wanderDistance = 10;
    let wanderRadius = 24;
    let wanderAngle = 0;
    let wanderRange = 1;

		// console.log(this.velocity.normalize())
		let wanderCircle = createVector(this.position.x + this.velocity.copy().normalize().x * 24, this.position.y + this.velocity.copy().normalize().y * 24)
		// circle(wanderCircle.x, wanderCircle.y, wanderRadius);
    let wanderPoint = new createVector(wanderCircle.x, wanderCircle.y).rotate(wanderAngle);
    let rand = p5.Vector.random2D();
    // console.log(rand.normalize())

		this.wanderAngle = (this.wanderAngle + (random() - 0.5) * 0.5) 
		let x = cos(this.wanderAngle)*12;
		let y = sin(this.wanderAngle)*12;

		// line(wanderCircle.x, wanderCircle.y, wanderCircle.x + x, wanderCircle.y + y)

		let steering = createVector(wanderCircle.x + x, wanderCircle.y + y);
		steering.sub(this.position);
		steering.setMag(this.maxSpeed)
		steering.sub(this.velocity);
		steering.limit(this.maxForce);		
		return steering;
	}

	show() {
		stroke(255);
		if (this.id == 0) {
			stroke(0, 255, 0);
			// console.log(this.acceleration)
		}

		let triangleSize = 6;
		strokeWeight(2);
		push();
		translate(this.position.x, this.position.y);
		rotate(this.velocity.heading() - radians(90));
        triangle(
          -triangleSize,
          -triangleSize,
          triangleSize,
          -triangleSize,
          0,
          triangleSize
        );
		pop();

		stroke(255, 0, 0);
		point(this.position.x, this.position.y);

		fill(0, 0, 0, 0)

		stroke(255);

		if(this.acceleration.x != 0 && this.acceleration.y != 0){
			// line(
			// 	this.position.x, this.position.y,
			// 	this.position.x + this.acceleration.x * 100,
			// 	this.position.y + this.acceleration.y * 100
			// )

			// line(
			// 	this.position.x, this.position.y,
			// 	this.position.x + this.velocity.x * 100,
			// 	this.position.y + this.velocity.y * 100
			// )

			// console.log(this.velocity)
		}
		// circle(this.position.x, this.position.y, this.perception * 2)
	}
}

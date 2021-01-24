class Boid {
	constructor(id) {
		this.id = id;
		this.position = createVector(random(width), random(height));
		this.velocity = p5.Vector.random2D();
		this.velocity.setMag(random(2,4 ));
		this.acceleration = createVector();
		this.maxForce = 0.2;
		this.maxSpeed = 4;
		this.perception = 50;
	}

	edges() {
		if(this.position.x > width)
			this.position.x = 0;
		else if (this.position.x < 0)
			this.position.x = width

		if(this.position.y > height)
			this.position.y = 0
		else if (this.position.y < 0)
			this.position.y = height
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
		}

		return steering
	}

	flock(boids) {
		this.acceleration.set(0.0);
		let alignment = this.align(boids);
		let cohesion = this.cohesion(boids);
		let seperation = this.seperation(boids);
		this.acceleration.add(alignment.mult(1.0));
		this.acceleration.add(cohesion.mult(0.8));
		this.acceleration.add(seperation.mult(1.2));
	}

	update() {
		this.position.add(this.velocity);
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed)
	}

	show() {
		let triangleSize = 12;
		strokeWeight(2);
		push();
		stroke(255);
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
		circle(this.position.x, this.position.y, this.perception * 2)
	}
}

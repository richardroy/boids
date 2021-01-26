class Boid {
	constructor(id) {
		this.id = id;
		this.position = createVector(random(width), random(height));
		this.velocity = p5.Vector.random2D();
		this.velocity.setMag(2);
		this.acceleration = createVector();
		this.maxForce = 0.1;
		this.maxSpeed = 5;
		this.perception = 100;

		this.wanderAngle = random()*PI*2;;
	}

	edges() {
		
		const leftEdge1 = createVector(20, 20);
		const leftEdge2 = createVector(20, height-20);

		const topEdge1 = createVector(20, 20);
		const topEdge2 = createVector(width-20, 20);

		const rightEdge1 = createVector(width-20, height-20);
		const rightEdge2 = createVector(width-20, 20);

		const bottomEdge1 = createVector(width-20, height-20);
		const bottomEdge2 = createVector(20, height-20);

		const edges = [
			{
				top: leftEdge1,
				bottom: leftEdge2
			},
			{
				top: topEdge1,
				bottom: topEdge2
			},
			{
				top: rightEdge1,
				bottom: rightEdge2
			},
			{
				top: bottomEdge1,
				bottom: bottomEdge2
			}
		]

		let b = createVector();

		if (this.id == 0) {
			for(let edge of edges) {
				let hit = collideLineLine(edge.top.x, edge.top.y, edge.bottom.x, edge.bottom.y, this.position.x, this.position.y, this.position.x + this.velocity.copy().normalize().x * 50, this.position.y + this.velocity.copy().normalize().y * 50, true);
				const hitX = hit.x >= 0 ? hit.x-50 : hit.x+50; 
				const hitY = hit.y >= 0 ? hit.y-50 : hit.y+50; 

				let hitVector = createVector(hit.x, hit.y);
				if(hit.x !== false && hit.y !== false) {
					//show collision point
					circle(hitVector.x, hitVector.y, 10)
					

					//calc normal of edge
					let dx = edge.bottom.x - edge.top.x;
					let dy = edge.bottom.y - edge.top.y;

					//if dy =

					// line(hitVector.x, hitVector.y, dy, -dx)
					line(dy, -dx, -dy, dx)
					let a = createVector();
					if(dy == 0)
						a.add(-dy, dx).normalize().mult(25);
					else if (dx == 0)
						a.add(dy, -dx).normalize().mult(25);
					
					// normal line
					line(hitVector.x, hitVector.y, hitVector.x + a.x, hitVector.y + a.y)
					b = this.velocity.copy().add(this.position).reflect(a);
					console.log(a)
					line(hitVector.x, hitVector.y, hitVector.x + b.x, hitVector.y + b.y)

				}
			}
		}

		// console.log(edges)


		// line(20, 20, 20, height - 20);
		line(leftEdge1.x, leftEdge1.y, leftEdge2.x, leftEdge2.y);
		line(topEdge1.x, topEdge1.y, topEdge2.x, topEdge2.y);
		line(rightEdge1.x, rightEdge1.y, rightEdge2.x, rightEdge2.y);
		line(bottomEdge1.x, bottomEdge1.y, bottomEdge2.x, bottomEdge2.y);

		if(this.position.x > width + 20)
			this.position.x = -20;
		else if (this.position.x < -20)
			this.position.x = width + 20

		if(this.position.y > height + 20)
			this.position.y = -20
		else if (this.position.y < -20)
			this.position.y = height + 20

		return b;
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
		let edges = this.edges();

		this.acceleration.add(alignment.mult(1.1));
		this.acceleration.add(cohesion.mult(1.1));
		this.acceleration.add(seperation.mult(1.0));
		this.acceleration.add(wander.mult(0.75));
		this.acceleration.add(edges.mult(5.5));
	}

	update() {
		this.position.add(this.velocity);
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed)
	}

	wander() {
		let wanderCircle = createVector(this.position.x + this.velocity.copy().normalize().x * 24, this.position.y + this.velocity.copy().normalize().y * 24)
		// circle(wanderCircle.x, wanderCircle.y, wanderRadius);
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

		this.setMag

		if(this.id == 0) {
			line(this.position.x, this.position.y, (this.velocity.mag() * cos(this.velocity.heading()) * 25) + this.position.x, (this.velocity.mag() * sin(this.velocity.heading()) * 25) + this.position.y)
			stroke(0, 0, 255);
			line(this.position.x, this.position.y, (this.acceleration.mag() * cos(this.acceleration.heading()) * 250) + this.position.x, (this.acceleration.mag() * sin(this.acceleration.heading()) * 250) + this.position.y)
		}
	}
}

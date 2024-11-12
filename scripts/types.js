import { generateShortID } from "./utils.js";

export class Figure {
	constructor(type, id) {
		this.id = id; 
		this.type = type; 
	}
}

export class Point extends Figure {
	constructor(x, y, id) {
		super("point", id);
		this.x = x;
		this.y = y;
		this.id = id ? id : generateShortID();
	}
}


export class Line extends Figure {
	constructor(m, b, id) {
		super("line", id); 
		this.m = m; 
		this.b = b; 
		this.id = id ? id : generateShortID();
	}

}


export class Circle extends Figure {
	constructor(h, k, radius, id) {
		super("circle", id); 
		this.h = h; 
		this.k = k; 
		this.radius = radius; 
		this.id = id ? id : generateShortID();
	}

	area(){
		return Math.PI * this.radius * this.radius;
	}
	circumference(){
		return Math.PI * (2 * this.radius)
	}
}


export class Parabola extends Figure {
	constructor(a, b, c, id) {
		super("parabola", id); 
		this.a = a; 
		this.b = b; 
		this.c = c; 
		this.id = id ? id : generateShortID();
	}

	
}



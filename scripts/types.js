import { generateShortID, getSelectedColor } from "./utils.js";

export class Figure {
	constructor(type, id, color) {
		this.id = id;
		this.type = type;
		this.color = color;
	}
}

export class Point extends Figure {
	constructor(x, y, id, color) {
		super("point", id);
		this.x = x;
		this.y = y;
		this.id = id ? id : generateShortID();
		this.color = color ? color : getSelectedColor();
	}
}

export class Line extends Figure {
	constructor(m, b, id, color) {
		super("line", id, color);
		this.m = m;
		this.b = b;
		this.id = id ? id : generateShortID();
		this.color = color ? color : getSelectedColor();
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

	area() {
		return Math.PI * this.radius * this.radius;
	}
	circumference() {
		return Math.PI * (2 * this.radius);
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

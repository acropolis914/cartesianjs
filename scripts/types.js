import { generateShortID } from './utils.js';

export class Figure {
    constructor(type, id) {
        this.id = id; // Generate a unique ID for the figure
        this.type = type; // Type of the figure (e.g., 'line', 'circle', 'parabola')
    }
}

export class Point extends Figure { 
    constructor(x,y,id) {
        super("point", id);
        this.x = x;
        this.y =y;
        this.id = id ? id : generateShortID();
    }
}

// Line class extending Figure
export class Line extends Figure {
    constructor(m, b, id) {
        super("line", id); // Call the parent constructor with type 'line'
        this.m = m; // Slope
        this.b = b; // Y-intercept
        this.id = id ? id : generateShortID();
    }

    // Optionally implement calculatePoints and render later
}

// Circle class extending Figure
export class Circle extends Figure {
    constructor(h, k, radius, id) {
        super("circle", id); // Call the parent constructor with type 'circle'
        this.h = h; // X-coordinate of the center
        this.k = k; // Y-coordinate of the center
        this.radius = radius; // Radius of the circle
        this.id = id ? id : generateShortID();
    }

    // Optionally implement calculatePoints and render later
}

// Parabola class extending Figure
export class Parabola extends Figure {
    constructor(a, b, c, id) {
        super("parabola", id); // Call the parent constructor with type 'parabola'
        this.a = a; // Coefficient for x^2
        this.b = b; // Coefficient for x
        this.c = c; // Constant term
        this.id = id ? id : generateShortID();
    }

    // Optionally implement calculatePoints and render later
}

// You can add other figure classes (e.g., Rectangle, Ellipse) similarly


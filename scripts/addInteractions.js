import { svg } from "./main.js";
import { xScale, yScale } from "./render.js";
import useCartesianStore from "./state.js";
import { addFigure, removeAllFigures } from "./state.js";
import { populateList } from "./render.js";
import { drawCircleOutline, drawLine } from "./shapes.js";
import { Point, Circle, Line } from "./types.js";
import { getRandomBetween } from "./utils.js";

let state = useCartesianStore.getState();

export function addInteractions() {
    // Implement interaction logic here
    // For example, adding click event listeners to add new points
    // Add click listener to the add point button
    const addPointBtn = document.getElementById('add-point-btn');
    addPointBtn.addEventListener('click', () => {
        const input = prompt('Add point with given coordinate');
        
        
        if (input) {
            const coordinates = input.split(',');
            if (coordinates.length !== 2) {
                console.error('Invalid input format. Please enter two integers separated by a comma.');
                return;
            }
            
            const x = parseFloat(coordinates[0]);
            const y = parseFloat(coordinates[1]);
            
            if (isNaN(x) || isNaN(y)) {
                console.error('Invalid coordinates.');
                return;
            }
            
            const point = new Point(x, y);
            addFigure(point);
            populateList();
        } else {
            console.error('No input provided.');
        }
    });

    const addRandPointBtn = document.getElementById('add-random-point-btn');
    addRandPointBtn.addEventListener('click', () => {
        const x = Math.random() * (xScale.domain()[1] - xScale.domain()[0]) + xScale.domain()[0];
        const y = Math.random() * (yScale.domain()[1] - yScale.domain()[0]) + yScale.domain()[0];
        const point = new Point(x, y);
        addFigure(point);
        populateList();
    });

    const addCircleBtn = document.getElementById('add-circle-btn');
    addCircleBtn.addEventListener('click', () => {
        const input =prompt('Add circle with given parameters x,y,radius');
        if (input) {
            const coordinates = input.split(',');
            if (coordinates.length !== 3) {
                alert('Invalid input format. Please enter three integers separated by a comma.');
                return;
            }
            
            const x = parseFloat(coordinates[0]);
            const y = parseFloat(coordinates[1]);
            const r = parseFloat(coordinates[2]);
            
            if (isNaN(x) || isNaN(y) || isNaN(r)) {
                console.error('Invalid coordinates. All must be integers.');
                return;
            }
            
            const circle = new Circle(x, y, r);
            addFigure(circle);
            populateList();
        } else {
            console.error('No input provided.');
            alert('No input provided.');
        }
    });

    const addRandLineBtn = document.getElementById('add-random-line-btn');
    addRandLineBtn.addEventListener('click', () => {
        const m = getRandomBetween(-3, 3)
        const b = Math.random() * (yScale.domain()[1] - yScale.domain()[0]) + yScale.domain()[0];
        const line = new Line(m, b);
        addFigure(line);
        populateList();
    });

    const removeFiguresButton = document.getElementById('remove-points-btn');
    removeFiguresButton.addEventListener('click', () => {
        if (confirm("Reset the plane?")) {
            removeAllFigures();
            populateList();
            svg.selectAll(".figure").remove();
        }

    });


}
import { xScale, yScale, svg, populatePointsList } from "./main.js";
import { addPoint } from "./points.js";
import { removePoints } from "./storeData.js";

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
            
            const x = parseInt(coordinates[0]);
            const y = parseInt(coordinates[1]);
            
            if (isNaN(x) || isNaN(y)) {
                console.error('Invalid coordinates. Both must be integers.');
                return;
            }
            
            const point = {x, y};
            addPoint(svg, xScale, yScale, point);
            populatePointsList();
        } else {
            console.error('No input provided.');
        }
    });

    const addRandPointBtn = document.getElementById('add-random-point-btn');
    addRandPointBtn.addEventListener('click', () => {
        const x = Math.random() * (xScale.domain()[1] - xScale.domain()[0]) + xScale.domain()[0];
        const y = Math.random() * (yScale.domain()[1] - yScale.domain()[0]) + yScale.domain()[0];
        const point = { x, y };
        addPoint(svg, xScale, yScale, point);
        populatePointsList();
    });

    const removePointsBtn = document.getElementById('remove-points-btn');
    removePointsBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to remove all points? This action cannot be undone.")) {
            removePoints();
            populatePointsList();
        }

    });

}

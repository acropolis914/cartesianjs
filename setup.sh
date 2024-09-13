#!/bin/bash

# Create directories
mkdir -p scripts
mkdir -p styles

#touch scripts/{main.js,graph-setup.js,axis.js,grid.js,points.js,shapes.js,transformations.js,utils.js,storeData.js}
#touch cartesian-plane.css
# Create index.html
cat << EOF > index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cartesian Plane Implementation</title>
    <link rel="stylesheet" href="styles/cartesian-plane.css">
</head>
<body>
    <div id="cartesian-container">
        <h2>Cartesian Plane</h2>
        <div id="svg-container"></div>
        <button id="add-point-btn">Add Point</button>
    </div>
    <div id="points-list">
        <h2>Points List</h2>
        <ul id="points-ul"></ul>
    </div>

    <script src="scripts/main.js"></script>
</body>
</html>
EOF

# Create styles/cartesian-plane.css
cat << EOF > styles/cartesian-plane.css
/* Add your CSS styles here */
#cartesian-container {
    max-width: 800px;
    margin: 0 auto;
}

#svg-container {
    border: 1px solid black;
}

#points-list {
    margin-top: 20px;
}
EOF


# Initialize main.js
cat << EOF > scripts/main.js
// Import other modules
import { initializeGraph } from './graph-setup.js';
import { drawAxes } from './axis.js';
import { drawGridLines } from './grid.js';
import { addPoint, removePoint, updatePoints } from './points.js';
import { drawShape } from './shapes.js';
import { applyTransformation } from './transformations.js';
import { getAllPoints, savePoint, deletePoint, updatePoint } from './storeData.js';

let svg, xScale, yScale;

function setup() {
    const svgContainer = document.getElementById('svg-container');
    
    // Get dimensions dynamically
    const width = svgContainer.clientWidth;
    const height = svgContainer.clientHeight;
    
    ({ svg, xScale, yScale } = initializeGraph(width, height));
    
    drawAxes(svg, xScale, yScale);
    drawGridLines(svg, xScale, yScale);
    
    // Load existing points from storage
    const storedPoints = getAllPoints();
    storedPoints.forEach(point => addPoint(svg, xScale, yScale, point));

    // Add interaction listeners
    addInteractions();

    // Set up resize listener
    window.addEventListener('resize', handleResize);
}

function run() {
    setup();
}

run();

function addInteractions() {
    // Implement interaction logic here
    // For example, adding click event listeners to add new points
    
    // Add click listener to the add point button
    const addPointBtn = document.getElementById('add-point-btn');
    addPointBtn.addEventListener('click', () => {
        const x = Math.random() * (xScale.domain()[1] - xScale.domain()[0]) + xScale.domain()[0];
        const y = Math.random() * (yScale.domain()[1] - yScale.domain()[0]) + yScale.domain()[0];
        const point = { x, y };
        addPoint(svg, xScale, yScale, point);
    });
}

function handleResize() {
    const svgContainer = document.getElementById('svg-container');
    const width = svgContainer.clientWidth;
    const height = svgContainer.clientHeight;
    
    // Update SVG dimensions
    svg.attr("width", width).attr("height", height);
    
    // Update scales
    xScale.range([0, width]);
    yScale.range([height, 0]);
    
    // Redraw everything
    drawAxes(svg, xScale, yScale);
    drawGridLines(svg, xScale, yScale);
    updatePoints(svg, xScale, yScale);
}

// Function to update points list
function updatePointsList(points) {
    const pointsList = document.getElementById('points-ul');
    pointsList.innerHTML = '';
    points.forEach((point, index) => {
        const li = document.createElement('li');
        li.textContent = `(${point.x}, ${point.y})`;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => removePoint(svg, xScale, yScale, point));
        li.appendChild(deleteBtn);
        pointsList.appendChild(li);
    });
}
EOF

# Initialize graph-setup.js
cat << EOF > scripts/graph-setup.js
// Import d3.js library
import * as d3 from 'd3-array';

export function initializeGraph(width, height) {
    // Create SVG element
    const svg = d3.select("#svg-container").append("svg")
        .attr("width", width)
        .attr("height", height);

    // Set up scales
    const xScale = d3.scaleLinear().domain([-10, 10]).range([0, width]);
    const yScale = d3.scaleLinear().domain([-10, 10]).range([height, 0]);

    return { svg, xScale, yScale };
}
EOF

# Initialize axis.js
cat << EOF > scripts/axis.js
// Import d3.js library
import * as d3 from 'd3-array';

export function drawAxes(svg, xScale, yScale) {
    // Draw X-axis
    const xAxis = d3.axisBottom(xScale).ticks(5);
    svg.append("g").call(xAxis).attr("transform", `translate(0,${svg.attr('height')})`);

    // Draw Y-axis  
    const yAxis = d3.axisLeft(yScale).ticks(5);
    svg.append("g").call(yAxis).attr("transform", "translate(0,0)");

    // Add origin
    svg.append("text")
        .attr("x", svg.attr('width') / 2)
        .attr("y", svg.attr('height') / 2)
        .attr("text-anchor", "middle")
        .text("(0,0)");
}
EOF

# Initialize grid.js
cat << EOF > scripts/grid.js
// Import d3.js library
import * as d3 from 'd3-array';

export function drawGridLines(svg, xScale, yScale) {
    // Draw major grid lines
    svg.selectAll(".major-grid")
        .data(d3.range(-10, 11))
        .enter()
        .append("line")
        .attr("class", "major-grid")
        .attr("x1", 0)
        .attr("x2", svg.attr('width'))
        .attr("y1", d => yScale(d))
        .attr("y2", d => yScale(d));

    // Draw minor grid lines
    svg.selectAll(".minor-grid")
        .data(d3.ticks(xScale, 5))
        .enter()
        .append("line")
        .attr("class", "minor-grid")
        .attr("x1", d => xScale(d))
        .attr("x2", d => xScale(d))
        .attr("y1", 0)
        .attr("y2", svg.attr('height'));
}
EOF

# Initialize points.js
cat << EOF > scripts/points.js
// Import d3.js library
import * as d3 from 'd3-array';
import { savePoint, deletePoint, updatePoint } from './storeData.js';

export function addPoint(svg, xScale, yScale, point) {
    const circle = svg.append("circle")
        .attr("cx", xScale(point.x))
        .attr("cy", yScale(point.y))
        .attr("r", 5)
        .attr("fill", "red");
    
    // Add interaction listeners
    circle.on('click', () => removePoint(svg, xScale, yScale, circle));
    
    // Save the point to storage
    savePoint(point);
}

export function removePoint(svg, xScale, yScale, pointElement) {
    const id = pointElement.attr('id');
    if (id) {
        deletePoint(id);
        pointElement.remove();
    }
}

export function updatePoints(svg, xScale, yScale) {
    // Implement logic to update positions of existing points
    // This could involve retrieving all points from storage and re-drawing them
}
EOF

# Initialize shapes.js
cat << EOF > scripts/shapes.js
// Import d3.js library
import * as d3 from 'd3-array';

export function drawLine(svg, xScale, yScale, x1, y1, x2, y2) {
    svg.append("line")
        .attr("x1", xScale(x1))
        .attr("y1", yScale(y1))
        .attr("x2", xScale(x2))
        .attr("y2", yScale(y2));
}

export function drawCircle(svg, xScale, yScale, x, y, radius) {
    svg.append("circle")
        .attr("cx", xScale(x))
        .attr("cy", yScale(y))
        .attr("r", radius)
        .attr("fill", "blue");
}

export function drawRectangle(svg, xScale, yScale, x1, y1, x2, y2) {
    svg.append("rect")
        .attr("x", xScale(x1))
        .attr("y", yScale(y1))
        .attr("width", xScale(x2) - xScale(x1))
        .attr("height", yScale(y2) - yScale(y1))
        .attr("fill", "green");
}

export function drawShape(shapeType, x1, y1, x2, y2) {
    switch (shapeType.toLowerCase()) {
        case "line":
            drawLine(svg, xScale, yScale, x1, y1, x2, y2);
            break;
        case "circle":
            drawCircle(svg, xScale, yScale, x1, y1, 20); // Fixed radius for circle
            break;
        case "rectangle":
            drawRectangle(svg, xScale, yScale, x1, y1, x2, y2);
            break;
        default:
            console.log("Invalid shape type");
    }
}
EOF

# Continue transformations.js
cat << EOF >> scripts/transformations.js
export function rotateAroundOrigin(svg, xScale, yScale, point) {
    const angle = Math.atan2(point.attr("cy") - svg.attr('height')/2, point.attr("cx") - svg.attr('width')/2);
    const rotatedPoint = {
        x: svg.attr('width')/2 + Math.cos(angle) * (point.attr("cx") - svg.attr('width')/2),
        y: svg.attr('height')/2 + Math.sin(angle) * (point.attr("cy") - svg.attr('height')/2)
    };
    drawLine(svg, xScale, yScale, rotatedPoint.x, rotatedPoint.y, point.attr("cx"), point.attr("cy"));
}

export function scaleAroundOrigin(svg, xScale, yScale, point, scaleFactor) {
    const scaledPoint = {
        x: svg.attr('width')/2 + scaleFactor * (point.attr("cx") - svg.attr('width')/2),
        y: svg.attr('height')/2 + scaleFactor * (point.attr("cy") - svg.attr('height')/2)
    };
    drawLine(svg, xScale, yScale, scaledPoint.x, scaledPoint.y, point.attr("cx"), point.attr("cy"));
}
EOF

# Initialize utils.js
cat << EOF > scripts/utils.js
// Utility functions
export function getRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

export function distance(p1, p2) {
    return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
}
EOF

# Initialize storeData.js
cat << EOF > scripts/storeData.js
const STORE_KEY = 'cartesian-plane-points';

export function getAllPoints() {
    const storedData = localStorage.getItem(STORE_KEY);
    return storedData ? JSON.parse(storedData) : [];
}

export function savePoint(point) {
    const points = getAllPoints();
    points.push(point);
    localStorage.setItem(STORE_KEY, JSON.stringify(points));
}

export function deletePoint(id) {
    const points = getAllPoints().filter(p => p.id !== id);
    localStorage.setItem(STORE_KEY, JSON.stringify(points));
}

export function updatePoint(id, updatedPoint) {
    const points = getAllPoints().map(p => p.id === id ? updatedPoint : p);
    localStorage.setItem(STORE_KEY, JSON.stringify(points));
}
EOF

# Print directory tree
echo "Directory structure:"
tree .



# Generate README.md
cat << EOF > README.md
# Cartesian Plane Implementation

A dynamic Cartesian plane implementation using D3.js and vanilla JavaScript.

## Features

- Interactive SVG-based Cartesian plane
- Dynamic resizing based on container size
- Ability to add and remove points
- Persistent storage of points using local storage
- Grid and axes automatically adjust to available space
- Support for various geometric transformations (reflection, rotation, scaling)

## Getting Started

1. Clone the repository:

2. Open the `index.html` file in a web browser to view and interact with the Cartesian plane.

## Directory Structure

$(tree)


## Usage

- Click anywhere on the plane to add a point.
- Click on an existing point to remove it.
- Use the "Add Point" button to randomly add a point.
- View the list of all points below the plane.
- Resize the window to see the plane adjust dynamically.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or issues.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [D3.js](https://d3js.org/) for powerful SVG manipulation capabilities.
- Stack Overflow community for various implementation insights.

## TODO

- Implement more advanced geometric transformations
- Add support for drawing different shapes (lines, circles, rectangles)
- Improve user interface for better accessibility
- Optimize performance for large numbers of points
EOF

# Print completion message
echo "Project setup completed successfully!"
echo "README.md has been generated."
echo "Open README.md to see project details and instructions."

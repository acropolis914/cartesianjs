// Import other modules
import { initializeGraph } from './graph-setup.js';
import { drawAxes } from './axis.js';
import { drawGridLines } from './grid.js';
import { removePoint, plotPoint } from './points.js';
// import { drawShape } from './shapes.js';
// import { rotateAroundOrigin,scaleAroundOrigin } from './transformations.js';
import { getAllPoints, savePoint, deletePoint, updatePoint } from './storeData.js';
import { addInteractions } from './addInteractions.js';
import { addGridInteractions } from './gridInteractions.js';
import { handleResize } from './handleResize.js';

export let svg, xScale, yScale, storedPoints;

function gridSetup() {
    const svgContainer = document.getElementById('svg-container');

    // Get dimensions dynamically
    const width = svgContainer.clientWidth;
    const height = svgContainer.clientHeight;
    ({ svg, xScale, yScale } = initializeGraph(width, height));

    drawAxes(svg, xScale, yScale);
    drawGridLines(svg, xScale, yScale);
    addGridInteractions(svg,width,height);
    // Load existing points from storage
    
    storedPoints = getAllPoints();
    storedPoints.forEach(point => plotPoint(svg, xScale, yScale, point));
}

export function populatePointsList() {
    const pointsUl = document.getElementById('points-ul');
    pointsUl.innerHTML = ''; // Clear existing content
    
    storedPoints = getAllPoints();
    storedPoints.forEach(point => {
        const li = document.createElement('li');
        li.textContent = `${Math.round(point.x)}, ${Math.round(point.y)}`;
        pointsUl.appendChild(li);
    });
}

export function run() {
    gridSetup();
    addInteractions();
    window.addEventListener('resize', handleResize);
    populatePointsList();
}

run();




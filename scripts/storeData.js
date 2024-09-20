import {svg, xScale, yScale} from './main.js';
import { updatePoints,plotPoint,removePoint } from './points.js';
const STORE_KEY = 'cartesian-plane-points';
const STORE_KEY_FIGURES = 'cartesian-plane-figures';



export function getAllPoints() {
    const storedData = localStorage.getItem(STORE_KEY);
    return storedData ? JSON.parse(storedData) : [];
}

export function savePoint(point) {
    const points = getAllPoints();
    const newID = generateShortId();
    point.id = newID;
    const existingPointIndex = points.findIndex(p => p.x === point.x && p.y === point.y);

    if (existingPointIndex !== -1) {
	points[existingPointIndex] = point;
    } else {
	points.push(point);
    }

    localStorage.setItem(STORE_KEY, JSON.stringify(points));
    plotPoint(svg, xScale, yScale, point);
}

export function deletePoint(point) {
    const id = point.id;
    const points = getAllPoints().filter(p => p.id !== id);
    localStorage.setItem(STORE_KEY, JSON.stringify(points));
    removePoint(svg, xScale, yScale, point);
}

export function removeAllPoints(){
    let points=[];
    localStorage.setItem(STORE_KEY, JSON.stringify(points));
    updatePoints(svg, xScale, yScale);
}

export function updatePoint(id, updatedPoint) {
    const points = getAllPoints().map(p => p.id === id ? updatedPoint : p);
    localStorage.setItem(STORE_KEY, JSON.stringify(points));
}

function generateShortId() {
    const randomPart = Math.random().toString(36).substring(2, 4); // 2 random characters
    const timePart = Date.now().toString(36).slice(-2);            // Last 2 chars of timestamp
    return randomPart + timePart;
}

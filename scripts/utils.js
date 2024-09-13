// Utility functions
export function getRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

export function distance(p1, p2) {
    return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
}

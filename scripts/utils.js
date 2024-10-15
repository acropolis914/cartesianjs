// Utility functions
export function getRandomColor() {
	return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

export function distance(p1, p2) {
	return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

export function generateShortID() {
	const randomPart = Math.random().toString(36).substring(2, 4); // 2 random characters
	const timePart = Date.now().toString(36).slice(-2); // Last 2 chars of timestamp
	return randomPart + timePart;
}

export function executeInOrder(...functions) {
	functions.reduce((promise, fn) => {
		return promise.then(() => fn());
	}, Promise.resolve());
}

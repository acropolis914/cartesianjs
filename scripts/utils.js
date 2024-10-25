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

export function getRandomBetween(min, max) {
    return Math.random() * (max - min) + min;
}


import 'core-js/stable';
import 'regenerator-runtime/runtime';

/**
 * iOS 9 compatible prompt that returns a Promise
 * @param {string} message - The message to display in the prompt
 * @return {Promise<string|null>} The user's input or null if cancelled
 */
export const promptAsync = (message) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const result = prompt(message);
            resolve(result);
        }, 100);
    });
};

/**
 * iOS 9 compatible alert that returns a Promise
 * @param {string} message - The message to display in the alert
 * @return {Promise<void>}
 */
export const alertAsync = (message) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            alert(message);
            resolve();
        }, 100);
    });
};
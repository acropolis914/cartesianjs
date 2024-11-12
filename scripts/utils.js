// Utility functions

export async function loadTemplate() {
	// const response = await fetch("/scripts/cartesian-plane.html");
	const text = html;
	const parser = new DOMParser();
	const doc = parser.parseFromString(text, "text/html");
	return doc.getElementById("cartesian-plane-template").innerHTML;
}

export function getRandomColor() {
	return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

export function distance(p1, p2) {
	return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

export function generateShortID() {
	const randomPart = Math.random().toString(36).substring(2, 4); // 2 random characters
	const timePart = Date.now().toString(36).slice(-2); // Last 2 chars of timestamp
	return randomPart + timePart;
}

export function getRandomBetween(min, max) {
	return Math.random() * (max - min) + min;
}

export function getScaledRadius(baseRadius, transformation) {
	return baseRadius / (transformation?.k || 1);
}

export function getStrokeWidth(baseWidth, transformation) {
	return baseWidth / (transformation?.k || 1);
}

import "core-js/stable";
import "regenerator-runtime/runtime";

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


let html = `<template id="cartesian-plane-template">
	<style>
		/* :host {
            display: block;
            width: 100%;
            height: 100%;
        } */
		body {
			scrollbar-width: thin; /* "auto" or "thin" */
			scrollbar-color: blue orange; /* scroll thumb and track */
		}
		body::-webkit-scrollbar {
			width: 12px; /* width of the entire scrollbar */
		}

		body::-webkit-scrollbar-track {
			background: orange; /* color of the tracking area */
		}

		body::-webkit-scrollbar-thumb {
			background-color: blue; /* color of the scroll thumb */
			border-radius: 20px; /* roundness of the scroll thumb */
			border: 3px solid orange; /* creates padding around scroll thumb */
		}
		.cartesian-container {
			width: 100%;
			height: 100%;
			display: flex;
			/* overflow: hidden;*/
			color: white;
			position: relative;
		}
		#figures-container {
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			position: absolute;
			width: 200px;
			padding: 1rem;
			background-color: rgba(55, 55, 55, 0);
			display: flex;
			flex-direction: column;
			z-index: 1;
			backdrop-filter: blur(10px);
			background-repeat: repeat;
			box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
		}
		#svg-container {
			top: 0;
			left: 0;
			width: inherit;
			height: 100%;
			position: absolute;
			flex: 1;
			background: #1a1a1a;
			object-fit: contain;
		}
		.figure {
			stroke: white;
		}
		.figures-list {
			list-style: none;
			padding: 0;
			overflow-y: auto;
			height: 100%;
			display: flex;
			flex-direction: column;
		}
		.figures-list li {
			color: rgb(225, 225, 225);
			margin: 0.5rem 0;
			display: flex;
			align-items: center;
			background-color: #4f5156;
			width: fit-content;
			border-radius: 1ch;
			padding: 0 1ch;
			font-size: larger;
		}
		.figures-list li:hover {
			background-color: rgb(27, 27, 27);
		}
		.button-container {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			margin: 1rem;
			flex-wrap: wrap;
		}
		.button-container > button {
			margin: 0.25rem;
			padding: 0.1rem;
			border-radius: 0.5ch;
			width: 4rem;
			overflow: hidden;
			height: 4rem;
			font-size: 1rem;
			background-color: rgb(51, 54, 55);
			color: white;
			border: 0;
		}
		.button-container > button:hover {
			background-color: rgb(200, 250, 255);
			scale: 1.1;
			cursor: pointer;
		}

		.button-container > button:active {
			background-color: rgb(23, 58, 62);
		}
		li > button {
			border-radius: 1ch;
			height: 2ch;
			background-color: rgb(53, 43, 43);
			margin: 0.25rem 0.25rem;
			border: none;
			cursor: pointer;
		}
		li > button:hover {
			background-color: rgb(200, 250, 255);
			scale: 1.1;
			cursor: pointer;
		}
		g {
			color: rgb(204, 204, 204);
		}
		.error-message {
			color: red;
			font-weight: bold;
		}
	</style>
	<div class="cartesian-container">
		<div id="figures-container">
			<div class="button-container">
				<!-- <button type="button" class="add-point-btn">Add Point</button>
				<button type="button" class="add-random-point-btn">
					Random Point
				</button>
				<button type="button" class="add-circle-btn">Add Circle</button>
				<button type="button" class="add-random-line-btn">
					Random Line
				</button>
				<button type="button" class="clear-all-btn">Clear All</button> -->
			</div>
			<h2>Figures</h2>
			<ul class="figures-list"></ul>
		</div>
		<div id="svg-container"></div>
	</div>
</template>
`;
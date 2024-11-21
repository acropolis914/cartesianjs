export const cartesianHTML =
	/*html*/
	`<template id="cartesian-plane-template">
	<style>
		body {
			scrollbar-width: thin; /* "auto" or "thin" */
		}
		body::-webkit-scrollbar {
			width: 12px; /* width of the entire scrollbar */
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
			font-size: 62.5%;
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
			transition: transform 0.3s ease;
		}
		#figures-container.collapsed {
			transform: translateX(-100%);
		}
		#sidebar-toggle-button {
			position: absolute;
			top: 1rem;
			left: calc(20rem + 3rem);
			background-color: rgb(43, 92, 108);
			color: white;
			border: 0;
			border-radius: 1ch;
			padding-top: 100%;
			padding: 0.5rem;
			margin: auto;
			cursor: pointer;
			z-index: 2;
			transition: left 0.3s ease;
			aspect-ratio: 1/1;
			align-items: center;
		}
        #sidebar-toggle-button.collapsed {
			left: 1rem;
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
			background-color: #6b6b6b;
			width: fit-content;
			border-radius: 1ch;
			padding: 0 1ch;
			font-size: 1.2rem;
		}
		.figures-list li:hover {
			background-color: rgb(81, 81, 81);
		}
		.figures-list li.active{
			border: 1px dotted white;
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
			color: #d3d3d3;
			border: 0;
		}
		.button-container > button:hover {
			background-color: rgb(36, 38, 39);
			border: 1px solid #424242ff;
			color: #ffffff;
			scale: 1.1;
			cursor: pointer;
		}

		.button-container > button:active {
			background-color: rgb(23, 58, 62);
		}
		li > button {
			border-radius: 1ch;
			height: 2ch;
			background-color: rgb(91, 91, 91);
			margin: 0.25rem 0.25rem;
			border: none;
			cursor: pointer;
		}
		li > button:hover {
			color: #784747;
			background-color: rgb(51, 51, 51);
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

		i {
			color: white;
		}
	</style>
	<link rel="stylesheet" href="/fontawesome/css/all.min.css">
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
		<button id="sidebar-toggle-button"><i class="fa-solid fa-angles-left"></i></button>
		<div id="svg-container"></div>
	</div>
</template>
`;

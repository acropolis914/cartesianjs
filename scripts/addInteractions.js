import * as d3 from "d3";
import tippy from "tippy.js";
import { updateList, updateZoomable } from "./render.js";
import { addFigure, removeAllFigures } from "./dataManager.js";
import { populateList } from "./render.js";
import { Point, Circle, Line } from "./types.js";
import { getRandomBetween } from "./utils.js";
import { promptAsync } from "./utils.js";

export async function addInteractions(root, store) {
	const svg = store.getState().svg;
	const xScale = store.getState().xScale;
	const yScale = store.getState().yScale;

	const addPointBtn = createButton(root, "Add Point", "add-point-btn", "fa-solid fa-plus");
	const addRandPointBtn = createButton(
		root,
		"Add Random Point",
		"add-random-point-btn",
		"fa-solid fa-arrows-turn-to-dots",
	);
	const addRandLineBtn = createButton(
		root,
		"Add Random Line",
		"add-random-line-btn",
		"fa-solid fa-arrow-trend-up",

	);

	const addCircleBtn = createButton(root, "Add Circle", "add-circle-btn", "fa-regular fa-circle");

	const removeFiguresButton = createButton(
		root,
		"Remove All Figures",
		"remove-figures-btn",
		"fa-solid fa-toilet-paper",
	);

	const zoomText = store.getState().zoom ? "Disable Zoom" : "Enable Zoom";

	const toggleZoomButton = createButton(root, zoomText, "toggle-zoom-btn", "fa-solid fa-magnifying-glass-plus");

	const addByClickButton = createButton(
		root,
		"Add by Click",
		"add-point-by-click-btn",
		"fa-solid fa-mouse"
	);

	const toggleSideBar = true;

	let addPointByClick = false;

	if (addByClickButton) {
		addByClickButton.addEventListener("click", () => {
			if (!addPointByClick) {
				addPointByClick = true;
				svg.on("click", (event) => {
					let [x, y] = d3.pointer(event);
					const xScale = store.getState().xScale;
					const yScale = store.getState().yScale;
					const transformation = store.getState().transformation;

					// Apply the inverse of the transformation to the coordinates
					x = (x - transformation.x) / transformation.k;
					y = (y - transformation.y) / transformation.k;

					const inverseXScale = xScale.invert(x);
					const inverseYScale = yScale.invert(y);

					// Now you can use the adjusted coordinates
					// console.log(`Clicked at (${inverseXScale}, ${inverseYScale})`);
					const point = new Point(inverseXScale, inverseYScale);
					addFigure(store, point);
					populateList(svg, root, store);
					checkPointfromExpectation(store, point);

					// Turn off the click event listener
					addPointByClick = false;
					svg.on("click", null);
				});
			}
		});
	}

	if (toggleZoomButton) {
		toggleZoomButton.addEventListener("click", () => {
			const zoomStatus = store.getState().zoom;
			store.setState({ zoom: !zoomStatus });
			updateZoomable(root, store, !zoomStatus);
			toggleZoomButton.textContent = zoomStatus
				? "Enable Zoom"
				: "Disable Zoom";
		});
	}

	if (addPointBtn) {
		addPointBtn.addEventListener("click", async () => {
			const input = await promptAsync("Add point with given coordinates (x,y)");

			if (!input) {
				console.log("No input provided.");
				return;
			}

			const coordinates = input.split(",");
			const x = Number.parseFloat(coordinates[0]);
			const y = Number.parseFloat(coordinates[1]);

			if (coordinates.length !== 2) {
				alert(
					"Invalid input format. Please enter two integers separated by a comma.",
				);
				return;
			}

			if (Number.isNaN(x) && Number.isNaN(x)) {
				console.error("Invalid coordinates.");
				console.error("x:", x, "y:", y);
				return;
			}

			const point = new Point(x, y);
			addFigure(store, point);
			//populateList();
		});
	}

	if (addRandPointBtn) {
		addRandPointBtn.addEventListener("click", () => {
			const x =
				Math.random() * (xScale.domain()[1] - xScale.domain()[0]) +
				xScale.domain()[0];
			const y =
				Math.random() * (yScale.domain()[1] - yScale.domain()[0]) +
				yScale.domain()[0];
			const point = new Point(x, y);
			addFigure(store, point);
			updateList(root, store);
		});
	}

	if (addCircleBtn) {
		addCircleBtn.addEventListener("click", async () => {
			const input = await promptAsync(
				"Add circle with given parameters x,y,radius",
			);
			if (input) {
				const coordinates = input.split(",");
				if (coordinates.length !== 3) {
					alert(
						"Invalid input format. Please enter three integers separated by a comma.",
					);
					return;
				}

				const x = Number.parseFloat(coordinates[0]);
				const y = Number.parseFloat(coordinates[1]);
				const r = Number.parseFloat(coordinates[2]);

				if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(r)) {
					alert("Invalid coordinates. All must be numbers.");
					return;
				}

				const circle = new Circle(x, y, r);
				addFigure(store, circle);
				populateList(svg, root, store);
			} else {
				alert("No input provided.");
			}
		});
	}

	if (addRandLineBtn) {
		addRandLineBtn.addEventListener("click", () => {
			const m = getRandomBetween(-3, 3);
			const b =
				Math.random() * (yScale.domain()[1] - yScale.domain()[0]) +
				yScale.domain()[0];
			const line = new Line(m, b);
			addFigure(store, line);
			populateList(svg, root, store);
		});
	}

	if (removeFiguresButton) {
		removeFiguresButton.addEventListener("click", () => {
			if (confirm("Reset the plane?")) {
				removeAllFigures(store);
				populateList(svg, root, store);
				svg.selectAll(".figure").remove();
			}
		});
	}

	if (toggleSideBar) {
		const figuresContainer = root.querySelector("#figures-container");
		const toggleButton = root.querySelector("#sidebar-toggle-button");

		toggleButton.addEventListener("click", () => {
			figuresContainer.classList.toggle("collapsed");
			toggleButton.classList.toggle("collapsed");
			if (figuresContainer.classList.contains("collapsed")) {
				toggleButton.innerHTML = `<i class="fa-solid fa-bars"></i>`;
				return;
			}
			toggleButton.innerHTML = "<i class='fa-solid fa-angles-left'></i>";

		});
	}

	const colorSelector = root.querySelector('#colorSelector');
	let selectedColor = root.querySelector('.color-option.selected');


	colorSelector.addEventListener('click', (event) => {
		if (event.target.classList.contains('color-option')) {
			if (selectedColor) {
				selectedColor.classList.remove('selected');
			}
			event.target.classList.add('selected');
			selectedColor = event.target;
		}
	});

	const closeOverlayButton = root.querySelector("#close-overlay");
	const overlays = root.querySelector("#overlays");

	closeOverlayButton.addEventListener("click", () => {
		overlays.style.display = "none";
	});
}

function createButton(root, text, className, icon) {
	const button = root
		.querySelector(".button-container")
		.appendChild(document.createElement("button"));
	const innterHTML = /*html*/
				`<i class="${icon}"></i>
				<span class="tooltip">${text}</span>`;

				// <span class="button-text">${text}</span>

	button.innerHTML = innterHTML;
	button.className = className;
	// button.title = text;

	// tippy(`#${className}`, {
    //     content: `${text}`,
    // });

	return button;
}

function checkPointfromExpectation(store, point) {
	const expects = JSON.parse(store.getState().expects);
	if (!expects) {
		return;
	}
	const x = point.x;
	const y = point.y;
	for (const expect of expects) {
		console.log(expect);
		const xExpect = expect[1];
		const yExpect = expect[2];
		if (Math.abs(x - xExpect) < 0.1 && Math.abs(y - yExpect) < 0.1) {
			const overlays = store.getState().root.querySelector("#overlays");
			overlays.style.display = "flex";
			console.log("Point is as expected");
		}
	}

}


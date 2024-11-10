import { updateList} from "./render.js";


import { addFigure, removeAllFigures } from "./dataManager.js";
import { populateList } from "./render.js";
import { Point, Circle, Line } from "./types.js";
import { getRandomBetween } from "./utils.js";
import { promptAsync } from "./utils.js";

export async function addInteractions(root, store) {
	const svg = store.getState().svg;
	const xScale = store.getState().xScale;
	const yScale = store.getState().yScale;
	const addPointBtn = root.querySelector(".add-point-btn");
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

			if ((!x) || (!y)) {
				console.error("Invalid coordinates.");
				return;
			}

			const point = new Point(x, y);
			addFigure(store, point);
			//populateList();
		});
	}

	const addRandPointBtn = root.querySelector(".add-random-point-btn");
	if (addPointBtn) {
		addRandPointBtn.addEventListener("click", () => {
			const x =
				Math.random() * (xScale.domain()[1] - xScale.domain()[0]) +
				xScale.domain()[0];
			const y =
				Math.random() * (yScale.domain()[1] - yScale.domain()[0]) +
				yScale.domain()[0];
			const point = new Point(x, y);
			addFigure(store,point);
			updateList(root, store);
		});

		const addCircleBtn = root.querySelector(".add-circle-btn");
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
	}
	const addRandLineBtn = root.querySelector(".add-random-line-btn");
	if (addRandLineBtn) {
		addRandLineBtn.addEventListener("click", () => {
			const m = getRandomBetween(-3, 3);
			const b =
				Math.random() * (yScale.domain()[1] - yScale.domain()[0]) +
				yScale.domain()[0];
			const line = new Line(m, b);
			addFigure(store,line);
			populateList(svg,root,store);
		});

		const removeFiguresButton = root.querySelector(".clear-all-btn");
		if (removeFiguresButton) {
			removeFiguresButton.addEventListener("click", () => {
				if (confirm("Reset the plane?")) {
					removeAllFigures(svg, store);
					populateList(svg, root, store);
					svg.selectAll(".figure").remove();
				}
			});
		}
	}
}

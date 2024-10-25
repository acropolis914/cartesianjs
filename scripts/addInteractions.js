import { svg } from "./main.js";
import { xScale, yScale } from "./render.js";
import useCartesianStore from "./state.js";
import { addFigure, removeAllFigures } from "./state.js";
import { populateList } from "./render.js";
import { Point, Circle, Line } from "./types.js";
import { getRandomBetween } from "./utils.js";
import { promptAsync } from "./utils.js";

const state = useCartesianStore.getState();

export async function addInteractions() {
	const addPointBtn = document.getElementById("add-point-btn");
	addPointBtn.addEventListener("click", async () => {
		const input = await promptAsync("Add point with given coordinate");

		if (input) {
			const coordinates = input.split(",");
			if (coordinates.length !== 2) {
				console.error(
					"Invalid input format. Please enter two integers separated by a comma.",
				);
				return;
			}

			const x = Number.parseFloat(coordinates[0]);
			const y = Number.parseFloat(coordinates[1]);

			if (Number.isNaN(x) || Number.isNaN(y)) {
				console.error("Invalid coordinates.");
				return;
			}

			const point = new Point(x, y);
			addFigure(point);
			populateList();
		} else {
			console.error("No input provided.");
		}
	});

	const addRandPointBtn = document.getElementById("add-random-point-btn");
	addRandPointBtn.addEventListener("click", () => {
		const x =
			Math.random() * (xScale.domain()[1] - xScale.domain()[0]) +
			xScale.domain()[0];
		const y =
			Math.random() * (yScale.domain()[1] - yScale.domain()[0]) +
			yScale.domain()[0];
		const point = new Point(x, y);
		addFigure(point);
		populateList();
	});

	const addCircleBtn = document.getElementById("add-circle-btn");
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
				console.error("Invalid coordinates. All must be integers.");
				return;
			}

			const circle = new Circle(x, y, r);
			addFigure(circle);
			populateList();
		} else {
			console.error("No input provided.");
			alert("No input provided.");
		}
	});

	const addRandLineBtn = document.getElementById("add-random-line-btn");
	addRandLineBtn.addEventListener("click", () => {
		const m = getRandomBetween(-3, 3);
		const b =
			Math.random() * (yScale.domain()[1] - yScale.domain()[0]) +
			yScale.domain()[0];
		const line = new Line(m, b);
		addFigure(line);
		populateList();
	});

	const removeFiguresButton = document.getElementById("remove-points-btn");
	removeFiguresButton.addEventListener("click", () => {
		if (confirm("Reset the plane?")) {
			removeAllFigures();
			populateList();
			svg.selectAll(".figure").remove();
		}
	});
}

import { createStore } from "zustand/vanilla";
import * as d3 from "d3";

export function createInstanceStore(id) {
	const storageKey = `cartesian-store-${id}`;
	return createStore(() => ({
		svg: null,
		xScale: null,
		yScale: null,
		figures: [],
		transformation: { k: 1, x: 0, y: 0 },
	}));
}

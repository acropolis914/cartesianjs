import { createStore } from "zustand/vanilla";

export function createInstanceStore(id) {
	const storageKey = `cartesian-store-${id}`;
	return createStore(() => ({
		storageKey: storageKey,
		root:null,
		svg: null,
		xScale: null,
		yScale: null,
		figures: [],
		transformation: { k: 1, x: 0, y: 0 },
		zoom:true
	}));
}



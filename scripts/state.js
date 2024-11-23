import { createStore } from "zustand/vanilla";

export function createInstanceStore(id) {
	const storageKey = `cartesian-store-${id}`;
	return createStore((set) => ({
		id: id,
		storageKey: storageKey,
		root:null,
		svg: null,
		xScale: null,
		yScale: null,
		figures: [],
		transformation: { k: 1, x: 0, y: 0 },
		zoom:true,
		health: 3,
		decrease_health: () => set((state) => ({ health: state.health - 1 }))
	}));
}



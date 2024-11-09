
import { LitElement, html } from "lit";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { loadTemplate } from "./utils.js";
import { loadAndPlotData } from "./dataManager.js";
import { createInstanceStore } from "./state.js";
import { initialRender } from "./render.js";
import { addInteractions } from "./addInteractions.js";

class CartesianPlane extends LitElement {
	static properties ={
		id: { type: String },
		domain: { type: Array, attribute:"domain"},
	}

	constructor(){
		super();
		this.attachShadow({mode: 'open'});
		this.domain = this.domain || [-10,10]
	}

	connectedCallback(){
		super.connectedCallback();
		console.log(this.domain);
		this.store= createInstanceStore(this.id);
		this.populate();
	}

	async render() {
		this.shadowRoot.innerHTML = await loadTemplate();
		const [svg, xScale, yScale] = initialRender( this.shadowRoot , this.store);
		if (svg && xScale && yScale){ 
			this.store.setState({svg: svg});
			this.store.setState({xScale: xScale});
			this.store.setState({yScale: yScale});
		};
		addInteractions(this.shadowRoot, this.store);
	}

	populate() {
		// biome-ignore lint/style/useConst: <explanation>
		let deserializedFigures = loadAndPlotData();
		this.store.setState({figures: deserializedFigures});
	}

}

customElements.define("cartesian-plane", CartesianPlane);

export default CartesianPlane;

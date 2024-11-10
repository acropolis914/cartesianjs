
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
		this.domain = this.domain || [-10, 10];
	}

	connectedCallback(){
		super.connectedCallback();
		console.clear();
		this.store= createInstanceStore(this.id);
	}



	async render() {
		this.shadowRoot.innerHTML = await loadTemplate();
		if (!this.id) {
			const warningarea= this.shadowRoot.querySelector("#figures-container").querySelector("h2")
			warningarea.innerHTML = `<div class="error-message" style="background-color:red;width:100%;height:100%;color:white">ID is required</div>`;
		}
		const [svg, xScale, yScale, transformation] = initialRender( this.shadowRoot , this.store);
		if (svg && xScale && yScale){ 
			this.store.setState({svg: svg});
			this.store.setState({xScale: xScale});
			this.store.setState({yScale: yScale});

		};
		addInteractions(this.shadowRoot, this.store);
		loadAndPlotData(this.shadowRoot, this.store);
	}

}

customElements.define("cartesian-plane", CartesianPlane);

export default CartesianPlane;

import { LitElement, html } from "lit";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { loadTemplate } from "./utils.js";
import { loadAndPlotData, loadAndPlotData_fromProps } from "./dataManager.js";
import { createInstanceStore } from "./state.js";
import { initialRender, updateZoomable } from "./render.js";
import { addInteractions } from "./addInteractions.js";

class CartesianPlane extends LitElement {
	static properties = {
		id: { type: String },
		expects: { attribute: "expects" },
		plot: { attribute: "plot" },
		sidebar: { attribute: "sidebar" },
		sidebarClosed: { type: Boolean, attribute: "sidebar-closed" },
		range: { type: Array, attribute: "domain" },
	};

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.id = this.id;
		this.range = this.range || [-10, 10];
		this.plot = this.plot;
		this.expects = this.expects;
		this.sidebar = this.sidebar;
		this.sidebarClosed = this.sidebarClosed;
	}

	connectedCallback() {
		super.connectedCallback();
		console.clear();
		this.store = createInstanceStore(this.id);
	}

	async render() {
		this.store.setState({ root: this.shadowRoot });
		this.shadowRoot.innerHTML = await loadTemplate();
		if (!this.id) {
			console.log(
				"No ID provided, will default to null. All null instances will share the same storage."
			);
		}
		initialRender(this.shadowRoot, this.store);
		addInteractions(this.shadowRoot, this.store);
		loadAndPlotData(this.shadowRoot, this.store);
		loadAndPlotData_fromProps(this.store);


		const isSidebarEnabled =  this.sidebar !=="false";
		if (!isSidebarEnabled) {
			const sidebar = this.shadowRoot.querySelector("#figures-container");
			const sidebarButton = this.shadowRoot.querySelector("#sidebar-toggle-button");
			// @ts-ignore
			sidebar.style.display = "none";
			// @ts-ignore
			sidebarButton.style.display = "none";
		}

		const isSidebarClosed = this.sidebarClosed;
		if (isSidebarClosed) {
			const sidebarButton = this.shadowRoot.querySelector("#sidebar-toggle-button");
			console.log(sidebarButton);
			// @ts-ignore
			sidebarButton.click();
		}

	}
}

customElements.define("cartesian-plane", CartesianPlane);

export default CartesianPlane;

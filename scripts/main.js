import { LitElement, html } from "lit";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { loadTemplate, setRoot } from "./utils.js";
import { loadAndPlotData, loadAndPlotData_fromProps } from "./dataManager.js";
import { createInstanceStore } from "./state.js";
import { initialRender, updateZoomable, watchForResize } from "./render.js";
import { addInteractions } from "./addInteractions.js";

class CartesianPlane extends LitElement {
	/**
	 * Properties of the CartesianPlane component
	 * @property {string} id - The unique identifier for the component instance.
	 * @property {string} expects - The expected input data format.
	 * @property {object} plot - The plotting configuration object.
	 * @property {boolean} sidebar - Whether the sidebar is enabled.
	 * @property {boolean} sidebarClosed - Whether the sidebar is closed by default.
	 * @property {array} range - The domain range for the x and y axes.
	 */
	static properties = {
		id: { type: String },
		expects: { attribute: "expects" },
		plot: { attribute: "plot" },
		sidebar: { attribute: "sidebar" },
		sidebarClosed: { type: Boolean, attribute: "sidebar-closed" },
		range: { type: Array, attribute: "range" },
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
		this.store.setState({ root: this.shadowRoot, expects : this.expects });
		this.shadowRoot.innerHTML = await loadTemplate();
		setRoot(this.shadowRoot);
		if (!this.id) {
			console.log(
				"No ID provided, will default to null. All null instances will share the same storage.",
			);
		}
		initialRender(this, this.shadowRoot, this.store);
		addInteractions(this.shadowRoot, this.store);
		loadAndPlotData(this.shadowRoot, this.store);
		loadAndPlotData_fromProps(this, this.store);

		window.addEventListener("resize", () => {
			watchForResize(this.shadowRoot, this.store);
		});

		const isSidebarEnabled = this.sidebar !== "false";

		if (!isSidebarEnabled) {
			const sidebar = this.shadowRoot.querySelector("#figures-container");
			const sidebarButton = this.shadowRoot.querySelector(
				"#sidebar-toggle-button",
			);
			// @ts-ignore
			sidebar.style.display = "none";
			// @ts-ignore
			sidebarButton.style.display = "none";
		}

		const isSidebarClosed = !!this.sidebarClosed;
		if (isSidebarClosed) {
			const sidebarButton = this.shadowRoot.querySelector(
				"#sidebar-toggle-button",
			);
			// @ts-ignore
			sidebarButton.click();
		}

	}
}

customElements.define("cartesian-plane", CartesianPlane);

export default CartesianPlane;

import {isDeclared} from "../utilities.js";
import {element} from "./e.js";

export default class SpinnerRing {
	constructor(data = {
		generateContainer: false,
		message: "Please wait...",
		style: "classic",
		size: "normal"
	}) {
		this.container = null;
		this.result = null;
		this.spinnerParams = {
			type: "spinner-ring"
		};
		this.message = "";
		this.style = "classic";
		this.size = "normal";
		this.classes = [];
		this.setAttributes(data);

		if (isDeclared(data.generateContainer) && !data.generateContainer.isFunction() && data.generateContainer.bool()) {
			this.container = this.generateContainer();
			this.container.setAttribute("waiter", "waiter");
			this.container.appendChild(this.result);
			return this.container;
		}
		return this.result;
	}
	generateContainer() {
		return element({
			type: "spinner-container"
		});
	}
	setAttributes(data) {
		if (isDeclared(data.message) && !data.message.isFunction() && !data.message.empty()) {
			this.message = String(data.message);
		}
		if (isDeclared(data.style) && !data.style.isFunction() && !data.style.empty()) {
			switch (data.style.toString()) {
				case "coin":
					this.classes.push("gold");
					break;
				case "gold":
					this.classes.push("gold");
					break;
				case "inverse":
					this.classes.push("inverse");
					break;
				case "inverted":
					this.classes.push("inverse");
					break;
			}
		}
		if (isDeclared(data.size) && !data.size.isFunction() && !data.size.empty()) {
			switch (data.size.toString()) {
				case "small":
					this.classes.push("small");
					break;
				case "s":
					this.classes.push("small");
					break;
				case "medium":
					this.classes.push("medium");
					break;
				case "m":
					this.classes.push("medium");
					break;
			}
		}

		if (this.classes.length > 0) {
			this.spinnerParams.class = this.classes;
		}
		if (!this.message.empty()) {
			let text = this.message;
			this.result = element({
				type: "p",
				text: text,
				children: [
					element({
						type: "br"
					}),
					element(this.spinnerParams)
				]
			});
		} else {
			this.result = element(this.spinnerParams);
		}
	}
}
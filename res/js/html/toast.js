import {isDeclared} from "../utilities.js";
import {element} from "./e.js";

export default class Toast {
	constructor(data = {
		text: "",
		position: "",
		timeout: 0,
		appearance: "",
		useMaterial: false
	}) {
		data.timeout = parseInt(data.timeout) > 0 ? data.timeout : 5;
		this.classes = ["toast"];

		if(data.useMaterial) {
			this.classes.push("material");
		}

		switch (data.position) {
			case "top-center":
				this.classes.push("top");
				this.classes.push("center");
				break;
			case "center-top":
				this.classes.push("top");
				this.classes.push("center");
				break;
			case "bot-center":
				this.classes.push("bot");
				this.classes.push("center");
				break;
			case "bottom-center":
				this.classes.push("bot");
				this.classes.push("center");
				break;
			case "top-left":
				this.classes.push("top");
				this.classes.push("left");
				break;
			case "top-right":
				this.classes.push("top");
				this.classes.push("right");
				break;
			case "center-left":
				this.classes.push("left");
				this.classes.push("center");
				break;
			case "center-right":
				this.classes.push("right");
				this.classes.push("center");
				break;
			case "bot-left":
				this.classes.push("bot");
				this.classes.push("left");
				break;
			case "bot-right":
				this.classes.push("bot");
				this.classes.push("right");
				break;
			case "bottom-left":
				this.classes.push("bot");
				this.classes.push("left");
				break;
			case "bottom-right":
				this.classes.push("bot");
				this.classes.push("right");
				break;
			default:
				this.classes.push("bot");
				this.classes.push("center");
				break;
		}

		if (isDeclared(data.appearance) && !data.appearance.isFunction()) {
			switch (String(data.appearance)) {
				case "success":
					this.classes.push("success");
					break;
				case "green":
					this.classes.push("success");
					break;
				case "error":
					this.classes.push("error");
					break;
				case "red":
					this.classes.push("error");
					break;
				case "warning":
					this.classes.push("warning");
					break;
				case "yellow":
					this.classes.push("warning");
					break;
				case "orange":
					this.classes.push("warning");
					break;
			}
		}

		this.toast = element({
			type: "div",
			class: this.classes,
			attributes: {
				"script-generated": "true"
			},
			children: [
				element({
					type: "div",
					text: data.text
				})
			],
			load: (t) => {
				setTimeout(() => {
					t.parentNode.removeChild(t);
				}, data.timeout * 1000);
			}
		});

		return this.toast;
	}
}
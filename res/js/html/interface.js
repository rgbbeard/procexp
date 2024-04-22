import {$} from "../utilities.js";
import {element} from "./e.js";

export default class Interface {
	interface_components = [];
	
	constructor(data = {
		title: "Lorem ipsum",
		body: []
	}) {
		if (data.title && data.body) {
			if (data.body.isArray() && data.body.length > 0) {
				data.body.forEach(c => {
					this.interface_components.push(c);
				});

				let
					interface_id = "interface-" + $(".interface-background").length() + 1,
					close_btn = element({
						type: "span",
						id: [interface_id],
						class: ["interface-close-btn", "btn-ripple", "round", "error", "mini"],
						text: "x"
					}),
					interface_title_bar = element({
						type: "div",
						class: ["interface-title-bar"],
						children: [
							close_btn,
							element({
								type: "h4",
								text: String(data.title)
							})
						]
					}),
					interface_body = element({
						type: "div",
						class: ["interface-body"],
						children: this.interface_components
					}),
					e = element({
						type: "div",
						class: ["interface"],
						children: [
							interface_title_bar,
							interface_body
						]
					}),
					interface_background = element({
						type: "div",
						class: ["interface-background"],
						children: [e]
					});

				document.body.appendChild(interface_background);

				close_btn.on("click", function() {
					document.body.removeChild(interface_background);
				});
			} else {
				console.error("Body parameter expected to be not an empty array");
			}
		} else {
			console.error("Interface object expects 2 parameters");
		}
	}
}
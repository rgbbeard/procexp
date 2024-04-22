import {element} from "./e.js";
import {isDeclared} from "../utilities.js";

export default class Popup {
	constructor(data = {
		title: "",
		buttons: {}
	}) {
		this.popupWindow = null;
		this.element = null;
		this.title = isDeclared(data.title) ? data.title : "Messaggio";
		this.setParams(data);

		this.popupWindow = element({
			type: "div",
			class: ["confirm-window-background"],
			children: [this.element]
		});

		return this.popupWindow;
	}

	setParams(data) {
		let element_children = [
			element({
				type: "h3",
				class: ["confirm-window-title"],
				text: this.title
			})
		];

		if (isDeclared(data.buttons) && !data.buttons.isFunction() && data.buttons.length() > 0) {
			let button_count = 1;

			for (let button in data.buttons) {
				button = data.buttons[button];

				if (button.isFunction()) {
					continue;
				}

				let compiled_button_options = {
					type: "span",
					id: [`popup_button_${button_count}`],
					class: ["popup-button", "btn-custom"],
					text: (isDeclared(button.text) ? button.text : `Button ${button_count}`)
				};

				if (isDeclared(button.click) && button.click.isFunction()) {
					compiled_button_options.click = function() {
						button.click.call();
						this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
					};
				}

				if (isDeclared(button.appearance)) {
					switch (String(button.appearance)) {
						case "default":
							compiled_button_options.class.push("btn-white");
							break;

						case "white":
							compiled_button_options.class.push("btn-white");
							break;

						case "danger":
							compiled_button_options.class.push("btn-warning");
							break;

						case "orange":
							compiled_button_options.class.push("btn-warning");
							break;

						case "success":
							compiled_button_options.class.push("btn-default");
							break;

						case "green":
							compiled_button_options.class.push("btn-default");
							break;

						case "info":
							compiled_button_options.class.push("btn-success");
							break;

						case "blue":
							compiled_button_options.class.push("btn-success");
							break;

						case "error":
							compiled_button_options.class.push("btn-error");
							break;

						case "red":
							compiled_button_options.class.push("btn-error");
							break;

						default:
							compiled_button_options.class.push("btn-white");
							break;
					}
				}

				element_children.push(element(compiled_button_options));
				button_count++;
			}
		}

		this.element = element({
			type: "div",
			class: ["confirm-window-content"],
			children: element_children
		});
	}
}
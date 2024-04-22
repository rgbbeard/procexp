import {isDeclared} from "../utilities";
import {element} from "./e";

export default class InputFile {
	constructor(data = {
		input_text: "Upload",
		input_name: "",
		label_text: "Upload a file",
		list_placeholder: "No file in the queue",
		required: false,
		multiple: false,
		parent_classes: []
	}) {
		let input_id = _("div.input-group.file").length + 1;

		this.input_attrs = {
			"type": "file"
		};

		if (data.label_text.empty()) {
			data.label_text = "Upload a file";
		}

		if (data.list_placeholder.empty()) {
			data.list_placeholder = "No file in the queue";
		}

		if (data.input_name.empty()) {
			data.input_name = "input-file-" + input_id;
		}

		if (!isDeclared(data.parent_classes) ||data.parent_classes.empty() || !data.parent_classes.isArray()) {
			data.parent_classes = [];
		}

		data.parent_classes.push("input-group");
		data.parent_classes.push("file");

		if (data.multiple === true) {
			this.input_attrs["multiple"] = true;
		}

		if (data.required === true) {
			this.input_attrs["required"] = true;
		}

		this.element = element({
			type: "div",
			class: data.parent_classes,
			children: [
				element({
					type: "p",
					text: data.label_text
				}),
				element({
					type: "input",
					id: ["input-" + input_id],
					name: [data.input_name],
					attributes: this.input_attrs
				}),
				element({
					type: "label",
					for: "input-" + input_id,
					class: ["btn-ripple", "info"],
					text: data.input_text
				}),
				element({
					type: "div",
					class: ["files-list"],
					text: data.list_placeholder
				})
			]
		});

		return this.element;
	}
}
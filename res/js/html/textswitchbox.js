// TODO: fix this
class TextSwitchbox {
	constructor(data = {
		description: "",
		name: "",
		textOn: "On",
		textOff: "Off",
		bgcOn: "#fff",
		bgcOff: "#fff",
		colorOn: "#333",
		colorOff: "#333",
		valueOn: 1,
		valueOff: 0,
		checked: null,
		onCheck: function() {}
	}) {
		let name = data.name.empty() ?
			"tsb-" + _(".text-switchbox").length :
			data.name.replace(/\s+/g, "_");
		if (name[0].match(/[0-9]/)) {
			name = "tsb-" + name;
			print("Input names cannot begin with numbers, name replaced with: " + name);
		}
		let
			children = [],
			btnProps = ["for@" + data.name];
		if (data.description.empty() === false) children.push(
			new E({
				type: "p",
				text: data.description
			})
		);
		children.push(
			new E({
				type: "input",
				properties: [
					"id@" + name,
					"type@text",
					"hidden@true",
					"name@" + name
				]
			})
		);
		/* Add button properties */
		if (data.textOn.empty() === false) btnProps.push("text-on@" + data.textOn);
		if (data.textOff.empty() === false) btnProps.push("text-off@" + data.textOff);
		if (data.bgcOn.empty() === false) btnProps.push("bgc-on@" + data.bgcOn);
		if (data.bgcOff.empty() === false) btnProps.push("bgc-off@" + data.bgcOff);
		if (data.colorOn.empty() === false) btnProps.push("color-on@" + data.colorOn);
		if (data.colorOff.empty() === false) btnProps.push("color-on@" + data.colorOff);
		if (data.valueOn.empty() === false) btnProps.push("value-on@" + data.valueOn);
		if (data.valueOff.empty() === false) btnProps.push("value-on@" + data.valueOff);
		if (data.checked === false && data.checked.bool() === true) btnProps.push("button-checked@true");
		let btn = new E({
			type: "label",
			properties: btnProps
		});
		/* Check if button has a click function */
		if (data.onCheck.empty() === false && data.onCheck.isFunction() === true) {
			btn.onclick(() => {
				if (this.attr("button-checked") !== null && this.attr("button-checked").bool() === true) {
					data.onCheck.call();
				}
			});
		}
		children.push(btn);
		let i = new E({
			type: "div",
			properties: ["class@text-switchbox"],
			children: children
		});
		return i;
	}
}
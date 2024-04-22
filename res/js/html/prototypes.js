import {isDeclared, isUndefined} from "../utilities.js";
import {E} from "./e.js";
import Contextmenu from "./contextmenu.js";
import ConfirmDialog from "./confirmdialog.js";
import Toast from "./toast.js";
import Interface from "./interface.js";

const Elements = Element || Interface || ConfirmDialog || Toast || Contextmenu || E;
const Objects = Object || Elements || HTMLObjectElement;

Objects.prototype.stretch = function(properties = "width, height", mode = "match_parent, match_parent") {
	this.parentHeight = this.parentNode.offsetHeight;
	this.parentWidth = this.parentNode.offsetWidth;

	if(properties && properties.length >= 3) {
		if(!properties.match(/,/)) {
			switch(properties) {
				case "all":
					this.style.width = this.parentNode.offsetWidth + "px";
					this.style.height = this.parentNode.offsetHeight + "px";
					break;
				case "height":
					this.style.height = this.parentHeight + "px";
					break;
				case "width":
					this.style.width = this.parentWidth + "px";
					break;
			}
		} else if(properties.match(/((\w+),?\s?){2}/)) {
			const 
				width = properties.split(",")[0].trim(), 
				height = properties.split(",")[1].trim();
		}
	}
};
Objects.prototype.instance = function(instance) {
	return this instanceof instance;
};
Objects.prototype.mousepos = function(e) {
	if (isUndefined(e)) e = window.event;
	let
		pos = this.getBoundingClientRect(),
		posX = e.clientX - pos.left,
		posY = e.clientY - pos.top;
	return {
		x: posX,
		y: posY
	};
};
Objects.prototype.getPadding = function(padding = "global") {
	let target = this;
	if (!isDeclared(padding) || padding.empty()) {
		padding = "global";
	}
	switch (String(padding).toLowerCase()) {
		case (padding.match(/(,)+/)):
			let pads = padding.split(","),
				p = [];
			for (let x = 0; x < pads.length; x++) {
				p.push(pads[x].rmwhitesp(), parseFloat(window.getComputedStyle(target, null).getPropertyValue("padding-" + pads[x].rmwhitesp())));
			}
			return p;
		case (padding.rmwhitesp() === "global"):
			return {
				top: parseFloat(window.getComputedStyle(target, null).getPropertyValue("padding-top")),
					right: parseFloat(window.getComputedStyle(target, null).getPropertyValue("padding-right")),
					bottom: parseFloat(window.getComputedStyle(target, null).getPropertyValue("padding-bottom")),
					left: parseFloat(window.getComputedStyle(target, null).getPropertyValue("padding-left")),
			};
		case (["top", "right", "bottom", "left"].inArray(padding)):
			switch (padding) {
				case "top":
					return parseFloat(window.getComputedStyle(target, null).getPropertyValue("padding-top"));
				case "right":
					return parseFloat(window.getComputedStyle(target, null).getPropertyValue("padding-right"));
				case "bottom":
					return parseFloat(window.getComputedStyle(target, null).getPropertyValue("padding-bottom"));
				case "left":
					return parseFloat(window.getComputedStyle(target, null).getPropertyValue("padding-left"));
			}
			break;
		default:
			return {
				top: parseFloat(window.getComputedStyle(target, null).getPropertyValue("padding-top")),
					right: parseFloat(window.getComputedStyle(target, null).getPropertyValue("padding-right")),
					bottom: parseFloat(window.getComputedStyle(target, null).getPropertyValue("padding-bottom")),
					left: parseFloat(window.getComputedStyle(target, null).getPropertyValue("padding-left")),
			};
	}
};
Objects.prototype.gravity = function(endpoint = "parent", planet = "earth") {
	let gravity = 0, target = this;
	this.held = false;
	if (planet.match(/earth/i)) {
		gravity = 9.81;
	}

	function doAttraction() {
		target.style.top = parseFloat(target.style.top) + gravity + "px";
	}
	setInterval(() => {
		if (target.held !== true) {
			if (endpoint.match(/parent/i)) {
				if (target.style.top === "") {
					target.style.top = "0px";
				}

				if ((parseFloat(target.style.top) + target.offsetHeight) < target.parentNode.offsetHeight - target.parentNode.getPadding("bottom")) {
					doAttraction();

					if ((parseFloat(target.style.top) + target.offsetHeight) > target.parentNode.offsetHeight - target.parentNode.getPadding("bottom")) {
						target.style.top = target.parentNode.offsetHeight - target.parentNode.getPadding("bottom") - target.offsetHeight + "px";
					}
				}
			}
		}
	}, 0);
};
Objects.prototype.isObject = function() {
	return this.instance(Objects);
};
Objects.prototype.attachTo = function(element) {
	if (element.isObject() || element?.instance(Objects)) {
		let
			ot = element.getBoundingClientRect().top,
			ep = element.getPadding(),
			eh = element.offsetHeight,
			top = ot + ep.top + (eh / 2);

		this.addStyles({
			"top": top + "px",
		});
	}
};
Objects.prototype.isHidden = function() {
	return this.hasAttribute("hidden");
};
Objects.prototype.hide = function() {
	if (!this.isHidden()) {
		this.setAttribute("hidden", "");
	}
};
Objects.prototype.show = function() {
	if (this.isHidden()) {
		this.removeAttribute("hidden");
	}
};
Objects.prototype.clearUp = function() {
	this.innerHTML = "";
};
Objects.prototype.txt = function(t) {
	if (isDeclared(t)) {
		this.innerHTML = t;
	}
	return this.innerText;
};
Objects.prototype.on = function(listener, fn) {
	listener = String(listener);
	if (!fn.isFunction()) {
		console.error("Parameter fn must be a function");
		return;
	}
	this.addEventListener(listener, fn);
};

Objects.prototype.parentUntilClass = function(value, element = null) {
	if(value && !value.empty()) {
		let target = element ?? this;

		if(target.hasClass(value)) {
			return target;
		}

		return target.parentUntilClass(value, target.parentNode);
	}
};
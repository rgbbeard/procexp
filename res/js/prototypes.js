import {isNull} from "./utilities.js";

const Javascript = Object || String || Number || Array || Boolean;
Javascript.prototype.isArray = function() { return Array.isArray(this); };
Javascript.prototype.isFunction = function () { return this && {}.toString.call(this) === '[object Function]'; };
Javascript.prototype.bool = function () { return String(this).replace(/[\s|\t|\n]+/gm, "").match(/^true|yes|y|1$/i); };
Javascript.prototype.empty = function () { 
	const target = String(this);
	
	return target.toLowerCase()?.match(/^[\s|\t|\n]+$/gm) || target === "" || target === "null" || target === "undefined" || this.length == 0;
};
Array.prototype.inArray = function (obj) {
	for (let x = 0; x < this.length; x++) {
		if (this[x] === obj) {
			return true;
		}
	}
	
	return false;
};
Array.prototype.globalAction = function (listener, fn) { this.forEach(a => _(a).addEventListener(listener, fn)); };
Array.prototype.prepend = function(o) {
	let temp = this.slice();
	temp.unshift(o);

	return temp;
};
Array.prototype.getLast = function() { return this[this.length - 1]; };
Object.prototype.hasClass = function (c) { return this.classList.contains(String(c)); };
Object.prototype.toggleClass = function (c) { this.classList.toggle(String(c)); };
Object.prototype.toggleClasses = function (...args) { args.forEach(c => this.classList.toggle(String(c))); };
Object.prototype.removeClass = function (c) { this.classList.remove(String(c)); };
Object.prototype.removeClasses = function (...args) { args.forEach(c => this.removeClass(String(c))); };
Object.prototype.addClass = function (c) { this.classList.add(String(c)); };
Object.prototype.addClasses = function (...args) { args.forEach(c => this.addClass(String(c))); };
Object.prototype.removeAttributes = function (...args) { args.forEach(a => this.removeAttribute(String(a))); };
Object.prototype.appendChildren = function (...args) { args.forEach(child => this.appendChild(child)); };
Object.prototype.removeChildren = function (...args) { args.forEach(child => this.removeChild(child)); };
Object.prototype.insertAfter = function (...args) { 
	args.forEach(a => {
		this.parentNode.insertBefore(a, this.nextElementSibling);
	});
};
Object.prototype.isFirstChild = function() { return this === this.parentNode.children[0]; };
Object.prototype.isLastChild = function() {
	let
		parent = this.parentNode,
		c = parent.children,
		ls = parent.children[c.length - 1];

	return this === ls;
};
Object.prototype.previousSibling = function() { return this.isFirstChild() ? null : this.previousElementSibling; };
Object.prototype.nextSibling = function() {	return this.isLastChild() ? null : this.nextElementSibling; }
Object.prototype.moveBefore = function() {
    let parent = this.parentNode, prev = this.previousElementSibling;

	if(!isNull(prev)) {
		parent.insertBefore(this, prev);
	}
};
Object.prototype.moveAfter = function() {
	let parent = this.parentNode, next = this.nextElementSibling, nextIsLast = isNull(next.nextElementSibling);

	if(!isNull(next)) {
		let index = parent.children.elementIndex(next);

		if(!nextIsLast) {
			parent.insertBefore(this, parent.children[index+1]);
		} else {
			parent.appendChild(this);
		}
	}
};
Object.prototype.removeId = function (id) {
	if (this.getAttribute("id") !== null) {
		let 
			ids = this.getAttribute("id").split(" "),
			i = ids.indexOf(id.toString());

		ids = ids.splice(i, i);
		ids.length > 0 ?
	    	this.setAttribute("id", ids.join(" ")):
	        this.removeAttribute("id");
	}
};
Object.prototype.addId = function (id) {
	if (this.getAttribute("id") == null) {
		this.setAttribute("id", id);
	} else {
		let ids = this.getAttribute("id").split(" "), hasId = false;

		for (let x = 0; x < ids.length; x++) {
			if (ids[x] === id) {
				hasId = true;
				break;
			}
		}

		if (hasId === false) {
			this.setAttribute("id", ids.join(" "));
		}
	}
};
Object.prototype.hasId = function(id) {
	let ids = this.getAttribute("id");

	if(!isNull(ids)) {
		ids = ids.split(" ");
		ids.forEach(i => {
			if(i === id.toString()) {
				return true;
			}
		});
	}

	return false;
};
Object.prototype.elementIndex = function (element) {
	for (let i = 0; i < this.children.length; i++) {
		if (this.children[i] === element) {
			return i;
		}
	}

	return -1;
};
Object.prototype.addStyles = function (styles = {}) {
	let temp = [];

	for(let style in styles) {
		if(styles[style].isFunction()) {
			continue;
		}
		temp.push(String(style+":"+styles[style]));
	}

	let
		prev_styles = this.getAttribute("style"),
		new_styles = temp.join(";");
	let style = prev_styles + ";" + new_styles;

	if(prev_styles == null) {
		style = new_styles;
	}

	this.setAttribute("style", style);
};
Object.prototype.length = function() { return Object.keys(this).length; };
Object.prototype.isDisabled = function() { return isNull(this.getAttribute("disabled")); };
Object.prototype.rippleAnimation = function(e) {
	e = window.event;
	let t = e.target;

	t.removeClass("animated");

	if (!t.hasClass("animated")) {
		t.addClass("animated");
	}

	setTimeout(function() {
		t.removeClass("animated");
	}, 700);
};
String.prototype.capitalize = function () {
	let str = this.substr(1).toLowerCase(), cap = this[0].toUpperCase();
	return cap + str;
};
String.prototype.rmwhitesp = function () { return this.replace(/\s/g, ""); };
String.prototype.int = function() {	return parseInt(this); };
Number.prototype.percentage = function (percentage) { return percentage / 100 * this; };
Number.prototype.inRange = function (min, max) { return this >= parseInt(min) && this <= parseInt(max); };
NodeList.prototype.hasElement = function(element) {
	for(let x = 0;x<this.length;x++) {
		if(this[x] === element) {
			return true;
		}
	}

	return false;
};
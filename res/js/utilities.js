import {Select} from "./select.js";

export const
	www = String(window.location.origin + "/"),
	ww = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
	wh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

export const $ = selector => new Select(selector);
export const isNull = function(target) { return target === null; };
export const isUndefined = function(target) { return target === undefined; };
export const isDeclared = function(target) { return !isNull(target) && !isUndefined(target); };
window.SystemExecution = [];
export const SystemFn = function(fn) {
	if(isDeclared(fn) && typeof fn === "function" && fn.isFunction()) {
		window.SystemExecution.push(fn);
	} else {
		console.error("SystemFn expects 1 parameter and it must be a function.");
	}
};
const SystemExec = function() {
	let functions = window.SystemExecution, temp = [];

	functions.forEach(fn => {
		if(fn.isFunction()) {
			temp.push(fn);
		}
	});
	if(temp.length > 0) {
		temp.forEach(fn => fn.call());
		console.log("SystemExec: Execution finished.");
	} else {
		console.log("SystemExec: No functions were found.");
	}
};
window.addEventListener("load", SystemExec);
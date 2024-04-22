import Hasher from "./hasher.js";

export class Select {
	current = null;
	node = null;
	nodelist = null;
	multiple = false;

	constructor(selector = document.body) {
		if(selector === document.body || selector === document || selector === window) {
			this.node = selector;
		} else if((typeof selector) === "string") {
			const selection = this.node === null ?
				document.body.querySelectorAll(selector):
				this.node.querySelectorAll(selector);

			if(selection.length === 1) {
				this.node = selection[0];
			} else if(selection.length > 1) {
				this.multiple = true;
				this.nodelist = selection;
			}
		} else if(selector instanceof HTMLElement) {
			this.node = selector;
		} else if(selector instanceof Select) {
			if(selector.multiple) {
				this.current = selector.current;
				this.node = selector.current;
			} else {
				this.node = selector.node;
			}
		} else if(selector instanceof NodeList) {
			this.multiple = true;
			this.nodelist = selector;
		} else if(selector instanceof SVGElement) {
			this.node = selector;
		}

		return this;
	}

	getIfExists(element) {
		let s = null;

		if(element) {
			if(element instanceof HTMLElement) {
				if(!this.multiple) {
					if(this.node.children.hasElement(element)) {
						s = new Select(this.node.children[this.node.children.indexOf(element)]);
					}
				} else {
					if(this.current.children.hasElement(element)) {
						s = new Select(this.current.children[this.current.children.indexOf(element)]);
					}
				}
			} else if((typeof element) === "string") {
				const selection = this.multiple ? 
						this.current?.querySelectorAll(element)
						: this.node?.querySelectorAll(element);

				if(selection.length === 1) {
					s = new Select(selection[0]);
				} else if(selection.length > 1) {
					s = new Select(selection);
				}
			}
		}

		return s;
	}

	getObject() {
		const e = window.event;
		if(this.multiple) {
			for(let n = 0;n < this.nodelist.length;n++) {
				if(e.target === this.nodelist[n]) {
					return this.nodelist[n];
				}
			}
		}

		return this.node;
	}

	first() {
		if(this.multiple) {
			return this.nodelist[0];
		}

		return this.node;
	}

	parent() {
		if(!this.multiple) {
			this.node = this.node.parentNode;
		}

		return this;
	}

	value(value = "") {
		if(this.multiple) {
			if(value.empty()) {
				return Select.isInput(this.current) ? this.current.value : this.current.textContent;
			} else {
				if(Select.isInput(this.current)) {
					this.current.value = value;
				} else {
					this.current.textContent = value;
				}
			}
		} else {
			if(value.empty()) {
				return Select.isInput(this.node) ? this.node?.value : this.node?.textContent;
			} else {
				if(Select.isInput(this.node)) {
					this.node.value = value;
				} else {
					this.node.textContent = value;
				}
			}
		}
	}

	attr(name, value = null) {
		if(name && !name.empty()) {
			if(this.multiple) {
				if(value && value.empty()) {
					return this.current.getAttribute(name);
				} else {
					this.current.setAttribute(name, value);
					return value;
				}
			} else {
				if(value && value.empty()) {
					return this.node.getAttribute(name);
				} else {
					this.node.setAttribute(name, value);
					return value;
				}
			}
		} else {
			console.warn("Missing attribute name");
			return false;
		}
	}

	prop(name, value = null, editable = false) {
		if(!name?.empty()) {
			if(this.multiple) {
				if(!value) {
					return this.#getPropertyByName(name);
				} else {
					Object.defineProperty(this.current, name, {
			                value: value,
			                writable: editable,
			                configurable: true
			        });
					return value;
				}
			} else {
				if(!value) {
					return this.#getPropertyByName(name);
				} else {
					Object.defineProperty(this.node, name, {
			                value: value,
			                writable: editable,
			                configurable: true
			        });
					return value;
				}
			}
		} else {
			console.warn("Missing property name");
			return false;
		}
	}

	#getPropertyByName(name) {
		let result = null;
		const
			target = this.multiple ? this.current : this.node,
			properties = Object.getOwnPropertyNames(target);

		for(let x = 0;x<properties.length;x++) {
			if(name === properties[x]) {
				result = properties[x];
				break;
			}
		}

		return result;
	}

	children(push_child = null) {
		if(!this.multiple) {
			if(push_child?.isObject()) {
				this.current.appendChild(push_child);
			} else {
				return this.node.children;
			}
		} else {
			return this.current.children;
		}
	}

	length() {
		return this.multiple ? this.nodelist.length : 1;
	}

	each(fn) {
		if(fn.isFunction()) {
			if(this.multiple) {
			    for(let x = 0;x<this.nodelist.length;x++) {
			        const n = this.nodelist[x];
			        this.current = n;
			        if(!Hasher.hasHashFunction(n, "each", fn)) {
						this.bind(n, "each", fn);
					}
					fn(n, x);
				}
			} else {
				if(!Hasher.hasHashFunction(this.node, "each", fn)) {
					this.bind(this.node, "each", fn);
				}
				fn(this.node, 0);
			}
		} else {
			console.warn("Missing function to evaluate");
		}

		return this;
	}

	reset() {
		if(this.multiple) {
			for(let x = 0;x<this.nodelist.length;x++) {
				const n = this.nodelist[x];
				if(Select.isInput(n)) {
					n.value = "";
				} else {
					n.innerHTML = "";
				}
			}
		} else {
			if(Select.isInput(this.node)) {
				this.node.value = "";
			} else {
				this.node.innerHTML = "";
			}
		}

		return this;
	}

	remove() {
		if(this.multiple) {
			for(let x = 0;x<this.nodelist.length;x++) {
				this.nodelist[x].parentNode.removeChild(n);
			}
		} else {
			this.node.parentNode.removeChild(this.node);
		}
	}

	on(listener_name, fn) {
		if(fn.isFunction()) {
			if(this.multiple) {
			    for(let x = 0;x<this.nodelist.length;x++) {
			        const n = this.nodelist[x];
			        if(!Hasher.hasHashFunction(n, listener_name, fn)) {
						this.bind(n, listener_name, fn);
			        	n.addEventListener(listener_name, function(e) {
			        		e.currentTarget === n & fn.call();
			        	});
					}
				}
			} else {
				if(!Hasher.hasHashFunction(this.node, listener_name, fn)) {
					this.bind(this.node, listener_name, fn);
					this.node?.addEventListener(listener_name, function(e) {
		        		e.currentTarget === this.node & fn(e.currentTarget);
		        	});
				}
			}
		}

		return this;
	}

	appendChild(child) {
		// TODO: check child type
		return new Promise((ok, ko) => {
			if(this.multiple) {
				for(let x = 0;x<this.nodelist.length;x++) {
			        this.nodelist[x].appendChild(child);
				}

				ok();
			} else {
				this.node.appendChild(child);
				ok();
			}

			ko();
		});
	}

	appendChildren(...children) {
		return new Promise((ok, ko) => {
			if(this.multiple) {
				for(let x = 0;x<this.nodelist.length;x++) {
			        const n = this.nodelist[x];
					// TODO: check child type
			        children.forEach(child => {
						n.appendChild(child);
					});
				}

				ok();
			} else {
				children.forEach(child => {
					// TODO: check child type
					this.node.appendChild(child);
				});

				ok();
			}

			ko();
		});
	}

	static isInput(target) {
		const t = target && target.tagName.toLowerCase(); 
		return t === "input" || t === "textarea" || t === "button" || t === "select";
	}

	bind(target, event, fn) {
		const hash = Hasher.hashFunction(fn);

		if(target) {
			if(target instanceof Select) {
				target = target.getObject();
			}

			if(!target.hashes) {
				target.hashes = {};
			}

			if(!target.hashes[event]) {
				target.hashes[event] = [];
			}

			if(!target.hashes[event].includes(hash)) {
				target.hashes[event].push(hash);
			}
		}

		return this;
	}

	unbind(fn) {
		const hash = fn ? Hasher.hashFunction(fn) : null;

		let 
			n = this.node,
			obj = Hasher.recursiveFindHashFunction(n, hash);

		if(this.multiple) {
			for(let x = 0;x<this.nodelist.length;x++) {
		        n = this.nodelist[x];
		        obj = Hasher.recursiveFindHashFunction(n, hash);

		        if(obj) {
		        	delete n.hashes[obj.name][obj.hash];
		        }
			}
		} else {
			if(obj) {
	        	delete n.hashes[obj.name][obj.hash];
	        }
		}

		return this;
	}
}
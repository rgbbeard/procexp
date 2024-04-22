import {isDeclared, isNull} from "./utilities.js";

export default class Request {
	#methods = ["POST", "GET", "PUT", "DELETE"];
	#method = "POST";
	#url = "";
	#data = null;
	#done = null;
	#xhr = new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP"); //Edge-Explorer compatibility;

	constructor(params = {
		method: "",
		url: "",
		send_files: false,
		headers: {},
		data: {},
		done: function () {}
	}) {
		if(isDeclared(params.done) && params.done.isFunction()) {
			this.#done = params.done;
		}

		this.setParams(params);
		
		this.#xhr.open(this.#method, this.#url, true);

		if(!isDeclared(params.headers) || params.headers.length() === 0) {
			params.headers = {};
		}

		params.headers["Content-Type"] = "application/json";
		if(isDeclared(params.headers) && params.headers.length > 0) {
			for (let header in params.headers) {
				const value = params.headers[header];
				this.#xhr.setRequestHeader(header, value);
			}
		}

		this.setData(params.data);

		if(isDeclared(params.send_files) && params.send_files === true) {
			this.#xhr.overrideMimeType("multipart/form-data");
		}

		//Send data
		this.#xhr.send(this.data);
		this.#xhr.onload = () => {
			let result = [];
			result["code"] = this.#xhr.status;
			result["response"] = this.#xhr.statusText;
			result["return"] = this.#xhr.responseText;
			result["xmlReturn"] = this.#xhr.responseXML;

			if(!isNull(this.#done)) {
				this.#done(result);
			}
		};

		return this;
	}

	setParams(data) {
		//Set method
		if (isDeclared(data.method) && this.#methods.inArray(data.method.toUpperCase())) {
			this.#method = data.method.toUpperCase();
		} else {
			console.error("Method parameter is not supported. Try using one of these methods: post, get, put, delete.");
		}

		//Set url
		if (isDeclared(data.url) && data.url.toString().length > 0) {
			this.#url = data.url.toString();
		} else {
			console.error("Url parameter must have a length of at least 1 character.");
		}

		return this;
	}

	setData(data) {
		if(isDeclared(data) && data.length() > 0) {
			const form = new FormData();

			for(let key in data) {
				let value = data[key];

				if(isDeclared(value) && !value.isFunction()) {
					if(isDeclared(value.type) && value.type === "file") { //This one for file upload
						for(let f = 0;f<value.files.length;f++) {
							form.append(`${key}[]`, value.files[f], value.files[f].name);
						}
					} else {
						form.append(key, value);
					}
				}
			}

			this.data = form;
		}

		return this;
	}
}
export default class Converter {
	static rgb2Hex(r, g, b) {
		r = r.toString(16).toUpperCase().length === 1 ? "0" + r : r;
		g = g.toString(16).toUpperCase().length === 1 ? "0" + g : g;
		b = b.toString(16).toUpperCase().length === 1 ? "0" + b : b;
		return `#${r}${g}${b};`;
	}

	static hex2Rgb(color) {
		color = color.trim().toUpperCase();
		color.match(/^#?/) ? color = color.replace("#", "") : color;

		if (color.length !== 6) {
			console.error("The written color does not match the requirements: color length must be exactly 6.");
			return false;
		} else {
			const 
				r = parseInt(color.substring(0, 2), 16),
				g = parseInt(color.substring(2, 4), 16),
				b = parseInt(color.substring(4, 6), 16);
			
			return `rgb(${r}, ${g}, ${b});`;
		}
	}

	static hex2Rgba(color, alpha) {
		color = color.trim().toUpperCase();
		color.match(/^#?/) ? color = color.replace("#", "") : color;

		if (color.length !== 6) {
			console.error("The written color does not match the requirements: color length must be exactly 6.");
			return false;
		} else {
			const
				r = parseInt(color.substring(0, 2), 16),
				g = parseInt(color.substring(2, 4), 16),
				b = parseInt(color.substring(4, 6), 16);

			return `rgb(${r}, ${g}, ${b}, ${alpha});`;
		}
	}

	static json2Array(jsonObject) {
		let temp = [];

		for(let object in jsonObject) {
			if(!jsonObject[object].isFunction()) {
				temp.push(object);

				if(typeof jsonObject[object] === "object") {
					temp[object] = this.json2Array(jsonObject[object]);
				} else {
					temp[object] = jsonObject[object];
				}
			}
		}

		return temp;
	}
}
import {Select} from "./select.js";
import {isDeclared} from "./utilities.js";

export default class Hasher {
	static hasHashFunction(target, event, fn) {
	    const hash = fn ? Hasher.hashFunction(fn) : null;

	    if(target instanceof Select) {
	        target = target.getObject();
	    }

	    if(target?.hashes && event) {
	        if(fn && hash) {
	            return target.hashes[event]?.includes(hash);
	        } else if(!fn) {
	            return target.hashes[event]?.length > 0;
	        }
	    }

	    return false;
	}

	static recursiveFindHashFunction(target, hash) {
		if(isDeclared(target)) {
			const obj = target.hashes;

			if(isDeclared(obj)) {
				for(let e in obj) {
					if(obj.hasOwnProperty(e)) {
						if(obj[e].includes(hash)) {
							return {
								name: e,
								hash: hash
							};
						}
					}
				}
			}
		}

		return false;
	}

	static hashFunction(fn) {
		// ensures minified function
		return btoa(fn.toString().replace(/\s+/gm, " "));
	}
}
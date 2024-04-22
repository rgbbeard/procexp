import { isDeclared, isUndefined, isNull } from "../utilities.js";

export class SVG {
    constructor(data = {
        type: "",
        id: [],
        class: [],
        style: {},
        name: [],
        text: "",
        value: "",
        src: "",
        href: "",
        attributes: {},
        children: []
    }) {
        isDeclared(data.type) && data.type.length > 0 ?
            this.type = data.type :
            console.error("HTML tag must be defined");

        this.element = document.createElementNS("http://www.w3.org/2000/svg", this.type);

        this.setParams(data);
        this.addChildren(data.children);
        return this.element;
    }

    setParams(data) {
        /* Set properties */
        //IDs
        if(isDeclared(data.id) && data.id.isArray() && data.id.length > 0) {
            data.id.forEach(i => this.element.addId(i));
        }
        //Classes
        if(isDeclared(data.class) && data.class.isArray() && data.class.length > 0) {
            data.class.forEach(c => this.element.addClass(c));
        }
        //Inline styles
        if(isDeclared(data.style) && typeof data.style === "object" && data.style.length() > 0) {
            this.element.addStyles(data.style);
        }

        /* Set attributes */
        //Text content
        if(isDeclared(data.text)) {
            this.element.innerHTML = data.text;
        }

        //Other attributes
        if(isDeclared(data.attributes) && typeof data.attributes == "object" && data.attributes.length() > 0) {
            for (let attribute in data.attributes) {
                if(!attribute.isFunction()) {
                    let value = data.attributes[attribute];
                    if(!value.isFunction()) {
                        const a = document.createAttribute(attribute);
                        a.value = value;
                        this.element.setAttributeNode(a);
                    }
                }
            }
        }
        //Inline style
        if(isDeclared(data.style) && typeof data.style == "object" && data.style.length() > 0) {
            let styles = "";

            for (let attribute in data.style) {
                if(!attribute.isFunction()) {
                    let values = data.style[attribute];

                    if(!values.isFunction()) {
                        styles += `${attribute}:${values};`;
                    }
                }
            }

            this.element.setAttribute("style", styles);
        }
    }

    addChildren(children) {
        if(isDeclared(children) && children.isArray()) {
            children.forEach(child => {
                if(typeof child === "object") {
                    this.element.appendChild(child);
                }
            });
        }
    }
}
export const svg = options => new SVG(options);
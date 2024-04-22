import {element} from "./e.js"
import {isDeclared} from "../utilities.js";
import Converter from "../converter.js";

export default class Cube {
	constructor(data = {
		size: 0,
		images: {
			top: "",
			right: "",
			bottom: "",
			left: "",
			front: "",
			back: ""
		},
		labels: {
			top: "1",
			right: "2",
			bottom: "3",
			left: "4",
			front: "5",
			back: "6"
		},
		useGlobalColor: false,
		borderRadius: 0,
		borderWidth: 1,
		colors: {
			top: "00000055",
			right: "00000055",
			bottom: "00000055",
			left: "00000055",
			front: "00000055",
			back: "00000055"
		},
		globalColor: "",
		transparency: false,
		transparencies: [],
		globalTransparency: 0.5,
		randomRotate: true,
		rotationTimeout: 1
	}) {
		let
			size = 120,
			borderWidth = data.borderWidth ?? 0,
			//Set default labels
			topLabel = "1",
			rightLabel = "2",
			botLabel = "3",
			leftLabel = "4",
			frontLabel = "5",
			backLabel = "6",
			//Set default colors
			topBg = "#000000",
			rightBg = "#000000",
			botBg = "#000000",
			leftBg = "#000000",
			frontBg = "#000000",
			backBg = "#000000",
			properties = {},
			rotationTimeout = data.rotationTimeout ?? 1,
			styles = {
				display: "inline-block",
				margin: "40px",
				transition: "all 1.5s",
				position: "relative",
				"transform-style": "preserve-3d",
				width: `${size}px`,
				height: `${size}px`,
				"user-select": "none"
			}
		;

		if (isDeclared(data.size) && data.size > 10) {
			size = data.size;

		}
		if (isDeclared(data.labels)) {
			if(isDeclared(data.labels.top)) {
				topLabel = data.labels.top;
			}

			if(isDeclared(data.labels.right)) {
				rightLabel = data.labels.right;
			}

			if(isDeclared(data.labels.bottom)) {
				botLabel = data.labels.bottom;
			}

			if(isDeclared(data.labels.left)) {
				leftLabel = data.labels.left;
			}

			if(isDeclared(data.labels.front)) {
				frontLabel = data.labels.front;
			}

			if(isDeclared(data.labels.back)) {
				backLabel = data.labels.back;
			}
		}

		if (isDeclared(data.colors)) {
			if(isDeclared(data.colors.top)) {
				topBg = `#${data.colors.top}`;
			}

			if(isDeclared(data.colors.right)) {
				rightBg = `#${data.colors.right}`;
			}

			if(isDeclared(data.colors.bottom)) {
				botBg = `#${data.colors.bottom}`;
			}

			if(isDeclared(data.colors.left)) {
				leftBg = `#${data.colors.left}`;
			}

			if(isDeclared(data.colors.front)) {
				frontBg = `#${data.colors.front}`;
			}

			if(isDeclared(data.colors.back)) {
				backBg = `#${data.colors.back}`;
			}
		} else if (data.useGlobalColor === true && data.globalColor.length.inRange(6, 8) === true) {
			topBg = `#${data.globalColor}`;
			rightBg = `#${data.globalColor}`;
			botBg = `#${data.globalColor}`;
			leftBg = `#${data.globalColor}`;
			frontBg = `#${data.globalColor}`;
			backBg = `#${data.globalColor}`;
		}

		if (data.randomRotate === true) {
			properties.autorotate = rotationTimeout;
		}

		if(isDeclared(data.globalTransparency)) {
			topBg = Converter.hex2Rgba(topBg, data.globalTransparency);
			rightBg = Converter.hex2Rgba(rightBg, data.globalTransparency);
			botBg = Converter.hex2Rgba(botBg, data.globalTransparency);
			leftBg = Converter.hex2Rgba(leftBg, data.globalTransparency);
			frontBg = Converter.hex2Rgba(frontBg, data.globalTransparency);
			backBg = Converter.hex2Rgba(backBg, data.globalTransparency);
		}

		return element({
			type: "div",
			class: ["cube"],
			style: styles,
			children: [
				//Front face
				element({
					type: "div",
					class: ["cube-face"],
					style: {
						"border-radius": `${data.borderRadius}px`,
						border: `solid ${borderWidth}px #000`,
						"background-color": frontBg,
						position: "absolute",
						width: "100%",
						height: "100%",
						"font-size": `${(size / 2) - 10}px`,
						"font-weight": "bold",
						color: "#fff",
						"text-align": "center",
						transform: `rotateY(0deg) translateZ(${size / 2}px)`,
						"line-height": `${size}px`
					},
					text: frontLabel.toString()
				}),
				//Back face
				element({
					type: "div",
					class: ["cube-face"],
					style: {
						"border-radius": `${data.borderRadius}px`,
						border: `solid ${data.borderWidth}px #000`,
						"background-color": backBg,
						position: "absolute",
						width: "100%",
						height: "100%",
						"font-size": `${(size / 2) - 10}px`,
						"font-weight": "bold",
						color: "#fff",
						"text-align": "center",
						transform: `rotateY(180deg) translateZ(${size / 2}px)`,
						"line-height": `${size}px`
					},
					text: backLabel.toString()
				}),
				//Top face
				element({
					type: "div",
					class: ["cube-face"],
					style: {
						"border-radius": `${data.borderRadius}px`,
						border: `solid ${data.borderWidth}px #000`,
						"background-color": topBg,
						position: "absolute",
						width: "100%",
						height: "100%",
						"font-size": `${(size / 2) - 10}px`,
						"font-weight": "bold",
						color: "#fff",
						"text-align": "center",
						transform: `rotateX(90deg) translateZ(${size / 2}px)`,
						"line-height": `${size}px`
					},
					text: topLabel.toString()
				}),
				//Right face
				element({
					type: "div",
					class: ["cube-face"],
					style: {
						"border-radius": `${data.borderRadius}px`,
						border: `solid ${data.borderWidth}px #000`,
						"background-color": rightBg,
						position: "absolute",
						width: "100%",
						height: "100%",
						"font-size": `${(size / 2) - 10}px`,
						"font-weight": "bold",
						color: "#fff",
						"text-align": "center",
						transform: `rotateY(90deg) translateZ(${size / 2}px)`,
						"line-height": `${size}px`
					},
					text: rightLabel.toString()
				}),
				//Bottom face
				element({
					type: "div",
					class: ["cube-face"],
					style: {
						"border-radius": `${data.borderRadius}px`,
						border: `solid ${data.borderWidth}px #000`,
						"background-color": botBg,
						position: "absolute",
						width: "100%",
						height: "100%",
						"font-size": `${(size / 2) - 10}px`,
						"font-weight": "bold",
						color: "#fff",
						"text-align": "center",
						transform: `rotateX(-90deg) translateZ(${size / 2}px)`,
						"line-height": `${size}px`
					},
					text: botLabel.toString()
				}),
				//Left face
				element({
					type: "div",
					class: ["cube-face"],
					style: {
						"border-radius": `${data.borderRadius}px`,
						border: `solid ${data.borderWidth}px #000`,
						"background-color": leftBg,
						position: "absolute",
						width: "100%",
						height: "100%",
						"font-size": `${(size / 2) - 10}px`,
						"font-weight": "bold",
						color: "#fff",
						"text-align": "center",
						transform: `rotateY(-90deg) translateZ(${size / 2}px)`,
						"line-height": `${size}px`
					},
					text: leftLabel.toString()
				})
			],
			attributes: properties
		});
	}
}
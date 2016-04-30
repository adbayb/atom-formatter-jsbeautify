"use babel";

export default class Formatter {
	constructor(fileType) {
		this.type = fileType;
		console.log(fileType, this.type);
	}

	provideFormatter() {

	}
}

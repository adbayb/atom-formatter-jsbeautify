"use babel";

export default class BeautifierError extends Error {
	constructor(message, behavior, err) {
		super(message);
		this.name = "BeautifyError";
		this.behavior = behavior;
		this.err = err;
	}

	getBehavior() {
		return this.behavior;
	}

	getError() {
		return this.err;
	}
}

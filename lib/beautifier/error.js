"use babel";

export default class BeautifierError extends Error {
	constructor(message, behavior, error) {
		super(message);

		this.name = "BeautifyError";
		this.message = message;
		this.behavior = behavior;
		this.error = error;
	}

	getName() {
		return this.name;
	}

	getMessage() {
		return this.message;
	}

	getBehavior() {
		return this.behavior;
	}

	getError() {
		return this.error;
	}

	toString() {
		return this.name + ": " + this.message + "\n"
			+ "Details: " + this.error + "\n"
			+ "Next behavior: " + this.behavior;
	}
}

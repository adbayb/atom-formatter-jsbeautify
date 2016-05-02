"use babel";

import Api from "./api";
import Beautifier from "./beautifier";
import BeautifierError from "./beautifier/error.js";

class AtomPlugin {
	constructor() {
		this.pluginName = "atom-formatter-jsbeautify";
		this.api = null;
		this.beautifier = null;
	}

	activate(state) {
		this.api = new Api(this.pluginName);
		this.beautifier = new Beautifier();
	}

	provideFormatter() {
		return [{
			selector: [".source.js", ".source.js.jsx", ".source.json"],
			getNewText: (data) => {
					return this.beautifier.js(this.api.getCurrentProjectPath(), data).then(beautifiedData => {
						return beautifiedData;
					}).catch(err => {
						let details = err;
						if(err instanceof BeautifierError)
							details = err.toString();

						atom.notifications.addError(this.pluginName, {
							detail: details,
							dismissable: true
						});

						return this.beautifier.jsDefault(data);
					});
				}
		}, {
			selector: [".source.css", ".source.css.scss", ".source.css.less", ".source.sass"],
			getNewText: (data) => {
				return this.beautifier.css(this.api.getCurrentProjectPath(), data).then(beautifiedData => {
					return beautifiedData;
				}).catch(err => {
					let details = err;
					if(err instanceof BeautifierError)
						details = err.toString();

					atom.notifications.addError(this.pluginName, {
						detail: details,
						dismissable: true
					});

					return this.beautifier.cssDefault(data);
				});
			}
		}, {
			selector: [".text.html", ".text.xml"],
			getNewText: (data) => {
				return this.beautifier.html(this.api.getCurrentProjectPath(), data).then(beautifiedData => {
					return beautifiedData;
				}).catch(err => {
					let details = err;
					if(err instanceof BeautifierError)
						details = err.toString();

					atom.notifications.addError(this.pluginName, {
						detail: details,
						dismissable: true
					});

					return this.beautifier.htmlDefault(data);
				});
			}
		}];
	}
}

export default new AtomPlugin();

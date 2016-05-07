"use babel";

import JSBeautify from "js-beautify";
import fs from "fs";
import path from "path";
import BeautifierError from "./error.js";

export default class Beautifier {
	constructor() {
		this.projectPath = null;
		this.config = null;
	}

	resetConfig() {
		this.config = null;
	}

	getConfig(projectPath) {
		return new Promise((resolve, reject) => {
			if(projectPath) {
				let filename = path.resolve(projectPath, ".jsbeautifyrc");
				fs.readFile(filename, "utf8", (err, data) => {
					if(err)
						reject(new BeautifierError(
							".jsbeautifyrc not found",
							"Beautify with default configurations",
							err
						));

					try {
						resolve(JSON.parse(data));
					} catch(exception) {
						reject(new BeautifierError(
							"An exception occurred when parsing json configuration file " + filename,
							"Beautify with default configurations",
							exception
						));
					}
				});
			} else
				reject(new BeautifierError(
					"Wrong project path",
					"No beautification",
					"path is null"
				));
		});
	}

	checkConfig(projectPath) {
		if(projectPath !== this.projectPath) {
			console.log("atom-formatter-jsbeautify", "Beautifier->exec()", "Project folder updated: Configurations are going to be reloaded.");
			this.projectPath = projectPath;
			return this.getConfig(projectPath);
		}
		console.log("atom-formatter-jsbeautify", "Beautifier->exec()", "Same project folder.");

		return new Promise((resolve, reject) => {
			resolve(this.config);
		});
	}

	js(projectPath, data) {
		return this.checkConfig(projectPath).then((config) => {
			if(this.config !== config)
				this.config = config;
			let beautifiedData = JSBeautify.js(data, config);
			return new Promise((resolve, reject) => {
				if(beautifiedData)
					resolve(beautifiedData);
				else
					reject(new BeautifierError("Empty Code or An error occurred", "Attempt to beautify with default configurations"));
			});
		});
	}

	css(projectPath, data) {
		return this.checkConfig(projectPath).then((config) => {
			if(this.config !== config)
				this.config = config;
			let beautifiedData = JSBeautify.css(data, config);
			return new Promise((resolve, reject) => {
				if(beautifiedData)
					resolve(beautifiedData);
				else
					reject(new BeautifierError("Empty Code or An error occurred", "Attempt to beautify with default configurations"));
			});
		});
	}

	html(projectPath, data) {
		return this.checkConfig(projectPath).then((config) => {
			if(this.config !== config)
				this.config = config;
			let beautifiedData = JSBeautify.html(data, config);
			return new Promise((resolve, reject) => {
				if(beautifiedData)
					resolve(beautifiedData);
				else
					reject(new BeautifierError("Empty Code or An error occurred", "Attempt to beautify with default configurations"));
			});
		});
	}

	jsDefault(data) {
		this.resetConfig();
		return JSBeautify.js(data);
	}

	cssDefault(data) {
		this.resetConfig();
		return JSBeautify.css(data);
	}

	htmlDefault(data) {
		this.resetConfig();
		return JSBeautify.html(data);
	}
}

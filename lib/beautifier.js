"use babel";

import JSBeautify from "js-beautify";
import fs from "fs";
import path from "path";

//Valeurs par défaut si .jsbeautifyrc non trouvé: cf. https://www.npmjs.com/package/js-beautify
export default class Beautifier {
	constructor(projectPath) {
		this.projectPath = projectPath;
		this.getConfig(projectPath, (conf) => {
			this.config = conf;
		});
	}

	getConfig(projectPath, onSuccess) {
		let filename = path.resolve(projectPath, ".jsbeautifyrc");
		fs.readFile(filename, "utf8", (err, data) => {
			if(err) {
				console.log("atom-formatter-jsbeautify", "Beautifier->getConfig()", ".jsbeautifyrc not found => Using default configurations");
				return null;
			}

			//Parsage de la configuration en objet json:
			let jsonConfig = JSON.parse(data);
			console.log("atom-formatter-jsbeautify", "Beautifier->getConfig()", jsonConfig);

			return onSuccess(jsonConfig);
		});
	}

	checkConfig(projectPath, onBeautify) {
		//Recherche de la configuration si on change de project path sur l'active item:
		if(projectPath !== this.projectPath) {
			console.log("atom-formatter-jsbeautify", "Beautifier->exec()", "Project folder updated: Configurations are going to be reloaded.");
			this.projectPath = projectPath;
			return this.getConfig(projectPath, (conf) => {
				this.config = conf;
				return onBeautify(conf);
			});
		}
		console.log("atom-formatter-jsbeautify", "Beautifier->exec()", "Same project folder.");

		return onBeautify(this.config);
	}

	js(projectPath, data) {
		/*Utilisation d'une Promise (promesse) pour permettre de retourner le code beautifié dans la fonction
		service getNewText de provideFormatter. En effet, cette dernière est appelée comme callback par le plugin formatter:
		elle est résolue par la fonction Promise.resolve. On peut donc gérer notre beautification de façon asynchrone, Promise.resolve
		se chargera de prendre la fullfilled value envoyée par resolve()
		(cf. https://github.com/atom-community/formatter/blob/master/lib/main.coffee)
		(cf. http://bluebirdjs.com/docs/api/promise.resolve.html)*/
		return new Promise((resolve, reject) => {
			this.checkConfig(projectPath, (config) => {
				let beautifiedData = JSBeautify.js(data, config);
				if(beautifiedData)
					resolve(beautifiedData);
				else
					reject("Empty Data or An error occurred");
			});
		});
	}
}

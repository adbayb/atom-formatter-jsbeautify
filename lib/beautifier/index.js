"use babel";

import JSBeautify from "js-beautify";
import fs from "fs";
import path from "path";
import BeautifierError from "./error.js";

//Valeurs par défaut si .jsbeautifyrc non trouvé: cf. https://www.npmjs.com/package/js-beautify
export default class Beautifier {
	constructor() {
		this.projectPath = null;
		this.config = null;
	}

	getConfig(projectPath) {
		return new Promise((resolve, reject) => {
			//Dans une Promise, on peut faire appel à plusieurs resolve(), reject(). Seul le premier
			//rencontré (même fonctionnement que try/catch) sera pris en compte puisqu'une promise est immutable
			//(elle ne peut pas changer de valeur de retour au cours de son exécution, d'où le fait qu'on recréé
			//une nouvelle Promise à chaque appel de fonction):
			if(projectPath) {
				let filename = path.resolve(projectPath, ".jsbeautifyrc");
				fs.readFile(filename, "utf8", (err, data) => {
					if(err)
						reject(new BeautifierError(
							".jsbeautifyrc not found",
							"Using default configurations",
							err
						));

					//Parsage de la configuration en objet json:
					try {
						let jsonConfig = JSON.parse(data);
						resolve(jsonConfig);
					} catch(exception) {
						reject(new BeautifierError(
							"An exception occurred when parsing json configuration file " + filename,
							"Using default configurations",
							exception
						));
					}
				});
			} else
				reject(new BeautifierError("Wrong project path", "Using default configurations"));
		});
	}

	checkConfig(projectPath) {
		//Recherche de la configuration si on change de project path sur l'active item:
		//Cette condition sera typiquement appelé lors du premier appel à js()...
		//ou lorsqu'on change de project path après un appel à js pour pouvoir chercher
		//et recharger la nouvelle configuration .jsbeautifyrc du nouveau project path:
		if(projectPath !== this.projectPath) {
			console.log("atom-formatter-jsbeautify", "Beautifier->exec()", "Project folder updated: Configurations are going to be reloaded.");
			this.projectPath = projectPath;
			//On retourne la Promise getConfig (toute erreur liée à cette Promise sera catché lors
			//de l'appel de la chaîne de Promises avec un catch final qui captera toutes les exceptions
			//(pour éviter d'avoir du code répétitifs) (cf. init.js lors de l'appel à la fonction js() par exemple)):
			return this.getConfig(projectPath);
		}
		console.log("atom-formatter-jsbeautify", "Beautifier->exec()", "Same project folder.");

		//Auquel cas (si toujours dans le même project path), on retourne une promise avec la configuration déjà loadée:
		return new Promise((resolve, reject) => {
			//if(this.config === null) warning default conf
			resolve(this.config);
		});
	}

	js(projectPath, data) {
		/*Utilisation d'une Promise (promesse) pour permettre de retourner le code beautifié dans la fonction
		service getNewText de provideFormatter. En effet, cette dernière est appelée comme callback par le plugin formatter:
		elle est résolue par la fonction Promise.resolve. On peut donc gérer notre beautification de façon asynchrone, Promise.resolve
		se chargera de prendre la fullfilled value envoyée par resolve()
		(cf. https://github.com/atom-community/formatter/blob/master/lib/main.coffee)
		(cf. http://bluebirdjs.com/docs/api/promise.resolve.html)
		cf. http://www.datchley.name/es6-promises/*/
		return this.checkConfig(projectPath).then((config) => {
			this.config = config;
			let beautifiedData = JSBeautify.js(data, config);
			return new Promise((resolve, reject) => {
				console.log(this.config);
				if(beautifiedData)
					resolve(beautifiedData);
				else
					reject(new BeautifierError("Empty Data or An error occurred", "Code remains unchanged"));
			});
		});
	}
}

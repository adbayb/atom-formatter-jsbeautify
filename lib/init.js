"use babel";

//import atom inutile: atom est un objet global accessible par n'importe quel plugin:
//import * as atom from "atom";
import child_process from "child_process";
import Api from "./api";
import Beautifier from "./beautifier";
import BeautifierError from "./beautifier/error.js";

//Point d'entrée de notre plugin Atom. Les fonctions activate(), deactivate() et serialize()
//décrivent le cycle de vie du plugin: cf. http://flight-manual.atom.io/hacking-atom/sections/package-word-count/
//Ecriture du plugin via ES2015 (ES6): cf. http://www.sitepoint.com/write-atom-packages-using-vanilla-javascript/
//Debugging: cf. http://stackoverflow.com/questions/32429076/develop-and-debug-atom-package
//(CTRL+ALT+I pour ouvrir le debugguer Chromium. CTRL+ALT+R pour reload Atom.
//View > Developer pour les options de dev).
//Apis: cf. https://atom.io/docs/api
class AtomPlugin {
	constructor() {
		this.pluginName = "atom-formatter-jsbeautify";
		this.api = null;
		this.beautifier = null;
	}

	activate(state) {
		//Instanciation de nos classes à l'initialisation de notre module:
		this.api = new Api(this.pluginName);
		this.beautifier = new Beautifier();
	}

	/*
	//Les fonctions deactivate() et serialize() sont optionnelles. Elle permettent de gérer
	//le comportement de notre plugin lors de la fermeture de la fenêtre par exemple (désactivation module,
	//sérialisation des données pour une restoration...):
	deactivate() {
		console.log("atom-formatter-jsbeautify", "deactivate");
	},
	serialize() {
		console.log("atom-formatter-jsbeautify", "serialize");
	}
	*/

	//Consommation du service provideFormatter du plugin Formatter: toute intéraction avec Formatter
	//doit se faire ici (cf. package.json pour l'injection du service provideFormatter)
	//cf. http://flight-manual.atom.io/behind-atom/sections/interacting-with-other-packages-via-services/
	//cf. http://coffeescript.org/#embedded pour la conversion coffescript to javascript
	//(utile si utilisation d'une api coffescript sous es2015):
	provideFormatter() {
		return [{
			//selector: ".source.js" || ".source.css" || ".source.json" || ".source.jshintrc" || ".source.jsbeautifyrc",
			//Le sélecteur se base sur le type de fichier scopé par Atom. Pour récupérer le scope
			//du fichier en cours: atom.workspace.getActiveTextEditor().getGrammar().scopeName
			//Liste des Scopes atom: cf. https://atom.io/packages/file-types
			//.source.js prend en compte également ses sélecteurs enfants (donc implicitement .source.js.jsx,
			//mais pour plus de clarté, on le spécifie dans la liste des sélecteurs):
			selector: [".source.js", ".source.js.jsx", ".source.json"],
			getNewText: (data) => {
					return this.beautifier.js(this.api.getCurrentProjectPath(), data).then(beautifiedData => {
						return beautifiedData;
					}).catch(err => {
						//console.log(this.pluginName, err);
						let details = err;
						if(err instanceof BeautifierError)
							details = err.toString();

						atom.notifications.addError(this.pluginName, {
							detail: details,
							dismissable: true
						});

						return this.beautifier.jsDefault(data);
					});
					/*
					//ou sans catch: (catch est un sucre syntaxique pour rendre le code plus lisible
					//mais aussi pour catcher les rejets des then le précédent (un peu comme try and catch)):
					return this.beautifier.js(this.api.getCurrentProjectPath(), data).then((res) => {
						return res;
					}, (err) => {
						console.log(this.pluginName, err);
					});
					*/
				}
				/*getCodeEdits: (options) => {
					console.log(options, options.editor.getPath(), options.selection, parent.formatDocument);
				}*/
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
			//Pure html = .text.html.basic:
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

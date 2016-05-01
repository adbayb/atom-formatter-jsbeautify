"use babel";

//import * as atom from "atom";
import child_process from "child_process";
import Utility from "./utility.js";
import Beautifier from "./beautifier";

//Point d'entrée de notre plugin Atom. Les fonctions activate(), deactivate() et serialize()
//décrivent le cycle de vie du plugin: cf. http://flight-manual.atom.io/hacking-atom/sections/package-word-count/
//Ecriture du plugin via ES2015 (ES6): cf. http://www.sitepoint.com/write-atom-packages-using-vanilla-javascript/
//Debugging: cf. http://stackoverflow.com/questions/32429076/develop-and-debug-atom-package
//(CTRL+ALT+I pour ouvrir le debugguer Chromium. CTRL+ALT+R pour reload Atom.
//View > Developer pour les options de dev).
//Apis: cf. https://atom.io/docs/api
const FormatterJSBeautify = {
	pluginName: "atom-formatter-jsbeautify",
	utility: null,
	beautifier: null,

	activate(state) {
		//Instanciation de nos classes à l'initialisation de notre module:
		this.utility = new Utility(this.pluginName);
		this.beautifier = new Beautifier();
		//atom est l'objet de type AtomEnvironment: c'est un objetglobal accesible par n'importe quel plugin:
		/*console.log(
			"atom-formatter-jsbeautify", "activate",
			state,
			atom,
			this.beautifier
		);*/
	},
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
		return {
			selector: ".source.js",
			getNewText: (data) => {
				return this.beautifier.js(this.utility.getCurrentProjectPath(), data).then(fulfillData => {
					return fulfillData;
				}).catch(rejectData => {
					console.log(this.pluginName, rejectData);
				});
				/*
				//ou sans catch: (catch est un sucre syntaxique pour rendre le code plus lisible
				//mais aussi pour catcher les rejets des then le précédent (un peu comme try and catch)):
				return this.beautifier.js(this.utility.getCurrentProjectPath(), data).then((res) => {
					return res;
				}, (err) => {
					console.log(this.pluginName, err);
				});
				*/
			}
			/*getCodeEdits: (options) => {
				console.log(options, options.editor.getPath(), options.selection, parent.formatDocument);
			}*/
		};
	}
};

export default FormatterJSBeautify;

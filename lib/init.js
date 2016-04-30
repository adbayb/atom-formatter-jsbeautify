"use babel";

//Point d'entrée de notre plugin Atom. Les fonctions activate(), deactivate() et serialize()
//décrivent le cycle de vie du plugin: cf. http://flight-manual.atom.io/hacking-atom/sections/package-word-count/
//Ecriture du plugin via ES2015 (ES6): cf. http://www.sitepoint.com/write-atom-packages-using-vanilla-javascript/
//Debugging: cf. http://stackoverflow.com/questions/32429076/develop-and-debug-atom-package
//(CTRL+ALT+I pour ouvrir le debugguer Chromium. View > Developer pour les options de dev).
//Apis: cf. https://atom.io/docs/api
const FormatterJSBeautify = {
	activate(state) {
		console.log("atom-formatter-jsbeautify", "activate", state);
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
};

export default FormatterJSBeautify;

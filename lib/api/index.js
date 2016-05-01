"use babel";

export default class Api {
	constructor(pluginName) {
		//console.log("Utility Instanciation");
		this.pluginName = pluginName;
	}

	getCurrentFilePath() {
		//Pour éviter les popups d'exception et les ifs répétitifs,
		//utilisation de try and catch pour capter et gérer
		//les exceptions dans catch:
		try {
			let activeItem = atom.workspace.getActivePaneItem();
			return activeItem.buffer.file.path;
		} catch(e) {
			console.log(this.pluginName, e);
			return null;
		}
	}

	getCurrentProjectPath() {
		//Pour éviter les popups d'exception et les ifs répétitifs,
		//utilisation de try and catch pour capter et gérer
		//les exceptions dans catch:
		try {
			let activeItem = atom.workspace.getActivePaneItem();
			//atom.project.relativizePath() permet de récupérer le project path (root path)
			//ainsi que le relative path pour un fichier donné:
			let [projectPath, relativePath] = atom.project.relativizePath(activeItem.buffer.file.path);
			return projectPath;
		} catch(e) {
			console.log(this.pluginName, e);
			return null;
		}
	}

	getPluginPath() {
		return atom.packages.resolvePackagePath(this.pluginName);
	}
}

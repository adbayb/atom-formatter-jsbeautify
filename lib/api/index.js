"use babel";

export default class Api {
	constructor(pluginName) {
		this.pluginName = pluginName;
	}

	getCurrentFilePath() {
		try {
			let activeItem = atom.workspace.getActivePaneItem();
			return activeItem.buffer.file.path;
		} catch(e) {
			console.log(this.pluginName, e);
			return null;
		}
	}

	getCurrentProjectPath() {
		try {
			let activeItem = atom.workspace.getActivePaneItem();
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

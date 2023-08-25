export function sceneof(pToken) {
	let vscene = pToken.scene;
	
	if (!vscene && pToken.object) {
		vscene = pToken.object.scene;
	}
	
	if (!vscene) {
		//for FVTT v10
		if (canvas.scene.tokens.get(pToken.id)) {
			return canvas.scene;
		}
		else {
			return game.scenes.find(vscene => vscene.tokens.get(pToken.id));
		}
	}
	
	return vscene;
}

export function keysofevent(pEvent) {
	if (pEvent.data.originalEvent) {
		return {altKey : pEvent.data.originalEvent.altKey, ctrlKey : pEvent.data.originalEvent.ctrlKey, shiftKey : pEvent.data.originalEvent.shiftKey};
	}
	else {
		return {altKey : pEvent.altKey, ctrlKey : pEvent.ctrlKey, shiftKey : pEvent.shiftKey};
	}
}

export function Fversion() {
	return Number(game.version.split(".")[0]);
}

export function isv10() {
	return game.version.split(".")[0] == "10";
}

export function isv11() {
	return game.version.split(".")[0] == "11";
}
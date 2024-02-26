var oEditors = [];
var smartEditor;

function init() {
		console.log("Naver SmartEditor");
		nhn.husky.EZCreator.createInIFrame({
			oAppRef: oEditors,
			elPlaceHolder: "editorTxt",
			sSkinURI: "/smarteditor/SmartEditor2Skin.html",
			fCreator: "createSEditor2"
		});
}

$(document).ready(function() {
	init();
});
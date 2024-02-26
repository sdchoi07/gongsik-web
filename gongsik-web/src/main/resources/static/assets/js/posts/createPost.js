var oEditors = [];
var smartEditor;

function init() {

	//	oEditors.getById["bo_content"].exec("UPDATE_CONTENTS_FIELD",[]);
	//에디션 
//	smartEditor();

	//게시글 등록
	savePost();
	
	ClassicEditor.create(document.querySelector('#editor'), {
		language: 'ko',
		extraPlugins: [MyCustomUploadAdapterPlugin]
//		ckfinder: {
//        uploadUrl: '/posts/upload' // 내가 지정한 업로드 url (post로 요청감)
//    }
	}).then(editor => {
		window.editor = editor;
	}).catch(error => {
		console.error(error);
	});
}

//게시글 등록
function savePost() {

}

function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new UploadAdapter(loader)
    }
}
출처: https://dantes.kr/576 [단테스 이야기:티스토리]
//스마트에디션
//function smartEditor() {
//	nhn.husky.EZCreator.createInIFrame({
//		oAppRef: oEditors,
//		elPlaceHolder: "editorTxt",
//		sSkinURI: "/smarteditor/SmartEditor2Skin.html",
//		fCreator: "createSEditor2",
//		htParams: {
//			fOnBeforeUnload: function() {
//				// 업로드 되지 않은 이미지 처리 등을 수행할 수 있습니다.
//			},
//			// 이미지 업로드 핸들러 추가
//			fOnAppLoad: function() {
//				oEditors.getById["editorTxt"].exec("PASTE_HTML", ["<p></p>"]);
//			},
//			fOnImageUpload: function() {
//				// 이미지 업로드 핸들러
//				var formData = new FormData();
//				var inputFile = document.getElementById("inpFile").files[0];
//				formData.append("uploadFile", inputFile);
//
//				$.ajax({
//					url: '/posts/upload',
//					type: "POST",
//					processData: false,
//					contentType: false,
//					data: formData,
//					success: function(sResponse) {
//						var sImageURL = sResponse;
//						oEditors.getById["editorTxt"].exec("PASTE_HTML", ["<img src='" + sImageURL + "'>"]);
//					},
//					error: function(e) {
//						console.log(e);
//					},
//				});
//			},
//		},
//	});
//}

$(document).ready(function() {
	init();
});
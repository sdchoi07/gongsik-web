var oEditors = [];
var smartEditor;
function init() {

	//	oEditors.getById["bo_content"].exec("UPDATE_CONTENTS_FIELD",[]);
	//에디션 
	var postsNo = $('#itemKey').val();
	//게시글 등록
	$("#savePost").on("click", function() {
		savePost();
	});
	if (postsNo > 0) {
		console.log("chk")
		moveModiPage(postsNo);
	} else {
		ClassicEditor.create(document.querySelector('#editor'), {
			language: 'ko',
			extraPlugins: [MyCustomUploadAdapterPlugin]
		}).then(editor => {
			window.editor = editor;
		}).catch(error => {
			console.error(error);
		});
	}
}

var moveModiPage = function(postsNo) {
	var token = localStorage.getItem("accessToken");
	$.ajax({
		url: '/api/posts/postsDetail/' + postsNo,
		type: 'Get',
		headers: {
			'Authorization': 'Bearer ' + token
		},
	}).done(function(data) {
		ClassicEditor.create(document.querySelector('#editor'), {
			language: 'ko',
			extraPlugins: [MyCustomUploadAdapterPlugin]
		}).then(editor => {
			editor.setData(data.result.postsText);
		}).catch(error => {
			console.error(error);
		});

	});
}


//게시글 등록
function savePost() {
	var gubun = $('#selectbox').val();
	if (gubun === '0') {
		alert("게시물을 선택해주세요");
		return;
	}
	var editorData = window.editor.getData();
	var usrId = localStorage.getItem("usrId");
	var token = localStorage.getItem("accessToken");
	var postNm = $('#postNm').val();
	var resultData = {};
	resultData.gubun = gubun;
	resultData.editorData = editorData;
	resultData.usrId = usrId;
	resultData.postNm = postNm;
	$.ajax({
		url: '/api/posts/savePosts',
		type: "POST",
		data: JSON.stringify(resultData),
		contentType: 'application/json',
		headers: {
			'Authorization': 'Bearer ' + token
		},
		success: function(result) {
			console.log(result.code + " code ")
			if (result.code === 'success') {
				alert(result.msg);
				window.location.href = '/posts/sharePost';
			}
		},
		error: function(e) {
			console.log(e);
		},
	});
}

function MyCustomUploadAdapterPlugin(editor) {
	editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
		return new UploadAdapter(loader)
	}
}
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
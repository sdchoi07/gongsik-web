var init = function() {
	// 상품 정보
	_categorieDetail();

	
}

function _categorieDetail(){
	var itemKey = $('#itemKey').val();
	var resultData = {};
	resultData.itemKey = itemKey;
	$.ajax({
		url: '/api/categories/categorieDetail/'+itemKey,
		type: 'GET',
	}).done(function(data) {
		console.log(data.result)
		$('#itemDetail').attr('src', data.result.invenUrl);
		
	}).fail(function(xhr, textStatus, errorThrowna) {
		if (xhr.status === 403) {
			var msg = "로그인 상태에서만 가능합니다.";
			if (confirm(msg)) {
				window.location.href = '/account/login';
			}
		} else if ((xhr.status === 401)) {
			var msg = "로그인 상태에서만 가능합니다.";
			if (confirm(msg)) {
				
			}
		}
	});
}

$(document).ready(function() {
	init();
});

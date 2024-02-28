function init() {

	_selectDetail();
	$('.modiBtn').css('display', 'none');
	$('.delBtn').css('display', 'none');

	$('#modiBtn').on('click', function() {
		moveModiPage();
	})
}

var moveModiPage = function() {
	 window.location.href = '/posts/createPost?postsNo='+$('#itemKey').val();
}

var _selectDetail = function() {
	var itemKey = $('#itemKey').val();
	var cur = new Date();
	cur = cur.toDateString();

	$.ajax({
		url: '/api/posts/postsDetail/' + itemKey,
		type: 'GET',
	}).done(function(data) {
		$('#postsUsrNm').text(data.result.postsUsrNm);

		var postDate = new Date(data.result.postsYMD);
		postDate = postDate.toDateString();
		if (cur === postDate) {
			$('#postsDate').text(data.result.postsTime);
		} else {
			$('#postsDate').text(data.result.postsYMD);
		}
		$('#postsViewCnt').text(" 조회수 " + data.result.postsViewCnt);
		$('.postsDetail').append(data.result.postsText);
		var postsId = data.result.postsUsrId;
		var usrId = localStorage.getItem('usrId');

		if (usrId !== null) {
			if (usrId === postsId) {
				$('#modiBtn').css('display', 'on');
				$('#delBtn').css('display', 'on');
			} else {
				$('#modiBtn').css('display', 'none');
				$('#delBtn').css('display', 'none');
			}
		} else {
			$('#modiBtn').css('display', 'none');
			$('#delBtn').css('display', 'none');
		}
	}).fail(function(xhr, textStatus, errorThrowna) {
	});
}






$(document).ready(function() {
	init();
});
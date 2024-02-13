var init = function () {
	
	_tabMove();
	
}








var _tabMove = function () {
	var targetUrl = $('.nav-link').attr('href');
    $.ajax({
        url: '/mypage' + targetUrl, // 실제로는 해당 URL을 탭에 맞게 수정해야 합니다.
        type: 'GET',
        success: function (data) {
            // 서버로부터 받아온 데이터로 탭 내용 업데이트
            $('.tab-content').html(data);
        },
        error: function () {
            alert('탭 내용을 로드하는 중에 오류가 발생했습니다.');
        }
    });
}



$(document).ready(function () {
    init();
});
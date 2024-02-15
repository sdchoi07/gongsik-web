var init = function () {
	
	
	var firstTabHref = $('.wishNav.active').attr('href');
	 
	_tabWishMove(firstTabHref);
	
    // 탭이 클릭되었을 때의 이벤트 처리
    $('.wishNav').on('click', function(e) {
        e.preventDefault(); // 기본 동작인 페이지 이동을 막음
        var targetUrl = $(this).attr('href'); // 클릭된 탭의 주소를 가져옴
        _tabWishMove(targetUrl);
        // 클릭된 탭에 active 클래스 추가, 다른 탭의 active 클래스 제거
        $('.wishNav').removeClass('active');
        $(this).addClass('active');
    });
	
}








var _tabWishMove = function (targetUrl) {
	console.log("target : " + targetUrl )
    $.ajax({
        url: '/mypage' + targetUrl, // 실제로는 해당 URL을 탭에 맞게 수정해야 합니다.
        type: 'GET',
        success: function (data) {
            // 서버로부터 받아온 데이터로 탭 내용 업데이트
            $('.wish-content').html(data);
        },
        error: function () {
            alert('탭 내용을 로드하는 중에 오류가 발생했습니다.');
        }
    });
}



$(document).ready(function () {
    init();
});
var mypage = function () {
	 var data = localStorage.getItem("data")
	 var result = JSON.parse(data);
	 var usrGrade = result.usrGrade;
	 var usrId = result.usrId;
	  $('#levelNumber').text(usrGrade);
	  $('#usrId').text(usrId);
	 var firstTabHref = $('.list-group-item:first').attr('href');
	 
	   $('.list-group-item:first').trigger('click');
	  	_tabMove(firstTabHref);
    	// 탭이 클릭되었을 때의 이벤트 처리
    	$('.list-group-item').on('click', function (e) {
        e.preventDefault(); // 기본 동작인 페이지 이동을 막음

       var targetUrl = $(this).attr('href'); // 클릭된 탭의 주소를 가져옴

        // AJAX를 사용하여 해당 주소의 내용을 가져와서 .tab-content에 삽입
        _tabMove(targetUrl);
    });
    
  

}

var _tabMove = function (targetUrl) {
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
    mypage();
});

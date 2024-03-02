  // 한 번에 로드되는 항목 수
  var itemsPerPage = 10;

  // 현재 페이지
  var currentPage = 1;
var _init = function () {
	
	//유저정보
	_accountNm();
	
	/* 포인트 조회 */
	_pointList();
	
    // 검색 버튼 클릭 이벤트 핸들러 등록
    $('#searchBtn').on('click', function (event) {
        event.preventDefault();
        currentPage = 1;
        _pointList();
    });
    
}

var _accountNm = function(){
    var token = localStorage.getItem("accessToken");
	var usrId = localStorage.getItem("usrId");
	var logTp = localStorage.getItem("logTp");
	var resultData = {};
	resultData.usrId = usrId;
	resultData.logTp = logTp;
	$.ajax({
		url : "/api/mypage/profile/list",
	    type: 'POST',
        data: JSON.stringify(resultData), // form 데이터를 JSON 문자열로 변환하여 전송
        headers: {
            'Authorization': 'Bearer ' + token
        },
        contentType: 'application/json',
	}).done(function(data){
			
		if(data.code === 'success'){
			var usrData = data.result.usrNm;
			$('#usrNm').text(usrData);
		}else{
			alert(data.msg);
		}
	}).fail(function(xhr, textStatus, errorThrowna) {
       if (xhr.status === 400) {
            // HTTP 상태 코드가 400인 경우 처리
            var errorMessage = xhr.responseJSON.msg; // 혹은 다른 방식으로 오류 메시지 추출
            alert(errorMessage);
        } else {
        }
    });
}

var _pointList = function(){
    var token = localStorage.getItem("accessToken");
	var usrId = localStorage.getItem("usrId");
	var logTp = localStorage.getItem("logTp");
	var resultData = {};
	resultData.usrId = usrId;
	resultData.logTp = logTp;
	resultData.searchDate = $('#searchDate').val();
	resultData.pointSt = $('#pointSt').val();
    resultData.currentPage = currentPage;

	$.ajax({
		url : "/api/mypage/usrPoint/pointList",
	    type: 'POST',
        data: JSON.stringify(resultData), // form 데이터를 JSON 문자열로 변환하여 전송
        headers: {
            'Authorization': 'Bearer ' + token
        },
        contentType: 'application/json',
	}).done(function(data){
			
		if(data.code === 'success'){
			$('#pointTotal').text(data.total)
			_renderUsrPoints(data);
		}else{
			alert(data.msg);
		}
	}).fail(function(xhr, textStatus, errorThrowna) {
       if (xhr.status === 400) {
            // HTTP 상태 코드가 400인 경우 처리
            var errorMessage = xhr.responseJSON.msg; // 혹은 다른 방식으로 오류 메시지 추출
            alert(errorMessage);
        } else {
        }
    });
}

function _renderUsrPoints(usrPoints) {
	console.log("point s: " + usrPoints.result.length)
    // 주소 목록을 담을 컨테이너
    const container = $(".usrPoint");
	container.empty();
    // 주소 목록을 for문으로 동적으로 생성
    if(usrPoints.result.length > 0){
	    for (let i = 0; i < usrPoints.result.length; i++) {
	        const usrPoint = usrPoints.result[i];
	
	        // 주소 목록에 각 아이템 추가
	  const listItem = `
		  <div class="form-group" style="display: flex;">
		    <input id="pointInfoLeft" name="pointInfoLeft" class="form-control" style="background-color: white; flex: 1; " value="${usrPoint.pointStNm} ${usrPoint.pointDt}" readonly="true">
		    <input id="pointInfoRight" name="pointInfoRight" class="form-control" style="background-color: white; flex: 1; text-align: right;" value="${usrPoint.pointPt} 포인트" readonly="true">
		</div>

`;



	        // 주소 목록에 각 아이템 추가
	        container.append(listItem);
	    }
    }else{
		  // 주소 목록에 각 아이템 추가
	        const listItem = `
	           <div class="d-flex align-items-center">
					포인트 내역이 존재 하지 않습니다.
				</div>
	        `;
	         container.append(listItem);
	}

}

 // 스크롤 이벤트 감지
  $(window).scroll(function () {
    // 스크롤이 페이지 하단에 도달하면 추가 항목 로드
    if ($(window).scrollTop() + $(window).height() >= $('html').prop('scrollHeight')-1) {
		currentPage++;
      _pointList();
    }
  });
$(document).ready(function () {
    _init();
});

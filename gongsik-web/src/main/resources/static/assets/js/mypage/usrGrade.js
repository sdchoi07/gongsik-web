var _init = function () {
	
	//유저정보
	_usrGradeSelect();
	
}

var _usrGradeSelect = function(){
	console.log("test :")
    var token = localStorage.getItem("accessToken");
	var usrId = localStorage.getItem("usrId");
	var logTp = localStorage.getItem("logTp");
	var resultData = {};
	resultData.usrId = usrId;
	resultData.logTp = logTp;
	$.ajax({
		url : "/api/mypage/usrGrade/select",
	    type: 'POST',
        data: JSON.stringify(resultData), // form 데이터를 JSON 문자열로 변환하여 전송
        headers: {
            'Authorization': 'Bearer ' + token
        },
        contentType: 'application/json',
	}).done(function(data){
		if(data.code === 'success'){
			var gradeUsrLevel = data.usrGradeDto.gradeLevel;
			console.log(gradeUsrLevel);
			var usrData = data.usrGradeDto.gradeUsrNm;
			$('#gradeUsrNm').text(usrData);
			$('#gradeUsrLevel').text(gradeUsrLevel);
			  for (var i = 1; i <= 5; i++) {
			        var element = $('#level' + i);
			        if (element) {
			            if (parseInt(gradeUsrLevel) === i) {
			                element.find('img').attr('src', '/vendor/third/img/plot.png'); // 보이게 설정
			            } else {
			                element.find('img').attr('src', '/vendor/third/img/plot-empty.png'); // 숨기게 설정
			            }
			        }
			    }
			   var mstDto = data.gradeMst;
			    _renderGrade(mstDto);
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

function _renderGrade(mstDto) {
	console.log("point s: " + mstDto)
    // 주소 목록을 담을 컨테이너
    const container = $(".gradeContainer");
	container.empty();
    // 주소 목록을 for문으로 동적으로 생성
    var listItem ='';
	    for (let i = 0; i < mstDto.length; i++) {
	        const gradeMst = mstDto[i];
			
	        if(i % 2 == 0){
			  listItem += `
				  <ul class="list-group list-group-horizontal gradeLists">
				`;
			}
			listItem += `
						<li class="list-group-item bg-gray-f6 px-4 py-3 flex-grow-1 border p-3 m-1 gradeList">
			                <h5 class="text-sub14 font-w600 mb-2">Level ${gradeMst.gradeLevel}</h5>
			                <p class="text-body13">${gradeMst.gradeDesc}</p>
			            </li>
            			`
			if(i%2!=0){
				listItem+=`</ul>`
			}


	        // 주소 목록에 각 아이템 추가
	    }
	        container.append(listItem);

}


$(document).ready(function () {
    _init();
});




var _findId = function() {
	
	$('#countryPhNo').select2();
	
    //Eamil select 박스
	$('#emailDomainSelect').change(function() {
		var selectedDomain = $(this).val();
		if (selectedDomain === '') {
			$('#domainTxt').css('display', 'inline-block').val("");
			$('#domainTxt').prop('readonly', false);
		} else {
			$('#domainTxt').css('display', 'inline-block').val(selectedDomain);
			$('#domainTxt').prop('readonly', true);
			$('#domainTxt').removeClass('onError');
		}
	});
	
	//아이디 확인
	_emailChk();
	
	
	//국제 번호 조회
	_countryPhList();
	
	//휴대폰 검증및 포맷 변환
	_phoneChk();
	
	//인증번호 요청
	$('#authReq').on('click',function(event){
		event.preventDefault();
		_chkUser();
	});

	//아아디 찾기
	$('#findpwBtn').on('click',function(event){
		 event.preventDefault();
		_findpwBtn();
	})
}

//인증 전 유저 체크
var _chkUser = function(){
	var findIdData = $('#joinForm').serializeObject();
	findIdData.usrId = findIdData.usrEmail + "@" +findIdData.domainTxt;
	$.ajax({
		url : "/api/account/check/email",
	    type: 'POST',
	    data: JSON.stringify(findIdData),
	    contentType: 'application/json'
	}).done(function(data){
		console.log(data)
		console.log(data.msg + " " + data.code);
		if(data.code === 'success'){
			//인증번호 요청
			_authNumReq();
		}else{
			alert(data.msg);
		}
	}).fail(function(xhr, textStatus, errorThrowna) {
       if (xhr.status === 400) {
            // HTTP 상태 코드가 400인 경우 처리
            var errorMessage = xhr.responseJSON.msg; // 혹은 다른 방식으로 오류 메시지 추출
            alert(errorMessage);
            // 혹은 원하는 다른 오류 처리
        } else {
            // 다른 HTTP 상태 코드에 대한 처리
        }
    });
}

//비밀번호 찾기
var _findpwBtn = function(){
	
	var findPwdData = $('#joinForm').serializeObject();
	findPwdData.usrId = findPwdData.usrEmail + "@" +findPwdData.domainTxt;
	findPwdData.usrPhNo= findPwdData.phoneNumber;
	$.ajax({
		url : "/api/account/find/pwd",
	    type: 'POST',
	    data: JSON.stringify(findPwdData),
	    contentType:'application/json',
	}).done(function(data){
		console.log(data)
		console.log(data.object);
		if(data.code === 'success'){
			//이메일 전송 
			_sendEmail(data.object);
		}else{
			alert(data.msg);
		}
	}).fail(function(xhr, textStatus, errorThrowna) {
       if (xhr.status === 400) {
            // HTTP 상태 코드가 400인 경우 처리
            var errorMessage = xhr.responseJSON.msg; // 혹은 다른 방식으로 오류 메시지 추출
            alert(errorMessage);
            // 혹은 원하는 다른 오류 처리
        } else {
            // 다른 HTTP 상태 코드에 대한 처리
        }
    });
}


//이메일 전송
var _sendEmail = function(joinDto){
	
	$.ajax({
		url : "/util/pwdSend",
	    type: 'POST',
	    data: JSON.stringify(joinDto),
	    contentType:'applcation/json',
	}).done(function(data){
		console.log("sendMaile : " + data)
		console.log(data.msg + " " + data.code);
		if(data.code === 'success'){
			alert("해당 아이디 이메일의 이메일을 확인 해주세요.")
		}else{
			alert(data.msg);
		}
	}).fail(function(xhr, textStatus, errorThrowna) {
       if (xhr.status === 400) {
            // HTTP 상태 코드가 400인 경우 처리
            var errorMessage = xhr.responseJSON.msg; // 혹은 다른 방식으로 오류 메시지 추출
            alert(errorMessage);
            // 혹은 원하는 다른 오류 처리
        } else {
            // 다른 HTTP 상태 코드에 대한 처리
        }
    });
}

var _changeChk = function(){
	$('#authNo').on('change', function() {
		var authNo = $("#authNo").val();
		if(authNo !== undefined && authNo !== null && authNo !== ''){
			$("#authNo").removeClass('onError');
		}
		});
}

$(document).ready(function() {
	_findId();
	 
});
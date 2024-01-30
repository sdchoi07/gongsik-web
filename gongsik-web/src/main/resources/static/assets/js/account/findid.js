


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
		_authNumReq();
	});

	//아아디 찾기
	$('#findIdBtn').on('click',function(event){
		 event.preventDefault();
		_findIdBtn();
	})
}



//인증번호 요청
var _findIdBtn = function(){
	
	var findIdData = $('#joinForm').serializeObject();
	var phoneNumber = findIdData.phoneNumber;
	var authNo = findIdData.authNo;
	
	$.ajax({
		url : "/api/account/find/email/"+phoneNumber,
	    type: 'POST',
	    data: {authNo:authNo}
	}).done(function(data){
		console.log(data)
		console.log(data.msg + " " + data.code);
		if(data.resultVo.code == 'success'){
			window.location.href = '/account/foundid?result='+encodeURIComponent(data.findEmail);
			
		}else{
			alert(data.resultVo.msg);
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
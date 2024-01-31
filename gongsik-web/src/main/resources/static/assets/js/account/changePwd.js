var _chagnePwd = function() {
	
	//비밀번호 체크 
	_pwdChk();
	
	//아아디 찾기
	$('#changPwdBtn').on('click',function(event){
		 event.preventDefault();
		_changPwdBtn();
	})
}


//이메일 전송
var _changPwdBtn = function(){
	// 나머지 필드들 검증
	    var inputs = $("#changePwdForm").find('input[type="text"], input[type="password"]');
	    inputs.each(function(index, element) {
	        var inputValue = $(element).val().trim();
	        if (inputValue === '') {
	            $(element).addClass('onError');
	        }
	    });
	    
	    $('#tempPwd').on('change', function() {
		 var tempPwd = $("#tempPwd").val();
	     if(tempPwd !== undefined && tempPwd !== null && tempPwd !== ''){
			 $("#tempPwd").removeClass('onError');
		 }
		});
		
	    var inputsWithError = $("#changePwdForm .onError");

    // 에러가 있는지 확인
    if (inputsWithError.length > 0) {
        chkObj.chk = false;
        return chkObj;
        }
        
     var changePwdData = $('#changePwdForm').serializeObject();
	 var usrId = localStorage.getItem("usrId");
	 var usrNm = localStorage.getItem("usrNm");
	 var logTp = localStorage.getItem("logTp");
	 changePwdData.usrId = usrId;
	 changePwdData.usrNm = usrNm;
	 changePwdData.logTp = logTp;
	$.ajax({
		url : "/api/account/changePwd",
	    type: 'POST',
	    data: JSON.stringify(changePwdData),
	    contentType:'application/json',
	}).done(function(data){
		if(data.code === 'success'){
			localStorage.removeItem("usrId");
			localStorage.removeItem("usrNm");
			localStorage.removeItem("logTp");
			if(confirm(data.msg)){
				console.log("확인");
				window.location.href = '/account/login';
			}
			
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

//비밀번호 입력 체크
var _pwdChk = function() {
	var passwordValue;
	var passwordConfirmValue;

	//비밀번호, 비밀번호 확인 입력시 항시 체크
	$('#password , #passwordConfirm').change(function() {
		var password = $('#password').val();
		// 비밀번호와 비밀번호 확인 값이 정의되어 있는지 확인 후 비교
		// 이전 메시지 삭제
		$('#pswd1Msg').remove();
		
		if(password.length < 8){
			var insertPwdHtml = '<div class="error_text item_style" id="pswd1Msg">! 비밀번호 8자 이상 16 자리 이하로 입력해주세요.</div>';
				$('#password').addClass('onError');
				$('#passwordConfirm').addClass('onError').after(insertPwdHtml);
				return;
		}
		
		if (typeof password !== "undefined" && password !== null && password !== "") { //비밀번호 입력
			passwordValue = password.replace(/[^\x21-\x7E0-9]/g, '');
		}

		var passwordConfirm = $('#passwordConfirm').val();
		if (typeof passwordConfirm !== "undefined" && passwordConfirm !== null && passwordConfirm !== "") { //비밀번호 확인 입력
			passwordConfirmValue = passwordConfirm.replace(/[^\x21-\x7E0-9]/g, '');
		}

		

		if (passwordValue !== undefined && passwordConfirmValue !== undefined) {
			if (passwordValue === passwordConfirmValue) {
				$('#password').removeClass('onError');
				$('#passwordConfirm').removeClass('onError');
			} else {
				var insertPwdHtml = '<div class="error_text item_style" id="pswd1Msg">! 비밀번호가 일치하지 않습니다</div>';
				$('#password').addClass('onError');
				$('#passwordConfirm').addClass('onError').after(insertPwdHtml);
			}
		}

	});
}


$(document).ready(function() {
	_chagnePwd();
	 
});
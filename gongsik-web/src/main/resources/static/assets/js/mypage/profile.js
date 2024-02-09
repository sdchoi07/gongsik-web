
var _init = function () {
	
	
	//유저정보
	_accountListProfile();
	
	//휴대전화 
	_usrPhChk();
	
	//생년월일
	_birthFormat();
	
	//성별
	_sexChkBox();
	
	//인증요청
	$('#reqAuthNo').on('click',function(event){
			 event.preventDefault();
			 _confirmBtn();
	   });
	
	//프로필 수정
	$('#modifyBtn').on('click',function(event){
		event.preventDefault();
		
		var chkObj = {chk :true, code: 0 , msg:""};
		_passwordChk(chkObj);
		if(chkObj.chk === false){
			if(chkObj.code === 1){
				alert(chkObj.msg);
			}else{
				alert(chkObj.msg);
			}
			return;
		}
		_modifyBtn();
	});
	
}

var _accountListProfile = function(){
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
			
			var usrData = data.result;
			console.log("list : " + usrData)
			_profile(usrData);
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



var _profile = function(usrData){
	 var usrId = usrData.usrId;
	 var usrNm = usrData.usrNm;
	 var usrBrith = usrData.usrNo;
	 usrBrith = usrBrith.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1.$2.$3');
	 var usrPhNo = usrData.usrPhone;
	 usrPhNo = usrPhNo.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
	 console.log(usrData);
	 var usrSex = usrData.usrSex;
	 var countryPh = usrData.countryPh;
	  $('#countryPhNo').val(countryPh);
	  $('#usrId').val(usrId);
	  $('#usrNm').val(usrNm);
	  $('#birthDate').val(usrBrith);
	  $('#phoneNumber').val(usrPhNo);
	  if(usrSex === 'M'){
		  $('#genderM').prop('checked',true);
	  }else{
		  $('#genderF').prop('checked',true);
	  }
	
	$('#verificationDiv').css("display", "block");
}

var _usrPhChk = function(){
	 $('#phoneNumber').on('input', function() {
		 	var inputValue = $('#phoneNumber').val();
	        var numbersOnly = inputValue.replace(/[^\d]/g, ''); // 숫자 이외의 문자 제거
	
	      if (inputValue.length === 11 && /^\d+$/.test(numbersOnly)) {
            var formattedDate = numbersOnly.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
            var phoneNo = formattedDate;
            $(this).val(phoneNo); // 변환된 번호를 입력란에 적용
        } else if (inputValue.length > 11 || numbersOnly.length > 11) {
            $(this).val(inputValue.slice(0, 13)); // 11자리까지만 입력되도록 설정
        }
	    });
}

var _confirmBtn =function() {
	var data = $('#modifyForm').serializeObject()
	_authNumReq(data);
	if ($('#verificationDiv').length === 0) {
	    var verificationDiv = $('<div/>', {
	        id: 'verificationDiv',
	        class: 'form-group',
	        html:'<div class="d-flex align-items-center">'+ 
	        	'<img src="/vendor/third/img/plot.png" class ="plot-img">' +
	            '<span style="white-space: nowrap;"  class="spanText">휴대폰 번호</span>' +
	            '</div>'+
	            '<div class="input-group">' +
	            '<input id="authNo" name="authNo" type="authNo" class="form-control">' +
	            '<div class="input-group-append">' +
	            '</div></div></div>'
	    });
    }

    // verificationDiv를 body에 추가
    $('#phAuth').after(verificationDiv);
}

var _passwordChk = function(chkObj){
	   // 비밀번호 검증
	    var password = $('#password').val();
	    if(password !== undefined && password !== null && password !== ''){
			//인증번호 필수 체크
			var authNo = $("#authNo").val();
			if(authNo === undefined || authNo === null || authNo === ''){
				chkObj.chk = false;
				chkObj.code = 1;
				chkObj.msg = "비빌번호 변경시 인증요청 해주세요.";
				return chkObj;
			}
			if(password.length < 8){
				chkObj.chk = false;
				chkObj.code = 2;
				chkObj.msg = "비밀번호 8자 이상 16 자리 이하로 입력해주세요.";
				return;
			}
		}
}

var _modifyBtn = function(){
	var chkObj = {chk :true, code: "" , msg:""};
	_modifyBeforChk(chkObj);
	console.log(chkObj);
	if(chkObj.chk === false){
		if(chkObj.code === "sex"){
			alert(chkObj.msg);
		}else if(chkObj.code === "usrNm"){
			alert(chkObj.msg);
		}else if(chkObj.code === "birthDate"){
			alert(chkObj.msg);
		}
		return;
	}
		
	var modifyData = $('#modifyForm').serializeObject();
	console.log(modifyData);
	var birthDate = modifyData.birthDate.replaceAll(".","");
	var phoneNumber = modifyData.phoneNumber.replaceAll("-","");
	modifyData.birthDate = birthDate;
	modifyData.phoneNumber = phoneNumber;
	$.ajax({
		url : "/api/mypage/profile/modify",
	    type: 'POST',
	    headers: {
            'Authorization': 'Bearer ' + token
        },
        data: JSON.stringify(modifyData), // form 데이터를 JSON 문자열로 변환하여 전송
        contentType: 'application/json',
	}).done(function(data){
		console.log("??: " + data.msg);
		if(data.code === 'success'){
			if(confirm(data.msg)){
				//localStorage.setItem("data", JSON.stringify(data.result));
				location.reload();
			}
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

var _modifyBeforChk = function(chkObj){
	    var maleCheckbox = $("#genderM");
	    var femaleCheckbox = $("#genderF");
	
	    // 성별 체크박스 검증
	    var isMaleChecked = maleCheckbox.is(':checked');
	    var isFemaleChecked = femaleCheckbox.is(':checked');
	
	    if (!isMaleChecked && !isFemaleChecked) {
	       		chkObj.chk = false;
				chkObj.code = "sex";
				chkObj.msg = "성별 체크 해주세요";
				return chkObj;
	    } 
		 var usrNm = $("#usrNm").val();
	     if(usrNm === undefined || usrNm === null || usrNm === ''){
			 	chkObj.chk = false;
				chkObj.code = "usrNm";
				chkObj.msg = "이름을 입력해주세요.";
				return chkObj;
		 }
		 var birthDate = $("#birthDate").val();
		 if(birthDate.length !== 10){
			 chkObj.chk = false;
			 chkObj.code = "birthDate";
			 chkObj.msg = "생년월일 제대로 입력해주세요.";
			 return chkObj;
		 }
		
}







$(document).ready(function () {
    _init();
});

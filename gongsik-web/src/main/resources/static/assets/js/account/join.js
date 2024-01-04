


var _join = function() {
	
	$('#countryPhNo').select2();
	
	var restServer = $("#restServer").val();
    //Eamil select 박스
	$('#emailDomainSelect').change(function() {
		var selectedDomain = $(this).val();
		if (selectedDomain === '') {
			$('#domainTxt').css('display', 'inline-block').val("");
			$('#domainTxt').prop('readonly', false);
		} else {
			$('#domainTxt').css('display', 'inline-block').val(selectedDomain);
			$('#domainTxt').prop('readonly', true);
		}
	});
	
	//아이디 중복체크
	$('#emailChkBtn').on('click', function(event) {
		 event.preventDefault();
		_emailChkBtn();
	})
	
	//비밀번호 확인
	_pwdChk();
	
	//성별 체크
	_sexChkBox();
	
	//자동 날짜 포맷 변환
	_birthFormat();
	
	//국제 번호 조회
	_countryPhList(restServer);
	
	//인증번호 요청
	$('#authReq').on('click',function(event){
		console.log("인증버튼");
		event.preventDefault();
		_authNumReq(restServer);
	});
}

//이메일 중복 확인 체크
var _emailChkBtn = function() {
    //입력한 이메일 값
	var emailValue = $('#email').val() + '@' + $('#domainTxt').val();
	$.ajax({
		url: restServer / api / account / join / emailChkBtn,
		type: 'POST',
		data: { usrId: emailValue },
	}).success(function(data) {
		var insertHtml = '<span>중복체크 완료 하였습니다.</span>'
		$('#idForm').html(insertHtml);

	}).fail(function(data) {
		var insertIdHtml = '<span>이미 가입된 정보 입니다.</span>'
		$('#idForm').html(insertIdHtml);

	});
}

//비밀번호 입력 체크
var _pwdChk = function() {
	var passwordValue;
	var passwordConfirmValue;

	//비밀번호, 비밀번호 확인 입력시 항시 체크
	$('#password , #passwordConfirm').change(function() {
		var password = $('#password').val();

		if (typeof password !== "undefined" && password !== null && password !== "") { //비밀번호 입력
			passwordValue = Number(password.replace(/,/gi, ''));
		}

		var passwordConfirm = $('#passwordConfirm').val();
		if (typeof passwordConfirm !== "undefined" && passwordConfirm !== null && passwordConfirm !== "") { //비밀번호 확인 입력
			passwordConfirmValue = Number(passwordConfirm.replace(/,/gi, ''));
		}

		// 비밀번호와 비밀번호 확인 값이 정의되어 있는지 확인 후 비교
		// 이전 메시지 삭제
		$('#pswd1Msg').remove();

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

//성별체크
var _sexChkBox = function(){
  $('input[type="checkbox"][name="gender"]').click(function(){
	  if($(this).prop('checked')){
	     $('input[type="checkbox"][name="gender"]').prop('checked',false);
	     $(this).prop('checked',true);
	    }
	   });
  
   
}
//생년월일 변환
var _birthFormat = function(){
        $('#birthDate').on('input', function() {
            var inputValue = $(this).val().replaceAll('.','');
            if (inputValue.length === 8) {
                var formattedDate = inputValue.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1.$2.$3');
               		var year = parseInt(inputValue.substr(0, 4));
                    var month = parseInt(inputValue.substr(4, 2));
                    var day = parseInt(inputValue.substr(6, 2));
                    
                    var dateObj = new Date(year, month - 1, day);
                    
                    // 이전 메시지 삭제
					$('#birthDateMsg').remove();
                    if (dateObj.getFullYear() !== year || dateObj.getMonth() + 1 !== month || dateObj.getDate() !== day) {
						var insertHtml = '<div class="error_text item_style" id="birthDateMsg">! 잘못 입력된 날짜입니다.</div>';
						$('#birthDate').addClass('onError').after(insertHtml);
                        $(this).val('');
                    } else {
                        $(this).val(formattedDate);
                        $('#birthDate').removeClass('onError')
                    }
                } 
        });
}

//국제 번호 조회
var _countryPhList = function(){
	$.ajax({
		url: "/api/account/join/countryPhList",
		type: 'GET',
		dataType: 'json'
	}).done(function(data){
		var selectElement = $('#countryPhNo');
		    selectElement.empty(); // 기존의 option을 제거
		
			// "선택하세요" 옵션 추가
		    selectElement.append($('<option>', {
		        value: '', // 이 부분은 빈 값을 가지게 됩니다.
		        text: '선택하세요.' // 원하는 안내 문구를 텍스트로 지정합니다.
		    }));

		    // 받아온 데이터를 가지고 option 추가
		    data.forEach(function(item) {
		        selectElement.append($('<option>', {
		            value: item.countryPh,
		            text: item.countryFullNm
		        }));
		    });
	})
}

//인증번호 요청
var _authNumReq = function(){
	var joinData = $('#joinForm').serializeObject();
	$.ajax({
		url : "/util/sendSMS",
	    type: 'POST',
        data: JSON.stringify(joinData), // form 데이터를 JSON 문자열로 변환하여 전송
        contentType: 'application/json',
	}).done(function(data){
		console.log(data.msg + " "+ data.code);
		alert("인증이 요청 되었습니다.");
	}).fail(function(){
		alert("요청이 잘못 되었습니다.")
	})
}



$(document).ready(function() {
	_join();
	 
});
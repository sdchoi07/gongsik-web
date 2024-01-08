


var _join = function() {
	
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
	_countryPhList();
	
	//휴대폰 검증및 포맷 변환
	_phoneChk();
	
	//인증번호 요청
	$('#authReq').on('click',function(event){
		event.preventDefault();
		_authNumReq();
	});
	
	//회원가입 버튼
	$('#joinBtn').on('click', function(event) {
		 event.preventDefault();
		_joinBtn();
	})
}

//이메일 중복 확인 체크
var _emailChkBtn = function() {
    //입력한 이메일 값
    var usrEmail = $('#usrEmail').val();
    var domainTxt = $('#domainTxt').val();
	var emailValue = usrEmail + '@' + domainTxt;
	
	//한글 검증
	var pattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
	var koreanText = pattern.test(usrEmail);
	//url 특수문자 인코딩
	var usrId = encodeURIComponent(emailValue);
	if(koreanText){
		alert("이메일 형식이 틀렸습니다.")
	}else{
		if(usrEmail !== '' && domainTxt !== '' ){
			$.ajax({
				url: "/api/account/join/emailChk/"+usrId,
				type: 'GET',
			    contentType: 'application/json',
			}).done(function(data) {
					$('#doubleChk').text("")
				if(data.code === 'success' ){
					alert(data.msg);
				}else{
					alert(data.msg);
				}
			}).fail(function(jqXHR, textStatus, errorThrown) {
		        console.error("AJAX request failed: " + textStatus +  errorThrown);
		        alert("오류입니다.")
		    });
	    }else{
			alert("이메일을 입력해 주세요.")
		}
	}
}

//비밀번호 입력 체크
var _pwdChk = function() {
	var passwordValue;
	var passwordConfirmValue;

	//비밀번호, 비밀번호 확인 입력시 항시 체크
	$('#password , #passwordConfirm').change(function() {
		var password = $('#password').val();

		if (typeof password !== "undefined" && password !== null && password !== "") { //비밀번호 입력
			passwordValue = password.replace(/[^\x21-\x7E0-9]/g, '');
		}

		var passwordConfirm = $('#passwordConfirm').val();
		if (typeof passwordConfirm !== "undefined" && passwordConfirm !== null && passwordConfirm !== "") { //비밀번호 확인 입력
			passwordConfirmValue = passwordConfirm.replace(/[^\x21-\x7E0-9]/g, '');
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

//폰 번호 체크 및 변환
var _phoneChk = function(){
        $('#phoneNumber').on('input', function() {
            var inputValue = $(this).val().replaceAll('-', '');
	        var numbersOnly = inputValue.replace(/[^\d]/g, ''); // 숫자 이외의 문자 제거
	
	      if (inputValue.length === 11 && /^\d+$/.test(numbersOnly)) {
            var formattedDate = numbersOnly.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1$2$3');
            var phoneNo = formattedDate;
            $(this).val(phoneNo); // 변환된 번호를 입력란에 적용
        } else if (inputValue.length > 11 || numbersOnly.length > 11) {
            $(this).val(inputValue.slice(0, 11)); // 11자리까지만 입력되도록 설정
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
	console.log(joinData);
	var phoneNumber = joinData.phoneNumber;
	var countryPhNo = joinData.countryPhNo;
	if(countryPhNo === '' || countryPhNo === 'undefined'){
		alert("국제번호 선택 해주세요.");
		return;
	}
	if(phoneNumber === '' || phoneNumber === 'undefined'){
		alert("휴대폰 번호를 입력해 주세요.");
		return;
	}
	if(phoneNumber.length !== 11){
		alert("휴대폰 번호를 제대로 입력해 주세요.");
		return;
	}
	var pattern = /^\d+$/.test(phoneNumber);
	if(!pattern){
		alert("숫자로만 입력해주세요.");
		return;
	}
	
	$.ajax({
		url : "/util/sendSMS",
	    type: 'POST',
        data: JSON.stringify(joinData), // form 데이터를 JSON 문자열로 변환하여 전송
        contentType: 'application/json',
	}).done(function(data){
		console.log(data.msg + " " + data.code);
		if(data.code === 'success'){
			alert(data.msg);
		}else{
			alert(data.msg);
		}
	})
}

//인증번호 요청
var _joinBtn = function(){
	
	var joinData = $('#joinForm').serializeObject();
	console.log(joinData);
	$.ajax({
		url : "/api/account/join/signUp",
	    type: 'POST',
        data: JSON.stringify(joinData), // form 데이터를 JSON 문자열로 변환하여 전송
        contentType: 'application/json',
	}).done(function(data){
		console.log(data.msg + " " + data.code);
		if(data.code === 'success'){
			alert(data.msg);
		}else{
			alert(data.msg);
		}
	}).fail(function(jqXHR, textStatus, errorThrown) {
        console.error("AJAX request failed: " + textStatus +  " " +errorThrown + " " +jqXHR);
        console.log(jqXHR.status);
        console.log(jqXHR.responseText);
        alert("오류입니다.")
    });
}




$(document).ready(function() {
	_join();
	 
});
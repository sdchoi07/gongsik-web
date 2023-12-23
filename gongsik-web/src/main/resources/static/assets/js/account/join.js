var restServer = $("#restServer").val();


var _join = function() {
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
						console.log("1번");
						$('#birthDate').addClass('onError').after(insertHtml);
                        $(this).val('');
                    } else {
						console.log("2번");
                        $(this).val(formattedDate);
                        $('#birthDate').removeClass('onError')
                    }
                } 
        });
}

$(document).ready(function() {
	_join();
});
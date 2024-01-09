


var _login = function(){
	
	$('#loginBtn').on('click', function(event) {
	    event.preventDefault(); // 기본 제출 동작 막기
	
	  var fields = $('#loginForm').find('input'); // 폼 내 모든 input 요소 가져오기
	  var isValid = true;
        fields.each(function(index, field) {
            if (field.type !== 'submit' && field.type !== 'button') {
                // 제출 버튼이 아닌 경우에만 확인
                if ($(field).val() === '') {
                    event.stopPropagation(); // 폼 제출 방지
                    isValid = false; 
                    // 필드가 비어 있을 때 처리 (예: 유효하지 않음을 표시)
                    $(field).addClass('is-invalid');
                }else{
					$(field).removeClass('is-invalid');
				}
                
            }
        });
    	if (!isValid) {
            return false; // 폼 제출 방지
        }
		var usrId = $("#email").val(); // 사용자 이메일 또는 아이디 입력란
		var usrPwd = $("#password").val(); // 비밀번호 입력란
		
		var formData = {
		    usrId: usrId,
		    usrPwd: usrPwd
		};

        $.ajax({
			url: "/api/account/login",
			type: 'POST',
			data: JSON.stringify(formData), // form 데이터를 JSON 문자열로 변환하여 전송
        	contentType: 'application/json',
		}).done(function(data){
			if(data.code === 'success'){
				window.location.href = '/';
			}
		})
			
	  });
  }
  
$(document).ready(function() {
  _login();
});
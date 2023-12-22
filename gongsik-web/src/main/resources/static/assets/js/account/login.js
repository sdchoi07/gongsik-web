


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

        // 로그인 성공 시 폼 제출
        $('#loginForm').submit();
	  });
  }
  
$(document).ready(function() {
  _login();
});
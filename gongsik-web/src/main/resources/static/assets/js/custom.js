$(".nav-item.admin").hide();

//헤더 스크롤 고정
/*var hearFix = function(){
		$(window).scroll(function() {
				var header = $('#header');
				if ($(this).scrollTop() > 0) {
					header.addClass('fixed-header');
				} else {
					header.removeClass('fixed-header');
				}
			});
}*/
//메뉴 조회
function _menuList(usrRole) {
	if (usrRole !== '' || usrRole !== 'undefined') {
		console.log("usrRole : " + usrRole)
		usrRole = localStorage.getItem('usrRole');
	}else{
		usrRole = "";
	}
	
	$.ajax({
		url: "/api/main/menuList/" + usrRole,
		type: "GET",
		contentType: 'application/json',
	}).done(function(data) {

		menus(data);
		sessionStorage.setItem('cachedData', JSON.stringify(data)); // 데이터를 세션 스토리지에 저장


	});
};
// 페이지 이동 시에 데이터를 사용하는 함수
function useCachedData() {
	const cachedData = sessionStorage.getItem('cachedData'); // 세션 스토리지에서 데이터 가져오기

	if (cachedData) {
		// 가져온 데이터를 사용하여 원하는 동작 수행
		// console.log('Data from cache:', JSON.parse(cachedData));
		//var data = JSON.parse(cachedData);
		var data = JSON.parse(cachedData);
		menus(data)
	} else {
		// 캐시된 데이터가 없는 경우 다시 데이터를 가져오고 캐싱

		_menuList();
	}
}

//메뉴 렌더링
function menus(data) {
	//var data = JSON.parse(dataMenu);

	var menuList = $('#menuList');
	// menus를 타임리프 반복문으로 렌더링
	var menuItem = "";
	var boolean = true;
	for (var i = 0; i < data.length; i++) {
		if (i == data.length - 1) {
			menuItem += '</ul>';
			menuItem += '</li>';
			menuItem += `<li class="nav-item"><a class="nav-link" href="${data[i].menuUrl}" id="menuNm">` + data[i].menuNm + '</a></li>';
		} else {
			if (data[i].menuLevelNo == 0) {
				if (!boolean) {
					menuItem += '</ul>';
					menuItem += '</li>';
					boolean = true;
					chk = false;
				}
				menuItem += '<li class="nav-item dropdown">';
				menuItem += `<a class="nav-link dropdown-toggle" href="" role="button" data-bs-toggle="dropdown" aria-expanded="false" id="menuNm">` + data[i].menuNm + '</a>';
				menuItem += '<ul class="dropdown-menu dropdown-menu-end" id="menus" aria-labelledby="navbarDropdown">';
			}
			else if (data[i].menuLevelNo == 1) {
				boolean = false;
				menuItem += `<li><a class="dropdown-item" href="${data[i].menuUrl}?menuItemNo=${data[i].menuItemNo}&menuNm=${data[i].menuNm}" id="menuNm">` + data[i].menuNm + '</a></li>';
			}
		}
	}
	menuList.append(menuItem);
}

//form정보 가져오기
$.fn.serializeObject = function() {
	"use strict"
	var result = {}
	var extend = function(i, element) {
		var node = result[element.name]
		if ("undefined" !== typeof node && node !== null) {
			if ($.isArray(node)) {
				node.push(element.value)
			} else {
				result[element.name] = [node, element.value]
			}
		} else {
			result[element.name] = element.value
		}
	}

	$.each(this.serializeArray(), extend)
	return result
}

var _emailChk = function() {
	$('#usrEmail, #domainTxt').on('change', function() {
		//중복체크 다시
		$("#doubleChk").val('N');
		// 이메일 입력 값
		var usrEmail = $(this).val();
		if (usrEmail === undefined || usrEmail === null || usrEmail === '') {

		} else {
			$('#usrEmail').removeClass('onError');
			$('#domainTxt').removeClass('onError');
		}

		// 여기서부터는 기존의 중복 체크 코드를 넣으면 됩니다.
		// ... (Ajax를 통한 중복 체크 요청 등)
	});

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
	if (koreanText) {
		alert("이메일 형식이 틀렸습니다.")
	} else {
		if (usrEmail !== '' && domainTxt !== '') {
			$.ajax({
				url: "/api/account/join/emailChk/" + usrId,
				type: 'GET',
				contentType: 'application/json',
			}).done(function(data) {
				if (data.code === 'success') {
					$("#doubleChk").val('Y');
					alert(data.msg);
				} else {
					alert(data.msg);
				}
			}).fail(function(jqXHR, textStatus, errorThrown) {
				console.error("AJAX request failed: " + textStatus + errorThrown);
				alert("오류입니다.")
			});
		} else {
			alert("이메일을 입력해 주세요.")
		}
	}
}

//국제 번호 조회
var _countryPhList = function() {

	$.ajax({
		url: "/api/account/join/countryPhList",
		type: 'GET',
		dataType: 'json'
	}).done(function(data) {
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
var _authNumReq = function(form) {
	var formData = form;
	var phoneNumber = formData.phoneNumber.replaceAll("-", "");
	formData.phoneNumber = phoneNumber;
	var countryPhNo = formData.countryPhNo;

	if (countryPhNo === '' || countryPhNo === 'undefined') {
		alert("국제번호 선택 해주세요.");
		return;
	}
	if (phoneNumber === '' || phoneNumber === 'undefined') {
		alert("휴대폰 번호를 입력해 주세요.");
		return;
	}
	if (phoneNumber.length !== 11) {
		alert("휴대폰 번호를 제대로 입력해 주세요.");
		return;
	}
	var pattern = /^\d+$/.test(phoneNumber);
	if (!pattern) {
		alert("숫자로만 입력해주세요.");
		return;
	}

	$.ajax({
		url: "/util/sendSMS",
		type: 'POST',
		data: JSON.stringify(formData), // form 데이터를 JSON 문자열로 변환하여 전송
		contentType: 'application/json',
	}).done(function(data) {
		console.log(data.msg + " " + data.code);
		if (data.code === 'success') {
			console.log(data)
		} else {
			alert(data.msg);
		}
	})
}

//폰 번호 체크 및 변환
var _phoneChk = function() {
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

//생년월일 변환
var _birthFormat = function() {
	$('#birthDate').on('input', function() {
		var inputValue = $(this).val().replaceAll('.', '');
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
			if (formattedDate !== undefined && formattedDate !== null && formattedDate !== '') {
				$('#birthDate').removeClass('onError')
			}
		}
	});
}

//성별체크
var _sexChkBox = function() {
	$('input[type="checkbox"][name="chatChk"]').click(function() {
		if ($(this).prop('checked')) {
			$('input[type="checkbox"][name="chatChk"]').prop('checked', false);
			$('input[type="checkbox"][name="chatChk"]').removeClass('onError');
			$(this).prop('checked', true);
		}
	});
}

function closeModal() {
	$('#delvAdd').modal('hide'); // Bootstrap을 사용하는 경우
}
function openModal(type) {
	$('#addressNm').val('');
	$('#phoneNumber').val('');
	$('#zipCode').val('');
	$('#address').val('');
	$('#addressDetail').val('');
	$('#addressYn').prop('checked', false);
	$('#modalDelvAresSeq').val(0);
	$('#delvAdd').modal("show"); // Bootstrap을 사용하는 경우
	console.log("?? : " + type);
	if (type === 'S') {
		$('#modalTitle').text('새 배송지 추가');
	}
}

var _chatChk = function() {
	$('input[type="checkbox"][name="chatYn"]').click(function() {
		if ($(this).prop('checked')) {
			$('input[type="checkbox"][name="chatYn"]').prop('checked', false);
			$('input[type="checkbox"][name="chatYn"]').removeClass('onError');
			$(this).prop('checked', true);
		}
	});
}

$(document).ready(function() {
	useCachedData();
});
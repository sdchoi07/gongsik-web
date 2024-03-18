var url;
var _main = function() {


	$('#usrBtn').on('click', function(event) {
		event.preventDefault();
		_usrBtn();
	});

	$('#chatting').on('click', function(event) {
		event.preventDefault();
		_chatting();
	});


	var usrId = localStorage.getItem('usrId')
	if (usrId !== null && usrId !== undefined && usrId !== '') {
		$('#loginButton').on('click', function(event) {
			event.preventDefault();
			_logOut()
		});
	}



	_loginInOut();

	var url = window.location.href;
	url = url.split('/').pop();
	if (url === undefined || url === '' || url === null) {
		if (url !== 'mypage') {
			localStorage.removeItem('activeTabId');
		}
	}
	const eventSource = new EventSource("/notification" + "?usrId=" + usrId);

	eventSource.addEventListener("connect", function(event) {
		const commentData = event.data;

		// 받은 댓글 데이터를 이용하여 UI 업데이트
	});

	eventSource.addEventListener("addMessage", function(event) {
		showNotification();

		// 받은 댓글 데이터를 이용하여 UI 업데이트
	});

	chatReadYnLists()
}

function chatReadYnLists() {
	const token = localStorage.getItem('accessToken')
	const usrId = localStorage.getItem('usrId')
	$.ajax({
		url: "/api/chat/chatReadYnLists/" + usrId,
		type: 'GET',
		headers: {
			'Authorization': 'Bearer ' + token
		},
	}).done(function(data) {
		let cnt = data.chatReadYnCnt;
		if (cnt > 0) {
			$('.chattingAlram').show();
		} else {
			$('.chattingAlram').css('display', 'none');
		}
	}).fail(function(xhr, textStatus, errorThrowna) {

	})
}
function showNotification() {
	console.log("될텐데");
	$('.chattingAlram').show();
}

var checkTokenExpiry = function() {
	var accessToken = localStorage.getItem("accessToken");

	if (accessToken) {
		var decodedToken = parseJwt(accessToken);
		var currentTime = Math.floor(Date.now() / 1000); // 현재 시간(초 단위)

		if (decodedToken.exp && decodedToken.exp < currentTime) {
			// 토큰이 만료되었으면 로컬 스토리지에서 제거
			localStorage.removeItem("accessToken");
			localStorage.removeItem("usrId");
			console.log("토큰이 만료되었습니다. 로그아웃 처리 등을 수행할 수 있습니다.");
			var msg = "로그인 다시 해주시길 바랍니다.";
			if (confirm(msg)) {
				window.location.href = "/account/login";
			} else {
				window.location.href = "/";
			}
		}
	}
}

function parseJwt(token) {
	const base64Url = token.split('.')[1];
	const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));

	return JSON.parse(jsonPayload);
}

//인증
var _usrBtn = function() {
	const token = localStorage.getItem('accessToken')
	const test = localStorage.getItem('data')
	$.ajax({
		url: "/api/main/chk",
		type: 'GET',
		headers: {
			'Authorization': 'Bearer ' + token
		},
	}).done(function(data, textStatus, xhr) {
		if (xhr.status === 200) {
			window.location.href = '/mypage';
		} else {
			window.location.href = '/account/login';
			localStorage.removeItem('usrId')
		}
	}).fail(function(xhr, textStatus, errorThrowna) {
		var jsonResponse = JSON.parse(xhr.responseText);
		if (xhr.status === 401) {
			// HTTP 상태 코드가 401(Unauthorized)인 경우
			if (jsonResponse.code === '2') {
				alert(jsonResponse.msg);
				localStorage.removeItem('usrId')
				localStorage.removeItem('accessToken')
				window.location.href = '/account/login'; // 추가적인 처리
			}
			window.location.href = '/account/login'; // 추가적인 처리
			localStorage.removeItem('usrId')
		} else {
			// 다른 HTTP 상태 코드에 대한 처리
		}
	});
}

//채팅
var _chatting = function() {
	const token = localStorage.getItem('accessToken')
	const test = localStorage.getItem('data')
	$.ajax({
		url: "/api/main/chk",
		type: 'GET',
		headers: {
			'Authorization': 'Bearer ' + token
		},
	}).done(function(data, textStatus, xhr) {
		if (xhr.status === 200) {
			window.location.href = '/chat';
		} else {
			window.location.href = '/account/login';
			localStorage.removeItem('usrId')
		}
	}).fail(function(xhr, textStatus, errorThrowna) {
		var jsonResponse = JSON.parse(xhr.responseText);
		if (xhr.status === 401) {
			// HTTP 상태 코드가 401(Unauthorized)인 경우
			if (jsonResponse.code === '2') {
				alert(jsonResponse.msg);
				localStorage.removeItem('usrId')
				localStorage.removeItem('accessToken')
				window.location.href = '/account/login'; // 추가적인 처리
			}
			window.location.href = '/account/login'; // 추가적인 처리
			localStorage.removeItem('usrId')
		} else {
			// 다른 HTTP 상태 코드에 대한 처리
		}
	});
}


//로그인 상태
var _loginInOut = function() {
	const usrId = localStorage.getItem("usrId");
	const loginButton = $('#loginButton');
	if (usrId !== null && usrId !== '' && usrId !== undefined) {
		loginButton.text('로그아웃');
		loginButton.attr('href', '/');
	} else {
		loginButton.text('로그인');
		loginButton.attr('href', '/account/login');
	}



}

function _logOut() {
	const usrId = localStorage.getItem('usrId');
	const data = {};
	data.usrId = usrId;
	$.ajax({
		url: "/api/account/logout",
		type: 'POST',
		data: JSON.stringify(data),
		contentType: 'application/json'
	}).done(function(data, textStatus, xhr) {
		localStorage.removeItem('usrId');
		localStorage.removeItem('accessToken');
		localStorage.removeItem('logTp');
		localStorage.removeItem('usrRole');
		sessionStorage.removeItem('cachedData');
		_menuList();
		window.location.href = '/';
	}).fail(function(xhr, textStatus, errorThrowna) {

	});
}

//탭이동
var _tabList = function(currentUrl) {
	url =  currentUrl.split('/').pop();
	console.log("url : " + url)
	if (url === 'mypage' || url === 'admin') {
		var firstTabHref = $('.list-group-item:first').attr('href');

		// 처음 로딩될 때 activeTabId가 없을 경우에는 첫 번째 탭을 보여줌
		if (!localStorage.getItem('activeTabId')) {
			_tabMove(firstTabHref);
			$('.list-group-item[href="' + firstTabHref + '"]').addClass('active');
			localStorage.setItem('activeTabId', firstTabHref);
		} else {
			// 저장된 탭 ID를 불러와서 해당 탭으로 전환
			var activeTabId = localStorage.getItem('activeTabId');
			_tabMove(activeTabId);
			$('.list-group-item[href="' + activeTabId + '"]').addClass('active');
		}

		// 탭이 클릭되었을 때의 이벤트 처리
		$('.list-group-item').on('click', function(e) {
			e.preventDefault(); // 기본 동작인 페이지 이동을 막음
			var targetUrl = $(this).attr('href'); // 클릭된 탭의 주소를 가져옴
			_tabMove(targetUrl);
			localStorage.setItem('activeTabId', targetUrl);

			// 클릭된 탭에 active 클래스 추가, 다른 탭의 active 클래스 제거
			$('.list-group-item').removeClass('active');
			$(this).addClass('active');
		});
	}

}

//탭 이동
var _tabMove = function(targetUrl) {
	console.log("tabmove : " + url + " targe : " + targetUrl)
	$.ajax({
		url: '/' + url + targetUrl, // 실제로는 해당 URL을 탭에 맞게 수정해야 합니다.
		type: 'GET',
		success: function(data) {
			// 서버로부터 받아온 데이터로 탭 내용 업데이트
			$('.tab-content').html(data);
		},
		error: function() {
			alert('탭 내용을 로드하는 중에 오류가 발생했습니다.');
		}
	});
}

$(document).ready(function() {
	_main();

});
setInterval(checkTokenExpiry, 10 * 1000);
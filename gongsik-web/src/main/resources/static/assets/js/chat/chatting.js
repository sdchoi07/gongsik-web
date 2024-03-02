var stompClient;

var init = function() {


	$(function() {
		$(".heading-compose").click(function() {
			$(".side-two").css({
				"left": "0"
			});
		});

		$(".newMessage-back").click(function() {
			$(".side-two").css({
				"left": "-100%"
			});
		});
	})


	$('.fa-comments').click(function(event) {
		event.preventDefault();
		$('#chatListModal').modal("show");
	});

	$('#exitChat').click(function() {
		_exitChat();
	});

	scrollToBottom();

	_chatList();
	
	const socket = new SockJS('/ws');
	stompClient = Stomp.over(socket);

	// 연결
	stompClient.connect({}, function(frame) {
		console.log('Connected: ' + frame);

		// 메시지 수신 구독 (서버에서 /topic/messages로 메시지를 보낼 때)
		stompClient.subscribe('/topic/messages', function(response) {
			const message = JSON.parse(response.body);
			console.log('Received message: ' + message.content);
		});
	});



}
function _chatList() {
	resultData = {};
	var usrId = localStorage.getItem("usrId");
	var token = localStorage.getItem("accessToken");
	$.ajax({
		url: '/api/chat/chatList/'+usrId,
		type: 'GET',
//		data: JSON.stringify(resultData),
//		contentType: 'application/json',
		headers: {
			'Authorization': 'Bearer ' + token
		},
	}).done(function(data) {
		if (data.code === 'success') {
			_createChatList();
		}
	}).fail(function(xhr, textStatus, errorThrowna) {
	});
}
function sendMessage() {
	const messageInput = $('#message-input').val();

	// 서버로 메시지 전송 (서버에서 /app/send-message로 메시지를 수신할 때)
	stompClient.send('/app/send-message', {}, JSON.stringify({ content: messageInput }));

	// 메시지 전송 후 입력 필드 비우기
	$('#message-input').val('');

	// REST API 호출 함수
	//	function makeRestCall() {
	//		$.ajax({
	//			url: '/api/rest-endpoint', // 실제 REST API 엔드포인트
	//			method: 'GET', // 또는 'POST', 'PUT' 등 HTTP 메소드
	//			contentType: 'application/json',
	//			success: (data) => {
	//				console.log('REST API Response:', data);
	//			},
	//			error: (error) => {
	//				console.error('REST API Error:', error);
	//			}
	//		});
	//	}

	// WebSocket 메시지 수신 이벤트 핸들러
	stompClient.subscribe('/topic/chat', (response) => {
		console.log('WebSocket Message Received:', response.body);
	});
}


function openModal() {
	$('#chatListModal').modal("show");
}

function scrollToBottom() {
	var chatLogElement = $('.chat-log');
	var scrollHeight = chatLogElement.prop('scrollHeight');
	chatLogElement.scrollTop(scrollHeight);
}

function _exitChat() {
	var chatLog = $('.chat-room').addClass('d-flex justify-content-center align-items-center');
	console.log("asdfasdfasdf");
	chatLog.empty();
	chatLog.html('<div class="chat-log__item text-center"><p class="chat-log__message font-weight-bold">안녕하세요 님, 채팅을 시작해보세요.</p></div>');
	chatLog.append('<div class="chat-log__item text-center"><button class="btn btn-dark" onclick="openModal()">채팅 시작하기</button></div>');
}

$(document).ready(function() {
	init();
});

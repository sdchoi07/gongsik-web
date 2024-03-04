var stompClient;
var usrId = localStorage.getItem("usrId");

var chatConGlo;
var textAreaHeight;


var init = function() {
	chatConGlo = $('.chat-container').prop('scrollHeight');
	textAreaHeight = $('#message-input').prop('scrollHeight');
	$('.fa-comments').click(function(event) {
		event.preventDefault();
		$('#chatListModal').modal("show");
	});

	//채팅 나가기
	$('#exitChat').click(function() {
		_exitChat();
	});

	$('#sendMessage').click(function() {
		sendMessage();
	});

	//채팅 위치
	scrollToBottom();

	//채팅목록 조회
	_chatList();

	//소켓 연결
	connect();

	//사이즈 복원
	_textAreaSize();

	//채팅 사이즈 조절();
	messageSize();






function messageSize(){
	$('#message-input').on('keydown', function(e) {

		if (e.shiftKey) {
			if (e.key === 'Enter') {
				// Shift 키나 Enter 키를 뗄 때 높이 다시 계산
				let textArea = $('#message-input');
				let textAreaHei = textArea.prop('scrollHeight');
				textArea.css('height', (textAreaHei + 20) + 'px');

				let chatCon = $('.chat-container');
				let chatConHei = chatCon.prop('scrollHeight');
				chatCon.css('height', (chatConHei) + 'px'); // 스c크롤 높이로 조절
				console.log(this.style.height + " " + chatConHei)
			}

		} else if (e.key === 'Enter') {
			e.preventDefault();
			sendMessage();
		}

		if (e.key === 'Backspace') {
			// 백스페이스 키 눌렀을 때 텍스트 에어리어 높이 조절
			let textarea = $(this);
			let originalHeight = textarea.prop('scrollHeight');

			// 여기에 텍스트 에어리어의 높이를 줄이는 로직 추가
			if (originalHeight > 36) {
				textarea.css('height', (originalHeight - 20) + 'px');
			}
			console.log(originalHeight)
			// 상위 컨테이너의 높이도 조절
			let chatCon = $('.chat-container');
			let chatConHei = chatCon.prop('scrollHeight');
			chatCon.css('height', (chatConHei - 20) + 'px');
		}
	});

}

}
function _textAreaSize() {
	// 여기에 텍스트 에어리어의 높이를 초기 높이로 설정하는 로직 추가
	$('.chat-container').css('height', chatConGlo + 'px');

	// 상위 컨테이너의 높이도 조절
	$('#message-input').css('height', textAreaHeight + 'px');
	$('#message-input').val(''); // 텍스트 에어리어의 내용을 비움
}
function connect() {
	const socket = new SockJS('/ws');
	stompClient = Stomp.over(socket);

	// 연결
	stompClient.connect({}, function(frame) {
		console.log('Connected: ' + frame);

		// 메시지 수신 구독 (서버에서 /topic/messages로 메시지를 보낼 때)
		stompClient.subscribe('/topic/chat', function(messageOutput) {
			console.log('write: ' + messageOutput.body);
			showMessage(JSON.parse(messageOutput.body));
		});
		
		stompClient.subscribe('/subscribe/notice', function(messageOutput) {
			console.log('write: ' + messageOutput.body);
			showMessage(JSON.parse(messageOutput.body));
		});
	});
}

function showMessage(message) {
	_textAreaSize();
	//	let chatLog = $(`<a onclick="joinChatRoom(${message.chatRoomNo})" style="width:100%">`);
	let chatLog = $(".chat-log");
	let row = "";
	if (message.sender == usrId) {
		row +=
			`<div class="chat-log__item chat-log__item--own">
                            <h3 class="chat-log__author">${message.sender} <small>${message.curTime}</small></h3>
                            <div class="chat-log__message">${message.message}</div>
                         </div>`;
	} else {
		row +=
			`<div class="chat-log__item mt-4">
                           <h3 class="chat-log__author">${message.sender} <small>${message.curTime}</small></h3>
                            <div class="chat-log__message">${message.message}</div>
                         </div>`;
	}
	chatLog.append(row)

	$('.chat-log').scrollTop($('.chat-log').prop('scrollHeight'));

}
function _chatList() {
	resultData = {};
	var usrId = localStorage.getItem("usrId");
	var token = localStorage.getItem("accessToken");
	$.ajax({
		url: '/api/chat/chatList/' + usrId,
		type: 'GET',
		//		data: JSON.stringify(resultData),
		//		contentType: 'application/json',
		headers: {
			'Authorization': 'Bearer ' + token
		},
	}).done(function(data) {
		_createChatList(data);
	}).fail(function(xhr, textStatus, errorThrowna) {
	});
}

//채팅 목록 조회
function _createChatList(data) {

	console.log(data.cnt)
	if (data.cnt === 0) {
		return;
	}

	var chatListGroup = $("#chat-list-group");
	//    var orderTrList = $(".orderTrList");
	// 기존에 있는 내용 비우기
	chatListGroup.empty();

	//날짜비교
	var cur = new Date();
	cur = cur.toDateString();



	var list = data.result;

	// 데이터를 기반으로 동적으로 테이블 생성
	list.forEach(chatList => {
		// chatYMD 속성을 올바르게 참조하기 위한 수정
		var chatDate = new Date(chatList.chatYMD); // `list.chatYMD`를 `chatList.chatYMD`로 변경
		chatDate = chatDate.toDateString();

		var chatContent = chatList.chatRoomText;
		if (chatList.chatRoomText !== null) {
			var chatLen = chatList.chatRoomText.length;

			if (chatLen > 19) {
				chatContent = chatContent.substring(0, 20) + '...';
			}
		} else {
			chatContent = "";
		}

		// `currentDate`와 `chatDate` 비교 로직 수정
		const dateToShow = (cur === chatDate) ? chatList.chatTime : chatList.chatYMD;

		const row = $("<li>").addClass("list-group-item d-flex justify-content-between align-items-center list-item");

		// `dateToShow` 변수를 사용하여 날짜/시간 표시
		// 템플릿 리터럴 내 변수 참조 수정
		row.append(`<a onclick="joinChatRoom(${chatList.chatRoomNo})" style="width:100%">
                    <div>
                        <div>
                            <span>${chatList.chatInvUsrNm}</span>
                            <span>${dateToShow}</span>
                        </div>

                        <span class="text-left">${chatContent}</span>
                    </div>
                </a>
                <div class="ellipsis-container">
                    <i class="fas fa-ellipsis-v ellipsis-icon dropdown-toggle" role="button"
                        data-bs-toggle="dropdown" aria-expanded="false"></i>
                    <div class="dropdown-menu dropdown-menu-end" id="delChatRoom"
                        aria-labelledby="navbarDropdown">
                        <a href="#">채팅방 나가기</a>
                    </div>
                </div>`);

		// 가정: chatListGroup이 미리 정의된 jQuery 객체
		chatListGroup.append(row);

	});
}

//채팅방 열기
function joinChatRoom(chatRoomNo) {
	_textAreaSize(chatConGlo, textAreaHeight);
	resultData = {};
	var usrId = localStorage.getItem("usrId");
	var token = localStorage.getItem("accessToken");
	resultData.chatRoomNo = chatRoomNo;
	resultData.usrId = usrId;
	$.ajax({
		url: '/api/chat/chatTextList',
		type: 'POST',
		data: JSON.stringify(resultData),
		contentType: 'application/json',
		headers: {
			'Authorization': 'Bearer ' + token
		},
	}).done(function(data) {
		if (data.code === 'success') {
			_createChatTextList(data);
		} else {
			var chatLog = $('.chat-log').addClass('d-flex justify-content-center align-items-center');
			chatLog.empty();
			chatLog.html(`<div class="chat-log__item text-center"><p class="chat-log__message font-weight-bold">${data.msg}</p></div>`);
		}
	}).fail(function(xhr, textStatus, errorThrowna) {
	});
}

function _createChatTextList(data) {

	var chatLog = $(".chat-log");
	// 기존에 있는 내용 비우기
	chatLog.empty();

	//날짜비교
	var cur = new Date();
	cur = cur.toDateString();



	var list = data.result;
	var usrNm = data.usrNm;
	var chatRoomNo = 0;

	// 데이터를 기반으로 동적으로 테이블 생성
	list.forEach(chatTextList => {
		chatRoomNo = chatTextList.chatRoomNo;
		// chatYMD 속성을 올바르게 참조하기 위한 수정
		var chatDate = new Date(chatTextList.chatYMD); // `list.chatYMD`를 `chatList.chatYMD`로 변경
		chatDate = chatDate.toDateString();

		// `currentDate`와 `chatDate` 비교 로직 수정
		const chatTime = (cur === chatDate) ? chatTextList.chatTime : chatTextList.chatYMD;

		var sender = chatTextList.chatRoomSender

		if (sender === usrNm) {
			// Correctly create and append row for the sender
			let row = $(`<div class="chat-log__item chat-log__item--own">
                            <h3 class="chat-log__author">${sender} <small>${chatTime}</small></h3>
                            <div class="chat-log__message">${chatTextList.chatRoomText}</div>
                         </div>`);
			chatLog.append(row);
		} else {
			// Correctly create and append row for the receiver
			let row = $(`<div class="chat-log__item mt-4">
                            <h3 class="chat-log__author">${chatTextList.chatRoomReceiver} <small>${chatTime}</small></h3>
                            <div class="chat-log__message">${chatTextList.chatRoomText}</div>
                         </div>`);
			chatLog.append(row);
		}

	});
	var row = $(`<input type="hidden" value="${chatRoomNo}" id="chatRoomNo">`)
	chatLog.append(row);
}

function sendMessage() {
	let messageInput = $('#message-input').val();
	const usrId = localStorage.getItem('usrId');
	let chatRoomNo = $('#chatRoomNo').val();
	messageInput = messageInput.replaceAll(/(\n|\r\n)/g, "<br>");
	console.log("asdfasdfasdfsa :   " + messageInput)
	// 서버로 메시지 전송 (서버에서 /app/send-message로 메시지를 수신할 때)
	stompClient.send('/app/send-message', {}, JSON.stringify({
		'sender': usrId,
		'message': messageInput,
		'chatRoomNo': chatRoomNo
	}));

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

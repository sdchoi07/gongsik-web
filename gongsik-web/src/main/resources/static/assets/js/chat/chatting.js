var stompClient;
var usrId = localStorage.getItem("usrId");
var pagingDay = 0;
var chatConGlo;
var textAreaHeight;
var scrollTimeout;
var chkScroll = true;


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

	//사이즈 복원
	_textAreaSize();

	//채팅 사이즈 조절();
	messageSize();

	//해당 유저 정보 조회
	_accountList();


}
var _accountList = function() {

	var usrId = localStorage.getItem("usrId");
	var logTp = localStorage.getItem("logTp");
	var token = localStorage.getItem("accessToken");
	var resultData = {};
	resultData.usrId = usrId;
	resultData.logTp = logTp;
	$.ajax({
		url: "/api/mypage/profile/list",
		type: 'POST',
		data: JSON.stringify(resultData), // form 데이터를 JSON 문자열로 변환하여 전송
		headers: {
			'Authorization': 'Bearer ' + token
		},
		contentType: 'application/json',
	}).done(function(data) {

		if (data.code === 'success') {
			var usrNm = data.result.usrNm;
			$('#accountUsrNm').val(usrNm);
			$('#usrNm').text(usrNm);

		} else {
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


function messageSize() {
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
			// 상위 컨테이너의 높이도 조절
			let chatCon = $('.chat-container');
			let chatConHei = chatCon.prop('scrollHeight');
			chatCon.css('height', (chatConHei - 20) + 'px');
		}
	});

}

function _textAreaSize() {
	// 여기에 텍스트 에어리어의 높이를 초기 높이로 설정하는 로직 추가
	$('.chat-container').css('height', chatConGlo + 'px');

	// 상위 컨테이너의 높이도 조절
	$('#message-input').css('height', textAreaHeight + 'px');
	$('#message-input').val(''); // 텍스트 에어리어의 내용을 비움
}
function connect(chatRoomNo) {
	const socket = new SockJS('/ws');
	stompClient = Stomp.over(socket);

	// 연결
	stompClient.connect({}, function(frame) {
		console.log('Connected: ' + frame);

		// 메시지 수신 구독 (서버에서 /topic/messages로 메시지를 보낼 때)
		stompClient.subscribe('/topic/chat/' + chatRoomNo, function(messageOutput) {
			showMessage(JSON.parse(messageOutput.body));
		});

	});
}

function showMessage(message) {
	_textAreaSize();
	let chatLog = $(".chat-log");
	let row = "";
	let usrNm = $('#accountUsrNm').val();
	if (message.sender == usrNm) {
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
		const chatWithPer = (chatList.usrNm === chatList.chatCrtUsrNm) ? chatList.chatInvUsrNm : chatList.chatCrtUsrNm;
		const row = $("<li>").addClass("list-group-item d-flex justify-content-between align-items-center list-item");

		// `dateToShow` 변수를 사용하여 날짜/시간 표시
		// 템플릿 리터럴 내 변수 참조 수정
		row.append(`<a onclick="joinChatRoom(${chatList.chatRoomNo}, 1)" style="width:100%">
                    <div>
                        <div>
                            <span>${chatWithPer}</span>
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
		row.append(`<input type="hidden" value="${chatWithPer}" id="reciverUsrNm">`)
		chatListGroup.append(row);

	});
}

//채팅방 열기
function joinChatRoom(chatRoomNo, num) {
	if (chatRoomNo == 0) {
		let usrNm = $('#accountUsrNm').val();
		let usrId = localStorage.getItem("usrId");
		let type = "ENTER";
		stompClient.send('/app/send-message', {}, JSON.stringify({
			'usrId': usrId,
			'usrNm': usrNm,
			'type' : type
		}));
		return;
	}
	if (num === 1) {
		chkScroll = true;
	}
	_textAreaSize(chatConGlo, textAreaHeight);
	resultData = {};
	var usrId = localStorage.getItem("usrId");
	var token = localStorage.getItem("accessToken");
	resultData.chatRoomNo = chatRoomNo;
	resultData.usrId = usrId;
	resultData.pagingDay = pagingDay;
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
		} else if (data.code === 'stop') {

		} else {
			var chatLog = $('.chat-log').addClass('d-flex justify-content-center align-items-center');
			chatLog.empty();
			chatLog.html(`<div class="chat-log__item text-center"><p class="chat-log__message font-weight-bold">${data.msg}</p></div>`);
		}
	}).fail(function(xhr, textStatus, errorThrowna) {
	});
}

function _createChatTextList(data) {
	var usrNm = data.usrNm;
	console.log(data.withUsrNm)
	var chatLog = $('.chat-room').removeClass('d-flex justify-content-center align-items-center');
	chatLog.empty();
	var basicRow = (`	<div class="card-header">
						<i class="fas fa-arrow-left mr-1" id="exitChat" onclick="_exitChat()"></i> ${data.withUsrNm}
					</div>

					<div class="chat-log">

					</div>
					<div class="card-footer">
						<div class="input-group">
							<textarea type="text" class="form-control" placeholder="메시지를 입력하세요..."
								id="message-input"></textarea>
							<button class="btn btn-primary" onclick="sendMessage()">보내기</button>
						</div>
					</div>`);
	chatLog.append(basicRow);
	var chatLog = $(".chat-log");

	var cur = new Date();
	cur = cur.toDateString();


	var list = data.result;
	var chatRoomNo = 0;
	var compChatYMD = "";
	// 데이터를 기반으로 동적으로 테이블 생성
	list.forEach(chatTextList => {
		var reocrdDt = chatTextList.chatYMD.replace(/\./g, ""); // 모든 '.' 문자를 제거
		var yyyy = reocrdDt.substring(0, 4);
		var mm = reocrdDt.substring(4, 6);
		var dd = reocrdDt.substring(6, 8);
		var chatRecordDt = (`<div class="chat-log-date text-center mt-4">
                            <h5 class="chat-log-date">${yyyy}년 ${mm}월 ${dd}일 </h5>
                        </div>`);
		if (compChatYMD !== chatTextList.chatYMD) {
			chatLog.append(chatRecordDt);
			compChatYMD = chatTextList.chatYMD;
		}
		chatRoomNo = chatTextList.chatRoomNo;
		// chatYMD 속성을 올바르게 참조하기 위한 수정
		var chatDate = new Date(chatTextList.chatYMD); // `list.chatYMD`를 `chatList.chatYMD`로 변경
		chatDate = chatDate.toDateString();

		// `currentDate`와 `chatDate` 비교 로직 수정
		const chatTime = (cur === chatDate) ? chatTextList.chatTime : chatTextList.chatYMD;

		let sender = chatTextList.chatRoomSender
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
                            <h3 class="chat-log__author">${sender} <small>${chatTime}</small></h3>
                            <div class="chat-log__message">${chatTextList.chatRoomText}</div>
                         </div>`);
			chatLog.append(row);
		}

	});
	var row = $(`<input type="hidden" value="${chatRoomNo}" id="chatRoomNo">`)
	chatLog.append(row);
	if (chkScroll) {
		scrollToBottom();
	}
	//소켓 연결
	connect(chatRoomNo);

	$('.chat-log').scroll(function() {
		console.log("chk : " + $('.chat-log').scrollTop());
		// 이전에 등록된 타임아웃이 있다면 취소
		clearTimeout(scrollTimeout);

		// 스크롤 이벤트 발생 후 설정한 초에서  코드 실행
		scrollTimeout = setTimeout(function() {
			var chatLog = $('.chat-log');
			var scrollTop = chatLog.scrollTop();
			console.log("chk : " + scrollTop);
			// 스크롤이 페이지 하단에 도달하면 추가 항목 로드
			if (scrollTop <= 0) {  // 위로 스크롤할 때
				pagingDay++;
				chkScroll = false;
				// 추가 항목 로드 함수 호출 또는 필요한 동작 수행
				// 예: loadMoreItems();
				joinChatRoom(chatRoomNo);
			}
		}, 600);
	});
}

function sendMessage() {
	let messageInput = $('#message-input').val();
	let sender = $('#accountUsrNm').val();
	let reciver = $('#reciverUsrNm').val();
	let chatRoomNo = $('#chatRoomNo').val();
	let type = "TALK";
	messageInput = messageInput.replaceAll(/(\n|\r\n)/g, "<br>");
	// 서버로 메시지 전송 (서버에서 /app/send-message로 메시지를 수신할 때)
	stompClient.send('/app/send-message', {}, JSON.stringify({
		'sender': sender,
		'reciver': reciver,
		'message': messageInput,
		'chatRoomNo': chatRoomNo,
		'type' : type
	}));

	// 메시지 전송 후 입력 필드 비우기
	$('#message-input').val('');


	// WebSocket 메시지 수신 이벤트 핸들러
}


function openModal() {
	$('#chatListModal').modal("show");
	accountLists();
}

function accountLists() {

	var token = localStorage.getItem("accessToken");
	$.ajax({
		url: "/api/chat/accountLists",
		type: 'GET',
		headers: {
			'Authorization': 'Bearer ' + token
		},
	}).done(function(data) {

		if (data.code === 'success') {
			_usrLists(data);
		} else {
			let usrList = $('.usr-lists');
			usrList.empty();
			usrList.html(`<div class="chat-log__item text-center"><p class="chat-log__message font-weight-bold">${data.msg}</p></div>`);
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

function _usrLists(data) {
	let usrList = $('.usr-lists');
	usrList.empty();
	let lists = data.result;
	lists.forEach(list => {
		usrList.append(`<li class="list-group-item d-flex justify-content-between align-items-center"><span id="invUsrNm" style="font-size:1.5rem;">${list.usrNm}</span>
						<button type="button" class="btn btn-link border-0 fw-bold ml-2" onclick="joinChatRoom(0,1)" style="color: #000000; font-family: \'Noto Sans KR\', sans-serif; text-decoration: none; font-size: 0.8rem;">채팅 시작</button>
						</li>`);
	});

}

function scrollToBottom() {
	var chatLogElement = $('.chat-log');
	var scrollHeight = chatLogElement.prop('scrollHeight');
	chatLogElement.scrollTop(scrollHeight);
}

function _exitChat() {
	pagingDay = 0;
	let usrNm = $('#accountUsrNm').val();
	var chatLog = $('.chat-room').addClass('d-flex justify-content-center align-items-center');
	console.log("취소 : " + chatLog.html())
	chatLog.empty();
	chatLog.html(`<div class="chat-log__item text-center"><p class="chat-log__message font-weight-bold">안녕하세요 ${usrNm}님, 채팅을 시작해보세요.</p></div>`);
	chatLog.append('<div class="chat-log__item text-center"><button class="btn btn-dark" onclick="openModal()">채팅 시작하기</button></div>');
}




$(document).ready(function() {
	init();
});

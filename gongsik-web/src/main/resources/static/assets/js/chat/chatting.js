var stompClient;
var usrId = localStorage.getItem("usrId");
var currentPage = 1;
var chatConGlo;
var textAreaHeight;
var scrollTimeout;
var chkScroll = true;
var currentChatRoomNo = null;
var globalChatRoomNo = 0;
var socket;
var globalType;
var readCnt = 0;
var globalChatRoomTextNo = 0;

var init = function() {
	// 소켓 연동;
	//	connect();
	$('#chattingAlram').css("display", "none");
	chatConGlo = $('.chat-container').prop('scrollHeight');
	textAreaHeight = $('#message-input').prop('scrollHeight');
	$('.fa-comments').click(function(event) {
		event.preventDefault();
		$('#chatListModal').modal("show");
	});

	//채팅 나가기
	$('#exitChat').click(function() {
		currentChatRoomNo = null;
		_exitChat();
	});

	$('#sendMessage').click(function() {
		sendMessage();
	});

	$(document).on('click', 'a[id^="joinChat"]', function(event) {
		event.preventDefault();
		var clickedChatRoomNo = $(this).data('chatRoomNo');

		//		if (currentChatRoomNo !== clickedChatRoomNo) {
		currentChatRoomNo = clickedChatRoomNo;

		joinChatRoom(currentChatRoomNo, 1);
		//			$('#joinChat' + currentChatRoomNo).trigger('click');

		//		}
	});
	//채팅 위치
	scrollToBottom();

	//사이즈 복원
	_textAreaSize();

	//채팅 사이즈 조절();
	messageSize();

	//해당 유저 정보 조회
	_accountList();

	//기본 스크롤
	_scroll();


	listConnect();

	var eventSource = new EventSource("/");

	// SSE 종료
	eventSource.close();


}

function listConnect() {
	socket = new SockJS('/ws');
	stompClient = Stomp.over(socket);
	// 연결
	stompClient.connect({}, function(frame) {
		_chatList();

	});
	stompClient.debug = false;

}
function _scroll() {
	$('.chat-log').scroll(function() {
		// 이전에 등록된 타임아웃이 있다면 취소
		clearTimeout(scrollTimeout);

		// 스크롤 이벤트 발생 후 설정한 초에서  코드 실행
		scrollTimeout = setTimeout(function() {
			var chatLog = $('.chat-log');
			var scrollTop = chatLog.scrollTop();
			// 스크롤이 페이지 하단에 도달하면 추가 항목 로드
			if (scrollTop <= 0) {  // 위로 스크롤할 때
				currentPage++;
				chkScroll = false;
				// 추가 항목 로드 함수 호출 또는 필요한 동작 수행
				// 예: loadMoreItems();cccccccc
				joinChatRoom(globalChatRoomNo, '', "scroll");
			}
		}, 200);
	});
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

				let chatCon = $('.chat-container');
				let chatConHei = chatCon.prop('scrollHeight');

				let limit = $('.container').prop('scrollHeight') + 200;

				if (limit > textAreaHei && limit > chatConHei) {
					console.log("높이 확인 : " + limit + " " + textAreaHei + " " + chatConHei);
					chatCon.css('height', (chatConHei) + 'px'); // 스c크롤 높이로 조절
					textArea.css('height', (textAreaHei + 20) + 'px');

				} else {
					return;
				}

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

//}

//function _chatReadYnUpdate(chatRoomNo, sender, usrNm) {
//	var token = localStorage.getItem("accessToken");
//	var resultData = {};
//	resultData.chatRoomNo = chatRoomNo;
//	resultData.readYn = "Y";
//	resultData.sender = sender;
//	resultData.usrNm = usrNm;
//	$.ajax({
//		url: "/api/chat/chatReadUpdate",
//		type: 'POST',
//		data: JSON.stringify(resultData), // form 데이터를 JSON 문자열로 변환하여 전송
//		headers: {
//			'Authorization': 'Bearer ' + token
//		},
//		contentType: 'application/json',
//	}).done(function(data) {
//	}).fail(function(xhr, textStatus, errorThrowna) {
//		if (xhr.status === 400) {
//			// HTTP 상태 코드가 400인 경우 처리
//			var errorMessage = xhr.responseJSON.msg; // 혹은 다른 방식으로 오류 메시지 추출
//			alert(errorMessage);
//		} else {
//		}
//	});
//}

function showMessage(message) {
	_textAreaSize();
	if (message.type === 'ENTER') {
		if (message.readYn === 'Y') {
			$(`.itemOwn${message.chatRoomNo}`).hide();
			return;
		}
		return;
	}
	let chatLog = $(".chat-log");
	let row = "";
	let usrNm = $('#accountUsrNm').val();
	let readYnChl = (message.readYn === 'N') ? `<div class="chat-log__readChk itemOwn${message.chatRoomNo}">1</div>` : ``;
	if (globalChatRoomNo === message.chatRoomNo) { //채팅방 들어왔을때 서로 채팅 실시간 채팅 됨
		//		_chatReadYnUpdate(message.chatRoomNo);

		$(`#chatDate${globalChatRoomNo}`).text(message.curTime);
		if (message.message.length > 19) {
			$(`#chatContent${globalChatRoomNo}`).text(message.message.substring(0, 20) + '...');
		} else {
			$(`#chatContent${globalChatRoomNo}`).text(message.message);
		}
		if (message.sender == usrNm) {
			$(`#chatWithper${globalChatRoomNo}`).text(message.sender)
			row +=
				`<div class="chat-log__item chat-log__item--own">
							${readYnChl}
                            <h3 class="chat-log__author">${message.sender} <small>${message.curTime}</small></h3>
                            <div class="chat-log__message">${message.message}</div>
                            
                         </div>`;
		} else {
			$(`#chatWithper${globalChatRoomNo}`).text(message.sender)
			row +=
				`<div class="chat-log__item mt-4">
                           <h3 class="chat-log__author">${message.sender} <small>${message.curTime}</small></h3>
                            <div class="chat-log__message">${message.message}</div>
                         </div>`;
		}
		chatLog.append(row)
	}
	$('.chat-log').scrollTop($('.chat-log').prop('scrollHeight'));


}
function _chatList() {

	resultData = {};
	var usrId = localStorage.getItem("usrId");
	var token = localStorage.getItem("accessToken");
	$.ajax({
		url: '/api/chat/chatList/' + usrId,
		type: 'GET',
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
		const row = $("<li>").addClass("list-group-item d-flex justify-content-between align-items-center list-item").attr("id", `listChatRoom${chatList.chatRoomNo}`);
		let readChkCnt = chatList.chatRoomReadChkNo;


		// `dateToShow` 변수를 사용하여 날짜/시간 표시
		// 템플릿 리터럴 내 변수 참조 수정
		row.append(`<a id="joinChat${chatList.chatRoomNo}" data-chat-room-no="${chatList.chatRoomNo}" style="width:100%">
                    <div>
                        <div>
                            <span id="chatWithPer${chatList.chatRoomNo}">${chatWithPer}</span>
                            <span id="chatDate${chatList.chatRoomNo}">${dateToShow}</span>
                        </div>
                        <span class="text-left" id="chatContent${chatList.chatRoomNo}">${chatContent}</span>
                    </div>
                </a>	
        		 ${readChkCnt > 0 ? `
			    <div id="readChk${chatList.chatRoomNo}" style="margin-top:28px;">
			      <span id="chatRoomReadChkNo" style="margin-right: 50px; position: relative;">
				  <i class="fa fa-circle" style="color: rgba(245, 39, 39, 1); font-size: 25px;"></i>
				  <span id="readCnt${chatList.chatRoomNo}" style="position: absolute; top: 18%;  color: white; font-size: 15px;">${chatList.chatRoomReadChkNo}</span>
				</span>

			    </div>` : ` <div id="readChk${chatList.chatRoomNo}" style="margin-top:28px;">
			      <span id="chatRoomReadChkNo" style="margin-right: 50px; position: relative;">
			        <i class="fa fa-circle" style="color: rgba(245, 39, 39, 1); font-size: 25px; display:none"></i>
			        <span id="readCnt${chatList.chatRoomNo}" style="position: absolute; top: 18%;  transform: translate(95%, -50%); color: white; font-size: 15px;"></span>
			      </span>
			    </div>`}
                <div class="ellipsis-container">
                    <i class="fas fa-ellipsis-v ellipsis-icon dropdown-toggle" role="button"
                        data-bs-toggle="dropdown" aria-expanded="false"></i>
                    <div class="dropdown-menu dropdown-menu-end" id="delChatRoom"
                        aria-labelledby="navbarDropdown">
                        <a href="#" onclick="delChatRoom('${chatList.chatRoomNo}')">채팅방 나가기</a>
                    </div>
                </div>`);

		// 가정: chatListGroup이 미리 정의된 jQuery 객체
		row.append(`<input type="hidden" value="${chatWithPer}" id="reciverUsrNm${chatList.chatRoomNo}">`)
		row.append(`<input type="hidden" value="${chatList.chatRoomNo}" id="chatRoomNo">`);

		chatListGroup.append(row);

		stompClient.subscribe(`/topic/chat/` + chatList.chatRoomNo, function(messageOutput) {
			showMessage(JSON.parse(messageOutput.body));
			showListMessage(JSON.parse(messageOutput.body));
		});

		var readCntSpan = $(`#readCnt${chatList.chatRoomNo}`); // 숫자를 표시하는 span 요소

		// 숫자 길이에 따라 위치 조절
		if (readChkCnt < 10) {
			// 1 자리 숫자
			readCntSpan.css({
				'transform': 'translate(95%, -50%)'
			});
		} else {
			// 2 자리 숫자
			readCntSpan.css({
				'transform': 'translate(30%, -50%)'
			});
		}

	});

	if (globalType === 'CREATE') {
		joinChatRoom(globalChatRoomNo)
	};


}

function showListMessage(message) {
	_textAreaSize();
	if (message.type === 'ENTER') {
		return;
	}
	let usrNm = $('#accountUsrNm').val();

	if (message.sender !== usrNm && globalChatRoomNo !== message.chatRoomNo) {
		$(`#readChk${message.chatRoomNo}`).find('.fa-circle').show();
		let readCntPlus = $(`#readCnt${message.chatRoomNo}`).text();
		if (!isNaN(parseInt(readCntPlus))) {
			$(`#readCnt${message.chatRoomNo}`).text(parseInt(1) + parseInt(readCntPlus));
		} else {
			$(`#readCnt${message.chatRoomNo}`).text(1);
		}
	}


	$(`#chatDate${message.chatRoomNo}`).text(message.curTime);
	if (message.message.length > 19) {
		$(`#chatContent${message.chatRoomNo}`).text(message.message.substring(0, 20) + '...');
	} else {
		$(`#chatContent${message.chatRoomNo}`).text(message.message);
	}
}
function delChatRoom(chatRoomNo) {
	resultData = {};
	$(`#listChatRoom${chatRoomNo}`).remove();
	var token = localStorage.getItem("accessToken");
	$.ajax({
		url: '/api/chat/delCahtRoom/' + chatRoomNo,
		type: 'GET',
		headers: {
			'Authorization': 'Bearer ' + token
		},
	}).done(function(data) {
		if (data.code === 'success') {
			alert(data.msg);
			_exitChat();
		} else {

		}
	}).fail(function(xhr, textStatus, errorThrowna) {
	});
}

//채팅방 열기
function joinChatRoom(chatRoomNo, num, type) {
	if ('CREATE' !== globalType) {
		stompClient.send('/app/send-message', {}, JSON.stringify({
			'sender': $('#accountUsrNm').val(),
			'chatRoomNo': globalChatRoomNo,
			'type': 'EXIT'

		}));
		globalType = '';
	}

	if (globalChatRoomNo !== chatRoomNo) {
		currentPage = 1
	}
	globalChatRoomNo = chatRoomNo;
	if (num === 1) {
		chkScroll = true;
	}
	_textAreaSize(chatConGlo, textAreaHeight);
	resultData = {};
	var usrId = localStorage.getItem("usrId");
	var token = localStorage.getItem("accessToken");
	resultData.chatRoomNo = chatRoomNo;
	resultData.usrId = usrId;
	resultData.currentPage = currentPage;
	resultData.type = type;
	$.ajax({
		url: '/api/chat/chatTextList',
		type: 'POST',
		data: JSON.stringify(resultData),
		contentType: 'application/json',
		headers: {
			'Authorization': 'Bearer ' + token
		},
	}).done(function(data) {

		let readYnCnt = data.chatReadYnCnt;

		if (readYnCnt > 0) {
			$('.chattingAlram').show();
		} else {
			$('.chattingAlram').css('display', 'none');
		}

		if (data.code === 'stop') {
		} else {
			_createChatTextList(data);

		}
		if (data.withCnt === 1 && data.usrNm === data.result[0].chatRoomSender) { //방생성
			stompClient.send('/app/send-message', {}, JSON.stringify({
				'chatCrtUsrNm': data.result[0].chatRoomReciver,
				'chatInvUsrNm': data.result[0].chatRoomSender,
				'chatRoomNo': data.result[0].chatRoomNo,
				'type': "ENTER"
			}));
			//		}
		}
	}).fail(function(xhr, textStatus, errorThrowna) {
	});
}

function _createChatTextList(data) {

	var usrNm = data.usrNm;
	let roomNo = data.chatRoomNo;
	stompClient.send('/app/send-message', {}, JSON.stringify({
		'chatCrtUsrNm': usrNm,
		'chatInvUsrNm': usrNm,
		'chatRoomNo': roomNo,
		'type': 'ENTER'

	}));



	$('.chat-room').removeClass('d-flex justify-content-center align-items-center');
	$('.chat-init').remove();
	$('.chat-log').empty();
	$('.chat-log').show();
	$('.exitchatroom').show();
	$('.card-footer').show();
	$('#withUsrNm').text(data.withUsrNm);

	var chatLog = $(".chat-log");

	var cur = new Date();
	cur = cur.toDateString();


	var list = data.result;
	var chatRoomNo = 0;
	var compChatYMD = "";
	// 데이터를 기반으로 동적으로 테이블 생성
	if (data.code === 'success') {
		list.forEach(chatTextList => {
			var recordDt = chatTextList.chatYMD.replace(/\./g, ""); // 모든 '.' 문자를 제거
			var yyyy = recordDt.substring(0, 4);
			var mm = recordDt.substring(4, 6);
			var dd = recordDt.substring(6, 8);
			var chatRecordDt = (`<div class="chat-log-date text-center mt-4">
                            <h5 class="chat-log-date">${yyyy}년 ${mm}월 ${dd}일 </h5>
                        </div>`);
			if (compChatYMD !== chatTextList.chatYMD) {
				chatLog.append(chatRecordDt);
				compChatYMD = chatTextList.chatYMD;
			}
			chatRoomNo = chatTextList.chatRoomNo;
			globalChatRoomTextNo = chatTextList.chatRoomTextNo;
			// chatYMD 속성을 올바르게 참조하기 위한 수정
			var chatDate = new Date(chatTextList.chatYMD); // `list.chatYMD`를 `chatList.chatYMD`로 변경
			chatDate = chatDate.toDateString();

			// `currentDate`와 `chatDate` 비교 로직 수정
			const chatTime = (cur === chatDate) ? chatTextList.chatTime : chatTextList.chatYMD;
			const readChk = (chatTextList.chatRoomReadChk === 'N') ? 1 : '';
			let sender = chatTextList.chatRoomSender
			if (sender === usrNm) {
				// Correctly create and append row for the sender
				let row = $(`<div class="chat-log__item chat-log__item--own">
				  			<div class="chat-log__readChk itemOwn${chatTextList.chatRoomNo}">${readChk}</div>
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
	} else {
		var recordDt = data.chatYMD.replace(/\./g, ""); // 모든 '.' 문자를 제거
		var yyyy = recordDt.substring(0, 4);
		var mm = recordDt.substring(4, 6);
		var dd = recordDt.substring(6, 8);
		var chatRecordDt = (`<div class="chat-log-date text-center mt-4">
                            <h5 class="chat-log-date">${yyyy}년 ${mm}월 ${dd}일 </h5>
                        </div>`);
		chatLog.append(chatRecordDt);
		chatRoomNo = data.chatRoomNo;
	}
	var row = $(`<input type="hidden" value="${chatRoomNo}" id="chatRoomNo">`)
	$(`#readChk${chatRoomNo}`).find('.fa-circle').css('display', 'none');
	$(`#readCnt${chatRoomNo}`).text('');
	chatLog.append(row);
	if (chkScroll) {
		scrollToBottom();
	}


}

function sendMessage() {
	let messageInput = $('#message-input').val();
	if (messageInput.replaceAll(' ', '') === '') {
		alert("메세지를 입력해 주세요");
		return;
	}
	let sender = $('#accountUsrNm').val();
	let reciver = $('#reciverUsrNm' + globalChatRoomNo).val();
	let type = "TALK";


	messageInput = messageInput.replaceAll(/(\n|\r\n)/g, "<br>");
	// 서버로 메시지 전송 (서버에서 /app/send-message로 메시지를 수신할 때)
	stompClient.send('/app/send-message', {}, JSON.stringify({
		'sender': sender,
		'reciver': reciver,
		'message': messageInput,
		'chatRoomNo': globalChatRoomNo,
		'type': type

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
	var usrId = localStorage.getItem("usrId");
	$.ajax({
		url: "/api/chat/accountLists/" + usrId,
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
		usrList.append(`<li class="list-group-item d-flex justify-content-between align-items-center"><span id="invUsrNm" style="font-size:1.5rem;">${list.chatInvUsrNm}</span>
						<button type="button" class="btn btn-link border-0 fw-bold ml-2" onclick="createChatRoom('${list.chatInvUsrNm}', '${list.chatInvUsrId}')" style="color: #000000; font-family: \'Noto Sans KR\', sans-serif; text-decoration: none; font-size: 0.8rem;">채팅 시작</button>
						<input type="hidden" id="invUsrId" value=${list.chatInvUsrId} ></li>`);
	});

}
function createChatRoom(chatInvUsrNm, chatInvUsrId) {
	let chatCrtUsrNm = $('#accountUsrNm').val();
	let chatCrtUsrId = localStorage.getItem("usrId");
	let resultData = {};
	resultData.chatCrtUsrNm = chatCrtUsrNm;
	resultData.chatCrtUsrId = chatCrtUsrId;
	resultData.chatInvUsrNm = chatInvUsrNm;
	resultData.chatInvUsrId = chatInvUsrId;
	var token = localStorage.getItem("accessToken");

	$.ajax({
		url: "/api/chat/chatCreatRoom",
		type: 'POST',
		data: JSON.stringify(resultData),
		contentType: 'application/json',
		headers: {
			'Authorization': 'Bearer ' + token
		},
	}).done(function(data) {
		if (data.code === 'success') {
			stompClient.disconnect(function() {
				console.log('웹소켓 연결이 닫혔습니다.');

			});
			globalType = 'CREATE';
			$('#chatListModal').modal("hide");

			stompClient.send('/app/send-message', {}, JSON.stringify({
				'chatCrtUsrId': data.object.chatCrtUsrId,
				'chatCrtUsrNm': data.object.chatCrtUsrNm,
				'chatInvUsrId': data.object.chatInvUsrId,
				'chatInvUsrNm': data.object.chatInvUsrNm,
				'chatRoomNo': data.object.chatRoomNo,
				'type': 'ENTER'
			}));
			listConnect();
			globalChatRoomNo = data.object.chatRoomNo;

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




function scrollToBottom() {
	var chatLogElement = $('.chat-log');
	var scrollHeight = chatLogElement.prop('scrollHeight');
	chatLogElement.scrollTop(scrollHeight);
}

function _exitChat() {
	let usrNm = $('#accountUsrNm').val();
	stompClient.send('/app/send-message', {}, JSON.stringify({
		'sender': usrNm,
		'chatRoomNo': globalChatRoomNo,
		'type': "EXIT"
	}));
	globalChatRoomNo = 0;
	currentPage = 1;

	$('.chat-init').remove();
	var chatLog = $('.chat-room').addClass('d-flex justify-content-center align-items-center');
	chatLog.append(`<div class="chat-log__item text-center chat-init"><p class="chat-log__message font-weight-bold">안녕하세요 ${usrNm}님, 채팅을 시작해보세요.</p></div>`);
	chatLog.append('<div class="chat-log__item text-center chat-init"><button class="btn btn-dark" onclick="openModal()">채팅 시작하기</button></div>');
	$('.chat-log').css('display', 'none');
	$('.exitchatroom').css('display', 'none');
	$('.card-footer').css('display', 'none');
}

function leaveChat() {
	// 특정 채팅방을 나갈 때의 동작
	stompClient.send('/app/send-message', {}, JSON.stringify({
		'sender': $('#accountUsrNm').val(),
		'chatRoomNo': 0,
		'type': 'EXIT'

	}));
}

$(window).on('beforeunload', function() {
	leaveChat();
});

$(document).ready(function() {
	init();
});

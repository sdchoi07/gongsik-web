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
		// 여기에 채팅방 나가기 동작 및 UI 업데이트를 구현합니다.
		var chatLog = $('.chat-room').addClass('d-flex justify-content-center align-items-center');
		console.log("asdfasdfasdf");
		chatLog.empty();
		chatLog.html('<div class="chat-log__item text-center"><p class="chat-log__message font-weight-bold">안녕하세요 님, 채팅을 시작해보세요.</p></div>');
		chatLog.append('<div class="chat-log__item text-center"><button class="btn btn-dark" onclick="openModal()">채팅 시작하기</button></div>');

	});
	
	 scrollToBottom();
	

	
}
function openModal(){
	$('#chatListModal').modal("show");
}

function scrollToBottom() {
    var chatLogElement = $('.chat-log');
    var scrollHeight = chatLogElement.prop('scrollHeight');
    chatLogElement.scrollTop(scrollHeight);
}


$(document).ready(function() {
	init();
});

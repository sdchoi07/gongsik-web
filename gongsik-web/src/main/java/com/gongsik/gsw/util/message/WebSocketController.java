package com.gongsik.gsw.util.message;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

	@MessageMapping("/send-message")
	@SendTo("/topic/chat")
	public String sendMessage(String message) {
		// WebSocket으로 받은 메시지를 다시 클라이언트로 보냄
		return message;
	}
}

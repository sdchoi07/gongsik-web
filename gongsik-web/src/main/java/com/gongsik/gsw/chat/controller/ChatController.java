package com.gongsik.gsw.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.gongsik.gsw.chat.dto.ChatDto;
import com.gongsik.gsw.util.notification.controller.NotificationController;

@Controller
@RequestMapping("/chat")
public class ChatController {
	
	private final NotificationController notificationController;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public ChatController(NotificationController notificationController, SimpMessagingTemplate messagingTemplate) {
        this.notificationController = notificationController;
        this.messagingTemplate = messagingTemplate;
    }
	
}

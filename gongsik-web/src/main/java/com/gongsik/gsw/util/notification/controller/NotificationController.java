package com.gongsik.gsw.util.notification.controller;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.gongsik.gsw.util.notification.service.NotificationService;

@Controller
public class NotificationController {
	
	@Autowired
	private NotificationService notificationService;
	
    public static Map<String, SseEmitter> sseEmitters = new ConcurrentHashMap<>();
    
    @GetMapping(value="/notification", produces = "text/event-stream")
    public SseEmitter subscribe(@RequestParam("usrId") String usrId) {
        SseEmitter sseEmitter = notificationService.subscribe(usrId);
        return sseEmitter;
    }
    
     // 메시지 알림
    @GetMapping(value="/alramChat")
    public ResponseEntity<Void> alramMsg(@RequestParam("usrId") String usrId) {
         notificationService.notifyMessage(usrId);
        return ResponseEntity.ok().build(); 

    }
}

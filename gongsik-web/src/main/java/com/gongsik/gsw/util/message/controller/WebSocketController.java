package com.gongsik.gsw.util.message.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.gongsik.gsw.util.message.ProducerConfiguration;
import com.gongsik.gsw.util.message.dto.MessageDto;

@Controller
public class WebSocketController {

    @Autowired
    private KafkaTemplate<String, MessageDto> kafkaTemplate;


	@MessageMapping("/send-message")
	@SendTo("/topic/chat")
	public MessageDto sendMessage(Map<String, Object> request) {
		MessageDto messageDto = new MessageDto();
		System.out.println(" ??? : " + request);
		String curDt = "";
		LocalDateTime currentDateTime = LocalDateTime.now();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		curDt = currentDateTime.format(formatter);

		String chatYMD = curDt.substring(0, 10).replaceAll("-", ".");
		String chatTime = curDt.substring(11, 16);
		messageDto.setCurYMD(chatYMD);
		messageDto.setCurTime(chatTime);
		messageDto.setMessage(request.get("message").toString());
		messageDto.setChatRoomNo(Integer.parseInt(request.get("chatRoomNo").toString()));
		messageDto.setChatRoomId(request.get("sender").toString());
		messageDto.setSender(request.get("sender").toString());

		 kafkaTemplate.send("gongsik", messageDto);
		 
		return messageDto;
	}
}

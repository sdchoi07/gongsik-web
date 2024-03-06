package com.gongsik.gsw.util.message;


import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.converter.StringMessageConverter;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gongsik.gsw.config.WebClients;
import com.gongsik.gsw.util.hadler.EmailSend;
import com.gongsik.gsw.util.message.dto.MessageDto;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Configuration
@Slf4j
public class MessagingScheduler {
	
	@Autowired
	private EmailSend emailsend;
	
    private SimpMessagingTemplate messagingTemplate;

    public MessagingScheduler(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @KafkaListener(topics = "gongsik", groupId = "chatting", containerFactory = "kafkaListenerContainerFactory")
    public void sendMessage(MessageDto message) {
        try {
            messagingTemplate.convertAndSend("/topic/chat/"+message.getChatRoomNo(), message);
            log.info("Received message from Kafka: {}", message);
           //restAPI 서버 호출
	        WebClients webClients = new WebClients();
			Mono<Object> postResponse = webClients.callApi(message, Object.class, "/api/chat/chatTextSave");
			
			//결과 값 가져오기
			Map<String, Object> resultMap = new HashMap<String, Object>();
			postResponse.subscribe(response ->{
				ObjectMapper objectMapper = new ObjectMapper();
				try {
					String jsonResponse = objectMapper.writeValueAsString(response);
					Map<String, Object> jsonMap = objectMapper.readValue(jsonResponse, new TypeReference<>() {});
					//restAPI에 반환값 가져와 저장
					for(Map.Entry<String, Object> restResponse: jsonMap.entrySet() ) {
						String jsonKey = restResponse.getKey();
						Object value = restResponse.getValue();
						resultMap.put(jsonKey, value);
						resultMap.put("subject", "오류알림");
					}
					//code 값이 fail일 경우 업무자에게 메일 전송
					if(resultMap.get("code").equals("fail")) {
					
						emailsend.sendFailAuthSave(resultMap);
					}
				} catch (JsonProcessingException e) {
					e.printStackTrace();
				}
			});
        } catch (Exception ex) {
            log.error("Error sending message to WebSocket: {}", ex.getMessage());
        }
    }
}


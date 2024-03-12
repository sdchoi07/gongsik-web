package com.gongsik.gsw.util.message;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gongsik.gsw.config.WebClients;
import com.gongsik.gsw.util.hadler.EmailSend;
import com.gongsik.gsw.util.message.dto.MessageDto;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Configuration
@Slf4j
public class MessagingScheduler {

	@Autowired
	private EmailSend emailsend;

	private SimpMessagingTemplate messagingTemplate;

	private Map<Integer, Set<String>> map;

	public MessagingScheduler(SimpMessagingTemplate messagingTemplate) {
		this.messagingTemplate = messagingTemplate;
	}

	@PostConstruct
	public void InitMap() {
		this.map = new HashMap<>();
	}

	@KafkaListener(topics = "gongsik", groupId = "chatting", containerFactory = "kafkaListenerContainerFactory")
	public void sendMessage(MessageDto message) {
		try {
			if ("ENTER".equals(message.getType())) {
				Set<String> userNames = map.computeIfAbsent(message.getChatRoomNo(), k -> new HashSet<>());
				userNames.add(message.getSender());
				// map.put(message.getChatRoomNo(), userNames); // 이 줄은 불필요합니다. computeIfAbsent가
				// 이미 map을 업데이트합니다.
				System.out.println("ENTER : " + message.getChatRoomNo());
				System.out.println("ENTER : " + map);
				log.info("Received message from Kafka ENTER: {}", message);

				if (map.get(message.getChatRoomNo()).size() == 2) {
					message.setReadYn("Y");
				} else {
					message.setReadYn("N");
				}
				messagingTemplate.convertAndSend("/topic/chat/" + message.getChatRoomNo(), message);

			} else if ("EXIT".equals(message.getType())) {
				if (message.getChatRoomNo() == 0) {
					for (int key : map.keySet()) {
						Set<String> usrNm = map.get(key);
						if (usrNm != null) {
							usrNm.remove(message.getSender());
							if (usrNm.isEmpty()) {
								map.remove(key);
							}
						}
					}
				} else {

					Set<String> userNames = map.get(message.getChatRoomNo());
					System.out.println("exit : " + userNames);
					if (userNames != null) {
						userNames.remove(message.getSender());
						// 여기서 userNames가 비어있으면 map에서 해당 키를 제거할 수도 있습니다.
						if (userNames.isEmpty()) {
							map.remove(message.getChatRoomNo());
						}
					}
				}
				log.info("Received message from Kafka EXIT: {}", message);
			} else {
				if (map.get(message.getChatRoomNo()).size() == 2) {
					message.setReadYn("Y");
				} else {
					message.setReadYn("N");
				}
				log.info("Received message from Kafka ELSE: {}", message);
				messagingTemplate.convertAndSend("/topic/chat/" + message.getChatRoomNo(), message);
			}
			System.out.println(map);
			if ("TALK".equals(message.getType())) {
				// restAPI 서버 호출
				WebClients webClients = new WebClients();
				Mono<Object> postResponse = webClients.callApi(message, Object.class, "/api/chat/chatTextSave");

				// 결과 값 가져오기
				Map<String, Object> resultMap = new HashMap<String, Object>();
				postResponse.subscribe(response -> {
					ObjectMapper objectMapper = new ObjectMapper();
					try {
						String jsonResponse = objectMapper.writeValueAsString(response);
						Map<String, Object> jsonMap = objectMapper.readValue(jsonResponse, new TypeReference<>() {
						});
						// restAPI에 반환값 가져와 저장
						for (Map.Entry<String, Object> restResponse : jsonMap.entrySet()) {
							String jsonKey = restResponse.getKey();
							Object value = restResponse.getValue();
							resultMap.put(jsonKey, value);
							resultMap.put("subject", "오류알림");
						}
						// code 값이 fail일 경우 업무자에게 메일 전송
						if (resultMap.get("code").equals("fail")) {

							emailsend.sendFailAuthSave(resultMap);
						}
					} catch (JsonProcessingException e) {
						e.printStackTrace();
					}
				});
			}
		} catch (Exception ex) {
			log.error("Error sending message to WebSocket: {}", ex.getMessage());
		}

	}
}

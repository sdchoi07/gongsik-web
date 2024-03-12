package com.gongsik.gsw.util.message.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gongsik.gsw.config.WebClients;
import com.gongsik.gsw.util.hadler.EmailSend;
import com.gongsik.gsw.util.message.dto.MessageDto;

import reactor.core.publisher.Mono;

@Controller
public class WebSocketController {

	@Autowired
	private KafkaTemplate<String, MessageDto> kafkaTemplate;

	@Autowired
	private EmailSend emailsend;

	@Transactional
	@MessageMapping("/send-message")
	public void sendMessage(Map<String, Object> request) throws InterruptedException, ExecutionException {
		MessageDto messageDto = new MessageDto();
		String type = request.get("type").toString();
		String curDt = "";
		LocalDateTime currentDateTime = LocalDateTime.now();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		curDt = currentDateTime.format(formatter);

		String chatYMD = curDt.substring(0, 10).replaceAll("-", ".");
		String chatTime = curDt.substring(11, 16);
//		chatMessageDto.getMessageType().equals(ChatMessageDto.MessageType.ENTEcR)
		if ("ENTER".equals(type)) {
			String ChatInvUsrNm = request.get("chatInvUsrNm").toString();
			String ChatCrtUsrNm = request.get("chatCrtUsrNm").toString();
			int chatRoomNo = Integer.parseInt(request.get("chatRoomNo").toString());
			String roomEnterMessage = String.format("%s님이 입장하였습니다.", ChatCrtUsrNm);
			messageDto.setMessage(roomEnterMessage);
			messageDto.setSender(ChatCrtUsrNm);
			messageDto.setReciver(ChatInvUsrNm);
			messageDto.setCurYMD(chatYMD);
			messageDto.setCurTime(chatTime);
			messageDto.setSendDt(curDt);
			messageDto.setChatRoomNo(chatRoomNo);
			messageDto.setType(type);
			kafkaTemplate.send("gongsik", messageDto);
		} else if("EXIT".equals(type)){
			String sender = request.get("sender").toString();
			int chatRoomNo = Integer.parseInt(request.get("chatRoomNo").toString());
			String roomEnterMessage = String.format("%s님이 퇴장하였씁니다..", sender);
			messageDto.setMessage(roomEnterMessage);
			messageDto.setSender(sender);
			messageDto.setCurYMD(chatYMD);
			messageDto.setCurTime(chatTime);
			messageDto.setSendDt(curDt);
			messageDto.setChatRoomNo(chatRoomNo);
			messageDto.setType(type);
			kafkaTemplate.send("gongsik", messageDto);
		}else {
			messageDto.setCurYMD(chatYMD);
			messageDto.setCurTime(chatTime);
			messageDto.setMessage(request.get("message").toString());
			messageDto.setChatRoomNo(Integer.parseInt(request.get("chatRoomNo").toString()));
			messageDto.setChatRoomId(request.get("sender").toString());
			messageDto.setSender(request.get("sender").toString());
			messageDto.setReciver(request.get("reciver").toString());
			messageDto.setSendDt(curDt);
			messageDto.setType(type);
			kafkaTemplate.send("gongsik", messageDto);
		}
	}

	public void createChatRoom(MessageDto messageDto) {
		// restAPI 서버 호출
		WebClients webClients = new WebClients();
		Mono<Object> postResponse = webClients.callApi(messageDto, Object.class, "/api/chat/chatCreatRoom");

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
}
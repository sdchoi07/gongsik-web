package com.gongsik.gsw.util.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gongsik.gsw.config.WebClients;

import reactor.core.publisher.Mono;

@Service
public class SendSMSAuthServcie {
	
	@Autowired
    private JavaMailSender emailSender;
	
	public Map<String, Object> restApiCall(Map<String, String> map) {
		Map<String, Object> restDto = new HashMap<String, Object>();
			
			//웹에서 넘어온 정보 restAPI 호출전 dto에 담기
			String countryPhNo = map.get("countryPhNo");
			String usrPhNo = map.get("phoneNumber");
			String authType = map.get("authType");
			String authNo = map.get("authNo");
			restDto.put("countryPh",countryPhNo);
			restDto.put("authNo", authNo);
			restDto.put("usrPhNo", usrPhNo);
			restDto.put("authType",authType);
			//현재 시각 으로 요청시간 변경 
			LocalDateTime curDate = LocalDateTime.now();
			restDto.put("reqDt", curDate);
			
			//restAPI 서버 호출
	        WebClients webClients = new WebClients();
			Mono<Object> postResponse = webClients.callApi(restDto, Object.class, "/api/account/join/authNoSave");
			
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
					}
					System.out.println("resultMap : " + resultMap);
					//code 값이 fail일 경우 업무자에게 메일 전송
					if(resultMap.get("code").equals("fail")) {
						sendFailAuthSave(resultMap);
					}
				} catch (JsonProcessingException e) {
					e.printStackTrace();
				}
			});
			System.out.println("resultMap : " + resultMap);
		return resultMap;
	}
	
	public void sendFailAuthSave(Map<String, Object> map) {
		SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("djop1212@gmail.com");
        message.setSubject("오류 알림");
        message.setText(map.get("msg").toString());
        emailSender.send(message);
    }
		
	
	
}

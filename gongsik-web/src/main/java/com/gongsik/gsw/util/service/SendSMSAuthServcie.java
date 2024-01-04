package com.gongsik.gsw.util.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gongsik.gsw.config.WebClients;

import reactor.core.publisher.Mono;

@Service
public class SendSMSAuthServcie {

	public Map<String, Object> restApiCall(Map<String, String> map) {
		Map<String, Object> restDto = new HashMap<String, Object>();
				
			String usrId = map.get("usrEmail") + "@"+ map.get("domainTxt");
			String countryPhNo = map.get("countryPhNo");
			String usrPhNo = map.get("phoneNumber");
			String authId = map.get("usrEmail") + map.get("birthDate").substring(0,4);
			String authType = map.get("authType");
			String authNo = map.get("authNo");
			restDto.put("usrId", usrId);
			restDto.put("countryPh",countryPhNo);
			restDto.put("authNo", authNo);
			restDto.put("usrPhNo", usrPhNo);
			restDto.put("authId", authId);
			restDto.put("authType",authType);
			//현재 시각 으로 요청시간 변경 
			LocalDateTime curDate = LocalDateTime.now();
			restDto.put("reqDt", curDate);
			
			System.out.println("webServer : " + restDto);
				
	        WebClients webClients = new WebClients();
			Mono<Object> postResponse = webClients.callApi(restDto, Object.class, "/api/account/join/authNoSave");
			
			Map<String, Object> resultMap = new HashMap<String, Object>();
			postResponse.subscribe(response ->{
				ObjectMapper objectMapper = new ObjectMapper();
				try {
					String jsonResponse = objectMapper.writeValueAsString(response);
					Map<String, Object> jsonMap = objectMapper.readValue(jsonResponse, new TypeReference<>() {});
					for(Map.Entry<String, Object> restResponse: jsonMap.entrySet() ) {
						String jsonKey = restResponse.getKey();
						Object value = restResponse.getValue();
						System.out.println("response : " + response);
						resultMap.put(jsonKey, value);
					}
				} catch (JsonProcessingException e) {
					e.printStackTrace();
				}
			});
			System.out.println("resultMap : " + resultMap);
		return resultMap;
	}

}

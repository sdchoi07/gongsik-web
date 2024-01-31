package com.gongsik.gsw.util.sms.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gongsik.gsw.config.WebClients;
import com.gongsik.gsw.util.hadler.EmailSend;

import reactor.core.publisher.Mono;

@Service
public class SendSMSAuthServcie {
	
	@Autowired
	private EmailSend emailsend;
	
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	
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
		return resultMap;
	}

	public Map<String, Object> sendToPwdUrl(Map<String, String> requestDto) {
		Map<String, Object> map = new HashMap<>();
		
		//임시 빌밀번호 생성
		Random rand  = new Random();
	    String numStr = "";
	    for(int i=0; i<2; i++) {
	       String ran = Integer.toString(rand.nextInt(4));
	       numStr+=ran;
	    }
			    
	    String tempPwd = bCryptPasswordEncoder.encode(numStr);
	    tempPwd = tempPwd.substring(0,8);
	    System.out.println("resuqetDto : " + requestDto);
	    requestDto.put("usrPwd", tempPwd);
	    HttpClient client = HttpClientBuilder.create().build(); // HttpClient 생성
	    HttpPost postRequest = new HttpPost("http://localhost/api/account/tempPwd"); 
	    String jsonBody;
		try {
			jsonBody = new ObjectMapper().writeValueAsString(requestDto);
			// POST 메시지의 Body 설정
			StringEntity input = new StringEntity(jsonBody);
			input.setContentType("application/json");
			postRequest.setEntity(input);
			HttpResponse response = client.execute(postRequest);
			int statusCode = response.getStatusLine().getStatusCode();
			if(statusCode == 200) {
	           // 응답 본문 확인
	           String responseBody = EntityUtils.toString(response.getEntity());
	           System.out.println("responseBody : " +statusCode);
	
	           if(responseBody.contains("success")) {
		           
		           Map<String, Object> resultMap = new HashMap<String, Object>();
			   		StringBuffer sb = new StringBuffer();
			   		String text =  "임시 비밀 번호: " + tempPwd + " 입니다."+"\n" 
			   				     + "변경을 원하시면, 해당 링크 클릭하여 비밀번호 변경 해주세요.";
			   		String url = "http://localhost/account/changePwd";
			   		sb.append(text).append("\n").append(url);
			   		resultMap.put("msg", sb.toString());
			   		resultMap.put("subject", "비밀번호 변경");
			   		emailsend.sendFailAuthSave(resultMap);
			   		
	           }else {
        	    map.put("code", "fail");
	   	   		map.put("msg", "다시 한번 확인해 주세요.");
	        	   
	           }
			}else {
				map.put("code", "fail");
		   		map.put("msg", "다시 한번 확인해 주세요.");
			}
	   		map.put("code", "success");
	   		map.put("msg", "해당 아이디의 이메일 확인해주세요.");
	   		map.put("result", requestDto);
	   		return map;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 		
		map.put("code", "success");
   		map.put("msg", "해당 아이디의 이메일 확인해주세요.");
		return map;
		
				
	}
	

		
	
	
}

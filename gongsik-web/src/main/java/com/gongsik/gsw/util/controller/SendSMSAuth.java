package com.gongsik.gsw.util.controller;

import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.annotation.PostConstruct;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;

@Controller
@RequestMapping("/util")
public class SendSMSAuth {
	
	@Value("${coolsms.api.key}")
	private String apiKey;
	
	@Value("${coolsms.api.secret}")
	private String apiSecret;
	
	@Value("${coolsms.api.sender}")
	private String apiSender;
	
	private DefaultMessageService messageService;
	
    private RedisTemplate<String, String> redisTemplate;

	
	@PostConstruct
	public void init() {
        this.messageService = NurigoApp.INSTANCE.initialize(apiKey, apiSecret, "https://api.coolsms.co.kr");
        this.redisTemplate = redisTemplate;
    }
	
	
	@PostMapping("/sendSMS")
	public SingleMessageSentResponse sendSMS(@RequestBody Map<String,String> map){
		
		String userPhNo = map.get("phoneNumber");
		
		Random rand  = new Random();
	    String numStr = "";
	    for(int i=0; i<4; i++) {
	       String ran = Integer.toString(rand.nextInt(4));
	       numStr+=ran;
	    }     
	    try {
            String key = "AuthNum";
            String value = numStr;
            redisTemplate.opsForValue().set(key, value);
        } catch (Exception e) {
        	
        }
	    
		Message message = new Message();
        // 발신번호 및 수신번호는 반드시 01012345678 형태로 입력되어야 합니다.
        message.setFrom(apiSender);
        message.setTo(userPhNo);
        message.setText("인증번호는 [" + numStr + "] 입니다.");

        SingleMessageSentResponse response = this.messageService.sendOne(new SingleMessageSendingRequest(message));
        System.out.println(response);
        
		
				 
		return response;
	}
}

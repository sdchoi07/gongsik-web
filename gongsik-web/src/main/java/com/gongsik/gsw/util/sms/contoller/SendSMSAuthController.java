package com.gongsik.gsw.util.sms.contoller;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.gongsik.gsw.util.sms.service.SendSMSAuthServcie;

import jakarta.annotation.PostConstruct;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.service.DefaultMessageService;

@Controller
@RequestMapping("/util")
public class SendSMSAuthController {
	
	@Value("${coolsms.api.key}")
	private String apiKey;
	
	@Value("${coolsms.api.secret}")
	private String apiSecret;
	
	@Value("${coolsms.api.sender}")
	private String apiSender;
	
	@Autowired
	private SendSMSAuthServcie sendSMSAuthService;
	
	private DefaultMessageService messageService;

	
	@PostConstruct
	public void init() {
        this.messageService = NurigoApp.INSTANCE.initialize(apiKey, apiSecret, "https://api.coolsms.co.kr");
    }
	
	
	@PostMapping("/sendSMS")
	@ResponseBody
	public Map<String,Object> sendSMS(@RequestBody Map<String,String> map){
		
		Map<String, Object> result = new HashMap<String, Object>();
		//인증번호 생성
		Random rand  = new Random();
	    String numStr = "";
	    for(int i=0; i<4; i++) {
	       String ran = Integer.toString(rand.nextInt(4));
	       numStr+=ran;
	    }
	    //인증번호 값 저장(restAPI )
	    map.put("authNo", numStr);

	    //회원정보 restAPI서버 객체에 저장
	    result = sendSMSAuthService.restApiCall(map);
	    System.out.println(result);
		//Message message = new Message();
        // 발신번호 및 수신번호는 반드시 01012345678 형태로 입력되어야 합니다.
       // message.setFrom(apiSender);
       // message.setTo(userPhNo);
       // message.setText("인증번호는 [" + numStr + "] 입니다.");
//        SingleMessageSentResponse smsResponse = this.messageService.sendOne(new SingleMessageSendingRequest(message));
//        System.out.println(smsResponse);
        
	    
	    if(!numStr.equals("") || !numStr.equals(null)){
	    	result.put("msg", "인증 문자 전송 되었습니다.");
	    	result.put("code", "success");
	    }else {
	    	result.put("msg", "인증 문자 전송 실패 하였습니다.");
	    	result.put("code", "fail");
	    	
	    }
		return result;		 
	}
	
	@PostMapping("/pwdSend")
	@ResponseBody
	public Map<String,Object> pwdSend(@RequestBody Map<String, String> map){
	    Map<String, Object> result
		= sendSMSAuthService.sendToPwdUrl(map);
	    return result;
	}
}

package com.gongsik.gsw.util.hadler;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@Configuration
public class EmailSend {
	@Autowired
    private JavaMailSender emailSender;
	
	public void sendFailAuthSave(Map<String, Object> map) {
		SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("djop1212@gmail.com");
        message.setSubject(map.get("subject").toString());
        message.setText(map.get("msg").toString());
        emailSender.send(message);
    }

}

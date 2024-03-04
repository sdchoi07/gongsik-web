package com.gongsik.gsw.util.message;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.converter.StringMessageConverter;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.gongsik.gsw.util.message.dto.MessageDto;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class MessagingScheduler {

    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    public void setMessagingTemplate(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @KafkaListener(topics = "gongsik", groupId = "${spring.kafka.consumer.group-id}")
    public void checkNotice(MessageDto message){
        log.info("checkNotice call");
        try{
            messagingTemplate.setMessageConverter(new StringMessageConverter());
            messagingTemplate.convertAndSend("/subscribe/notice" + message.getChatRoomNo(), message.getSender() + "|" + message.getMessage() + " / " +message.getCurTime());
        }catch(Exception ex){
            log.error(ex.getMessage());
        }
    }
}

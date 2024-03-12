package com.gongsik.gsw.chat.dto;

import com.gongsik.gsw.util.message.dto.MessageDto;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class ChatDto {
	private String sender;
	private String receiver;
	private String content;

}

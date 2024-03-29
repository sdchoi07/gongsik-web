package com.gongsik.gsw.util.message.dto;

import java.awt.TrayIcon.MessageType;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class MessageDto {

	private String type; // 메시지 타입
	private String chatRoomId; // 방번호
	private String sender; // 메시지 보낸사람
	private String message; // 메시지
	private int chatRoomNo;
	private String curYMD;
	private String curTime;
	private String reciver;
	private String sendDt;
	private String chatInvUsrId;
	private String chatInvUsrNm;
	private String chatCrtUsrId;
	private String chatCrtUsrNm;
	private String readYn;

}

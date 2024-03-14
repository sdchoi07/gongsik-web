package com.gongsik.gsw.payment.dto;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class PaymentDto {
	private String itemNm;
	private String itemNo;
	private int invenCnt;
	private int itemPrice;
	
}

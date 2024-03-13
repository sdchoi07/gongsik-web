package com.gongsik.gsw.payment.dto;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class PaymentDto {
	private String itemNm;
	private String itemKey;
	private String count;
	private String totalPrice;
	
}

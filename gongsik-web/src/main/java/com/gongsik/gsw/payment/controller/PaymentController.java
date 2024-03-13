package com.gongsik.gsw.payment.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;

import jakarta.annotation.PostConstruct;

@Controller
@RequestMapping("/payment")
public class PaymentController {
	
//	@Autowired
//	private IamportClient iamportClient;
	
//	@PostConstruct
//	public void init() {
//		this.iamportClient = new IamportClient("2892848086521566", "qxmNX5mcXjqQLdVBRtPZ1rEcVmM5biXCPjpNpL0m5qcQE8svChuDJ8PEvBJGTGiJ0HxptxMyYZpC8R7K");
//	}
	
	
	@GetMapping("/paymentDetail")
	public String paymentDetail(@RequestParam(name = "itemKey", required = false) String itemKey,
			@RequestParam(name = "itemNm", required = false) String itemNm, @RequestParam(name = "count") int count,
			@RequestParam(name = "totalPrice") String totalPrice, @RequestParam(name = "url") String url,
			@RequestParam(name = "totalBenePrice") String totalBenePrice,
			@RequestParam(name = "itemPrice") String itemPrice, Model model) {
		model.addAttribute("itemKey", itemKey);
		model.addAttribute("itemNm", itemNm);
		model.addAttribute("count", count);
		model.addAttribute("totalPrice", totalPrice);
		model.addAttribute("url", url);
		model.addAttribute("itemPrice", itemPrice);
		model.addAttribute("totalBenePrice", totalBenePrice);

		return "payment/payment";
	}

//	@Value("${iamport.key}")
//	private String restApiKey;
//	@Value("${iamport.secret}")
//	private String restApiSecret;


//
//	@PostMapping("/verifyIamport/{imp_uid}")
//	public IamportResponse<Payment> paymentByImpUid(@PathVariable("imp_uid") String imp_uid)
//			throws IamportResponseException, IOException {
//		return iamportClient.paymentByImpUid(imp_uid);
//	}
}

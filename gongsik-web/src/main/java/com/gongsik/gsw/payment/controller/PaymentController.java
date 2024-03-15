package com.gongsik.gsw.payment.controller;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/payment")
public class PaymentController {
	

	
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
	
	@GetMapping("/paymentDetailFromWish")
	public String paymentDetail(@RequestParam Map<String, Object>wishLists, Model model) {
		model.addAttribute("itemLists", wishLists);
		
		return "payment/payment";
	}
	

}

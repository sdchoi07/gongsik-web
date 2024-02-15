package com.gongsik.gsw.mypage.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/mypage")
public class MypageController {
	
	@GetMapping("/profile")
	public String login() {
		return "mypage/usrProfile";
	}
	
	@GetMapping("/usrGrade")
	public String usrGrade() {
		return "mypage/usrGrade";
	}
	
	@GetMapping("/orderList")
	public String orderList() {
		return "mypage/usrOrderList";
	}
	
	@GetMapping("/delvList")
	public String delvList() {
		return "mypage/usrDelvList";
	}
	
	@GetMapping("/usrPoint")
	public String usrPoint() {
		return "mypage/usrPoint";
	}
	
	@GetMapping("/usrCart")
	public String usrWish() {
		return "mypage/usrCart";
	}
	
	@GetMapping("/cart/wishes")
	public String wishes() {
		return "mypage/cart/wishes";
	}
	
	@GetMapping("/cart/likes")
	public String likes() {
		return "mypage/cart/likes";
	}
}

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
		return "mypage/profile";
	}
	
	@GetMapping("/usrGrade")
	public String usrGrade() {
		return "mypage/usrGrade";
	}
	
	@GetMapping("/orderList")
	public String orderList() {
		return "mypage/orderList";
	}

}

package com.gongsik.gsw.account.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/account")
public class AccountController {
	
	@Value("${restServer}")
	private String restServer ;
	
	@GetMapping("/login")
	public String login(Model model) {
    	model.addAttribute("restServer", restServer);
		return "account/login";
	}
}

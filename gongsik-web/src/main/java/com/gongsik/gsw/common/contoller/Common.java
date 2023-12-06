package com.gongsik.gsw.common.contoller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/main")
public class Common {
	
	    @GetMapping("/main")
	    public String sayHello(Model model) {
	        model.addAttribute("say", "Hello");
	        return "main/main";
	    }
	}


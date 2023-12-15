package com.gongsik.gsw.common.contoller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class Common implements ErrorController{
	
	    @GetMapping("/main")
	    public String sayHello(Model model) {
	        model.addAttribute("say", "Hello");
	        return "main/main";
	    }
	    
	    @GetMapping("/error")
	    public String error() {
	        return "main/error";
	    }
	}


package com.gongsik.gsw.common.contoller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class Common implements ErrorController{
	
	    @GetMapping("/")
	    public String sayHello(Model model) {
	        model.addAttribute("say", "Hello");
	        return "main";
	    }
	    
	    @GetMapping("/error")
	    public String error() {
	        return "main/error";
	    }
	    
	    @GetMapping("/user")
	    public @ResponseBody String user() {
	        return "user";
	    }
	    
	    @GetMapping("/admin")
	    public @ResponseBody String admin() {
	    	return "admin";
	    }
	    
	    @GetMapping("/login")
	    public @ResponseBody String login() {
	    	return "login";
	    }
	}


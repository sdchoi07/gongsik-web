package com.gongsik.gsw.main.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;


@Controller
public class MainController implements ErrorController{
		
	    @GetMapping("/")
	    public String sayHello() {
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
	    
	  
	}


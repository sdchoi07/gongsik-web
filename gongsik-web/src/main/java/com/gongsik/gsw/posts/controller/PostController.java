package com.gongsik.gsw.posts.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/posts")
public class PostController {

	@GetMapping("/sharePost")
	public String sharePost() {
		return "posts/sharePost";
	}
	
	@GetMapping("/createPost")
	public String createPost() {
		return "posts/createPost";
	}

}

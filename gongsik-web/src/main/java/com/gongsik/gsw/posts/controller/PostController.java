package com.gongsik.gsw.posts.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/posts")
public class PostController {

	@Value("${upload.directory}")
	private String uploadDirectory;

	@GetMapping("/sharePost")
	public String sharePost() {
		return "posts/sharePost";
	}

	@GetMapping("/createPost")
	public String createPost(@RequestParam(name = "postsNo", required = false) String postsNo, Model model) {
		model.addAttribute("postsNo", postsNo);
		return "posts/createPost";
	}
	
	@GetMapping("/postsDetail")
	public String postsDetails(@RequestParam(name = "postsNo", required = false) String postsNo,@RequestParam(name = "postsNm", required = false) String postsNm ,Model model) {
		model.addAttribute("postsNo", postsNo);
		model.addAttribute("postsNm", postsNm);
		return "posts/postsDetail";
	}



}

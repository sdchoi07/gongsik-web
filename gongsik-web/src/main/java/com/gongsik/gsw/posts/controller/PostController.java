package com.gongsik.gsw.posts.controller;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.gongsik.gsw.posts.service.PostService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Controller
@RequestMapping("/posts")
public class PostController {
	@Autowired
	private PostService postsService;

	@Value("${upload.directory}")
	private String uploadDirectory;

	@GetMapping("/sharePost")
	public String sharePost() {
		return "posts/sharePost";
	}

	@GetMapping("/createPost")
	public String createPost() {
		return "posts/createPost";
	}


	

//	@PostMapping("/upload")
//	public void handleFileUpload(HttpServletRequest request, HttpServletResponse response)
//			throws ServletException, IOException {
//		request.setCharacterEncoding("UTF-8");
//		String path = "/upload"; // 개발자 지정 폴더
//		String real_save_path = request.getServletContext().getRealPath(path);
//		MultipartRequest multi = new MultipartRequest(request, real_save_path, 1024 * 1024 * 50, "UTF-8", new DefaultFileRenamePolicy());
//		String fileName = multi.getOriginalFileName("upload"); // ckeditor5 static const
//		JSONObject outData = new JSONObject();
//		outData.put("uploaded", true);
//		outData.put("url", request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/" + fileName);
//		response.setContentType("application/json");
//		response.setCharacterEncoding("UTF-8");
//		response.getWriter().print(outData.toString());
//	}

}

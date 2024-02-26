package com.gongsik.gsw.util.upload.controller;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.util.Map;
import java.util.Random;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.minidev.json.JSONObject;

@Controller
public class UploadController {
	@PostMapping("/upload")
	public void fileUpload( MultipartHttpServletRequest multiRequest, HttpServletRequest request, HttpServletResponse response) {
		try {
	    	final String real_save_path = "C:\\git\\gongsik-web\\gongsik-web\\src\\main\\resources\\static\\vendor\\third\\img";

	    	// 폴더가 없을 경우 생성
	    	File saveFolder = new File((real_save_path));
    		if(!saveFolder.exists() || saveFolder.isFile()) {
    			saveFolder.mkdirs();
    		}

			final Map<String, MultipartFile> files = multiRequest.getFileMap();
			MultipartFile fileload = (MultipartFile)files.get("upload");
			
		    //filename 취득
		    String fileName = fileload.getOriginalFilename();

		    int index = fileName.lastIndexOf(".");
			String ext = fileName.substring(index+1);
			fileName = "createPost_"+System.currentTimeMillis()+"."+ext;

		    //폴더 경로 설정
		    String newfilename = real_save_path + File.separator + fileName;
		    fileload.transferTo(new File((newfilename)));

			JSONObject outData = new JSONObject();
			outData.put("uploaded", true);
			outData.put("url", request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + "/common/fms/getImageForContents.do?fileNm=" + fileName);
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().print(outData.toString());
	    } catch (Exception e) {
	    	System.out.println("오류발생");
	    }
	}
	
	@GetMapping("/common/fms/getImageForContents.do")
	public void getImageForContents(@RequestParam Map<String, Object> commandMap, HttpServletResponse response) throws Exception {
	    String fileNm = (String)commandMap.get("fileNm");
	    String fileStr = "C:\\git\\gongsik-web\\gongsik-web\\src\\main\\resources\\static\\vendor\\third\\img";

	    File tmpDir = new File(fileStr);
	    if(!tmpDir.exists()) {
	        tmpDir.mkdirs();
	    }

	    FileInputStream fis = null;
	    BufferedInputStream in = null;
	    ByteArrayOutputStream bStream = null;

	    try {

	        fis = new FileInputStream(new File(fileStr, fileNm));
	        in = new BufferedInputStream(fis);
	        bStream = new ByteArrayOutputStream();

	        int imgByte;
	        while ((imgByte = in.read()) != -1) {
	            bStream.write(imgByte);
	        }

	        String type = "";
	        String ext = fileNm.substring(fileNm.lastIndexOf(".") + 1).toLowerCase();

	        if ("jpg".equals(ext)) {
	            type = "image/jpeg";
	        } else {
	            type = "image/" + ext;
	        }

	        response.setHeader("Content-Type", type);
	        response.setContentLength(bStream.size());

	        bStream.writeTo(response.getOutputStream());

	        response.getOutputStream().flush();
	        response.getOutputStream().close();

	    } finally {
	    	 if (bStream != null) {
	             bStream.close();
	         }
	         if (in != null) {
	             in.close();
	         }
	         if (fis != null) {
	             fis.close();
	         }
	    }
	}
}

package com.gongsik.gsw.posts.service;

import java.io.File;
import java.time.LocalDate;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.gongsik.gsw.posts.vo.PostVo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {
	
	public void insertImage(MultipartFile file) {
		 // save할 DTO 띄우기
        PostVo imageDto = new PostVo();

		//저장할 파일경로 지정
        String absolutePath = new File("src/main/resources/static/images/").getAbsolutePath();

        // 확장자 추출
        String originalImageExtension = "";
        if (!file.isEmpty()) {
            String contentType = file.getContentType();
            if (contentType.contains("image/jpeg")) {
                originalImageExtension = ".jpg";
            } else if (contentType.contains("image/png")) {
                originalImageExtension = ".png";
            } else if (contentType.contains("image/gif")) {
                    originalImageExtension = ".gif";
       		}
       	}
            
		//UUID로 랜덤으로 이름 생성
        String newImageName = UUID.randomUUID().toString() + originalImageExtension;

        // DTO에 담기
       	imageDto.setImagePath(absolutePath);
       	imageDto.setNewImageName(newImageName);
       	imageDto.setOriginImageName(file.getOriginalFilename());

		//DAO 실행
//       	imageDto.save(imageDto);
    }
		
}

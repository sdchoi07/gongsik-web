package com.gongsik.gsw.account.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/account")
public class AccountController {
	
//	@Value("${spring.security.oauth2.client.registration.kakao.client-id}")
//	private String kakaoApiKey;

//	@Value("${kakao.redirect_uri}")
//	private String kakaoRedirectUri;
	
	
	@GetMapping("/login")
	public String login(Model model) {
//		model.addAttribute("kakaoApiKey", kakaoApiKey);
//		model.addAttribute("redirectUri", kakaoRedirectUri);
		return "account/login";
	}
	
	@GetMapping("/join")
	public String join(Model model) {
		return "account/join";
	}
	
	@PostMapping("/login/oauth2/code/kakao")
    public String kakaoLogin(@RequestParam String code){
		System.out.println("cdoe " + code);
        // 1. 인가 코드 받기 (@RequestParam String code)

        // 2. 토큰 받기
      //  String accessToken = kakaoApi.getAccessToken(code);

        // 3. 사용자 정보 받기
       // Map<String, Object> userInfo = kakaoApi.getUserInfo(accessToken);

//        String email = (String)userInfo.get("email");
//        String nickname = (String)userInfo.get("nickname");
//
//        System.out.println("email = " + email);
//        System.out.println("nickname = " + nickname);
//        System.out.println("accessToken = " + accessToken);

        return "redirect:/result";
    }

	
}

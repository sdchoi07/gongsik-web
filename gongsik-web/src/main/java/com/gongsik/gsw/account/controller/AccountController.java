package com.gongsik.gsw.account.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.gongsik.gsw.account.service.AccountService;



@Controller
@RequestMapping("/account")
public class AccountController {
	
	@Value("${kakao.api-key}")
	private String kakaoApiKey;
	
	@Autowired
	private AccountService accountService;

	
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
	
	@GetMapping("/login/kakao")
	@ResponseBody
	public String getKakaoAuthUrl() {
		String url ="https://kauth.kakao.com/oauth/authorize?client_id="+kakaoApiKey+"&redirect_uri=http://localhost/account/login/oauth2/code/kakao&response_type=code";
		return url;
	}
	
	@GetMapping("/login/oauth2/code/kakao")
    public String kakaoLogin(@RequestParam(value="code") String code, Model model){
        // 1. 인가 코드 받기 (@RequestParam String code)

        // 2. 토큰 받기
        String accessToken = accountService.getAccessToken(code,kakaoApiKey);
        
        // 3. 사용자 정보 받기
        Map<String, Object> userInfo = accountService.getUserInfo(accessToken);

        String email = (String)userInfo.get("email");
        String nickname = (String)userInfo.get("nickname");
        userInfo.put("email", email);
        userInfo.put("name", nickname);
        model.addAllAttributes(userInfo);
        return "main";
    }

	@GetMapping("/findid")
	public String findId(Model model) {
		return "account/findid";
	}
	
	@GetMapping("/foundid")
	public String foundId(Model model) {
		return "account/foundid";
	}
	
	@GetMapping("/findpw")
	public String findpw(Model model) {
		return "account/findpw";
	}
	
	@GetMapping("/changePwd")
	public String changePwd(Model model) {
		return "account/changePwd";
	}
	
	
	
}

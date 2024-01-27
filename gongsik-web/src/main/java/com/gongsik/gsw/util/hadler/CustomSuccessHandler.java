package com.gongsik.gsw.util.hadler;

import java.io.IOException;
import java.util.Map;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;

import com.gongsik.gsw.util.oauth.PrincipalDetails;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Configuration
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
	

	
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {

		// 토큰에서 email, oauthType 추출
		OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
		PrincipalDetails detials = (PrincipalDetails)authentication.getPrincipal();
		String email = null;
		String oauthType = token.getAuthorizedClientRegistrationId();
		
		// oauth 타입에 따라 데이터가 다르기에 분기
		if("kakao".equals(oauthType.toLowerCase())) {
			// kakao는 kakao_account 내에 email이 존재함.
			email = ((Map<String, Object>) token.getPrincipal().getAttribute("kakao_account")).get("email").toString();
		}
		else if("google".equals(oauthType.toLowerCase())) {
			email = token.getPrincipal().getAttribute("email").toString();
		}
		else if("naver".equals(oauthType.toLowerCase())) {
			// naver는 response 내에 email이 존재함.
			email = ((Map<String, Object>) token.getPrincipal().getAttribute("response")).get("email").toString();
		}
		
		
		// 세션에 user 저장
		HttpSession session = request.getSession();
		session.setAttribute("email", email);

		super.onAuthenticationSuccess(request, response, authentication);
	}
}
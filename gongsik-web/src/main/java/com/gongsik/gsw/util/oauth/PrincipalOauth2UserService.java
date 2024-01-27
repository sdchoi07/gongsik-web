package com.gongsik.gsw.util.oauth;

import java.util.HashMap;
import java.util.Map;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gongsik.gsw.account.repository.AccountRepository;
import com.gongsik.gsw.util.oauth.provider.GoogleUserInfo;
import com.gongsik.gsw.util.oauth.provider.KakaoUserInfo;
import com.gongsik.gsw.util.oauth.provider.NaverUserInfo;
import com.gongsik.gsw.util.oauth.provider.OAuth2UserInfo;


@Service
public class PrincipalOauth2UserService extends DefaultOAuth2UserService{
	
	
	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException{
		
		OAuth2User oauth2User = super.loadUser(userRequest);
		//sns 로그인 버튼크릭 -> sns로그인창 -> 로그인 완료 -> code를 리턴(OAuth-Client 라이브러리) -> AccessToekn 요청
		//userRequest 정보 -> loadUser함수 호출 -> sns의 회원 프로필 받음.

		
		//sns 확인요청
		OAuth2UserInfo oAuth2UserInfo = null;
		
		String role = "USER";
		String logTp = "";
		if(userRequest.getClientRegistration().getRegistrationId().equals("naver")) {
			oAuth2UserInfo = new NaverUserInfo((Map)oauth2User.getAttributes().get("response"));
			logTp = "N";
		}else if(userRequest.getClientRegistration().getRegistrationId().equals("google")) {
			System.out.println(oauth2User.getAttributes());
			oAuth2UserInfo = new GoogleUserInfo(oauth2User.getAttributes());
			logTp = "G";
		}else if(userRequest.getClientRegistration().getRegistrationId().equals("kakao")) {
			System.out.println(oauth2User.getAttributes());
			oAuth2UserInfo = new KakaoUserInfo(oauth2User.getAttributes());
			logTp = "K";
		}
		System.out.println("after : " + oAuth2UserInfo.getProvider());
		System.out.println(oAuth2UserInfo.getProvider() + " " + oAuth2UserInfo.getProviderId());

		//restAPI 서버 호출
		Map<String, Object> map = new HashMap<>();
		String provider = oAuth2UserInfo.getProvider();
		String providerId = oAuth2UserInfo.getProviderId();
		String username = provider+ "_" + providerId;
		String email = oAuth2UserInfo.getEmail();
		
		map.put("provider", provider);
		map.put("providerId", providerId);
		map.put("email", email);
		map.put("role", role);
		map.put("logTp", logTp);
		
		 HttpClient client = HttpClientBuilder.create().build(); // HttpClient 생성
	     HttpPost postRequest = new HttpPost("http://localhost/api/account/login/OAuth"); 
	     String jsonBody;
		try {
			jsonBody = new ObjectMapper().writeValueAsString(map);
			// POST 메시지의 Body 설정
			StringEntity input = new StringEntity(jsonBody);
			input.setContentType("application/json");
			postRequest.setEntity(input);
			HttpResponse response = client.execute(postRequest);
			int statusCode = response.getStatusLine().getStatusCode();

            // 응답 본문 확인
            String responseBody = EntityUtils.toString(response.getEntity());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
	     
		
		return new PrincipalDetails(oauth2User.getAttributes(), role);
	}
}

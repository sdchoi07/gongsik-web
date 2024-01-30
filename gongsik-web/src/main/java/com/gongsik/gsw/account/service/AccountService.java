package com.gongsik.gsw.account.service;


import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AccountService {

	public String getAccessToken(String code ,String kakaoApiKey) {
		String access_Token = "";
	    String refresh_Token = "";
	    String reqURL = "https://kauth.kakao.com/oauth/token";

	    try {
	        URL url = new URL(reqURL);

	        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

	        //    POST 요청을 위해 기본값이 false인 setDoOutput을 true로 변경을 해주세요	
	        conn.setRequestProperty("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
	        conn.setDoOutput(true);

	        //    POST 요청에 필요로 요구하는 파라미터 스트림을 통해 전송
	        // BufferedWriter 간단하게 파일을 끊어서 보내기로 토큰값을 받아오기위해 전송

	        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
	        StringBuilder sb = new StringBuilder();
	        sb.append("grant_type=authorization_code");
	        sb.append("&client_id=").append(kakaoApiKey);
	        sb.append("&redirect_uri=").append("http://localhost/account/login/oauth2/code/kakao");
	        sb.append("&code=").append(code);
	        bw.write(sb.toString());
	        bw.flush();

	        //    결과 코드가 200이라면 성공
	        // 여기서 안되는경우가 많이 있어서 필수 확인 !! **
	        int responseCode = conn.getResponseCode();
	        System.out.println("responseCode : " + responseCode + "확인");

	        //    요청을 통해 얻은 JSON타입의 Response 메세지 읽어오기
	        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
	        String line = "";
	        String result = "";

	        while ((line = br.readLine()) != null) {
	            result += line;
	        }

	        ObjectMapper objectMapper = new ObjectMapper();
	        Map<String, Object> jsonMap = objectMapper.readValue(result, new TypeReference<Map<String, Object>>() {
	        });
	        System.out.println("response body : " + result + "결과");


	        String accessToken = (String) jsonMap.get("access_token");
	        String refreshToken = (String) jsonMap.get("refresh_token");
	        String scope = (String) jsonMap.get("scope");
	        
	        log.info("Access Token : " + accessToken);
	        log.info("Refresh Token : " + refreshToken);
	        log.info("Scope : " + scope);
	        access_Token = accessToken;
	        br.close();
	        bw.close();
	    } catch (IOException e) {

	        e.printStackTrace();
	    }
	    return access_Token;
	}

	public Map<String, Object> getUserInfo(String accessToken) {
	    HashMap<String, Object> userInfo = new HashMap<>();
	    String reqUrl = "https://kapi.kakao.com/v2/user/me";
	    System.out.println("userInfo token : " + accessToken);
	    try{
	        URL url = new URL(reqUrl);
	        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
	        conn.setRequestMethod("POST");
	        conn.setRequestProperty("Authorization", "Bearer " + accessToken);
	        conn.setRequestProperty("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

	        int responseCode = conn.getResponseCode();
	        log.info("[KakaoApi.getUserInfo] responseCode : {}",  responseCode);

	        BufferedReader br;
	        if (responseCode >= 200 && responseCode <= 300) {
	            br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
	        } else {
	            br = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
	        }

	        String line = "";
	        StringBuilder responseSb = new StringBuilder();
	        while((line = br.readLine()) != null){
	            responseSb.append(line);
	        }
	        String result = responseSb.toString();
	        log.info("responseBody = {}", result);

	        ObjectMapper objectMapper = new ObjectMapper();
	        Map<String, Object> jsonMap = objectMapper.readValue(result, new TypeReference<Map<String, Object>>() {
	        });
	        
	        
	        Map<String, Object> properties = (Map<String, Object>) jsonMap.get("properties");
	        Map<String, Object> kakao_account = (Map<String, Object>) jsonMap.get("kakao_account");


	        int id = (Integer) jsonMap.get("id");
	        String nickname = properties.get("nickname").toString();
	        String email = kakao_account.get("email").toString();

	        userInfo.put("nickname", nickname);
	        userInfo.put("email", email);

	        br.close();

	    }catch (Exception e){
	        e.printStackTrace();
	    }
	    return userInfo;
	}

}

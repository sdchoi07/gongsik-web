package com.gongsik.gsw.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import com.gongsik.gsw.util.hadler.CustomSuccessHandler;
import com.gongsik.gsw.util.oauth.PrincipalOauth2UserService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	private final AuthenticationFailureHandler customFailureHandler = null;
	//해당 메서드의 리턴되는 오브젝트를 ioC로 등록해줌.
	
	@Autowired
	private PrincipalOauth2UserService principalOauth2UserService;
	
	@Autowired
	private CustomSuccessHandler customSuccessHandler;
	
	@Bean
	public BCryptPasswordEncoder encodePwd() {
		return new BCryptPasswordEncoder();
	}
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http)throws Exception{
		http
		.csrf((csrfConfig) ->
				csrfConfig.disable()
		)
		.headers((headerConfig) ->
				headerConfig.frameOptions(frameOptionsConfig ->
						frameOptionsConfig.disable()
				)
		)
		.authorizeHttpRequests((authorizeRequests) ->
				authorizeRequests
						.requestMatchers("/user/**").authenticated()
						.requestMatchers("/admin/**", "/api/admins/**").hasRole("ADMIN")
						.requestMatchers("/posts/**", "/api/v1/posts/**").hasRole("USER")
						.anyRequest().permitAll()
		)
		.formLogin((formLogin) ->
				formLogin
						.loginPage("/account/join") 
						//.usernameParameter("username2")
						.failureHandler(new CustomAuthFailureHandler())
		)
		.oauth2Login((oauth2Configurer ) ->
						oauth2Configurer 
							   .loginPage("/account/join")
							   .userInfoEndpoint(userInfoEndpoint -> userInfoEndpoint
		                                         .userService(principalOauth2UserService))//1.코드받기(인증)2.엑세스토큰(권한) 3.사용자프로필정보 가져와서 가져온 정보로 회원가입 자동 진행
							   .successHandler(customSuccessHandler)
		);
//		.logout((logoutConfig) ->
//				logoutConfig.logoutSuccessUrl("/") 
//							.logoutSuccessHandler(logoutSuccessHandler)
//							.deleteCookies("Authorization" ,"userId" ,"JSESSIONID", "usrNm")
//							
//		);

	    return http.build();
	}


	

}

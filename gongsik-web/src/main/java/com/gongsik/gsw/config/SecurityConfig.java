package com.gongsik.gsw.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import co.elastic.clients.elasticsearch.security.get_role.Role;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
	//해당 메서드의 리턴되는 오브젝트를 ioC로 등록해줌.
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
						.requestMatchers("/admin/**", "/api/v1/admins/**").hasRole("ADMIN")
						.requestMatchers("/posts/**", "/api/v1/posts/**").hasRole("USER")
						.anyRequest().permitAll()
		)
		.formLogin((formLogin) ->
				formLogin
						.loginPage("/account/login") 
		)
		.logout((logoutConfig) ->
				logoutConfig.logoutSuccessUrl("/") 
		);

	    return http.build();
	}

	
}

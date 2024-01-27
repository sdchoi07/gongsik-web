package com.gongsik.gsw.util.oauth;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.gongsik.gsw.account.entity.AccountEntity;
//시큐리티가 login 주소 요청이 오면 낚아 채서 로그인을 진행시킨다.
//로그인 진행이 완료가 되면 시큐리티 session을 만든다.(Security ContextHolder)
//오브젝트 타입 - > Authentication 타입 객체
//Authentication 안에 User 정보가 있어야함
//User 오브젝트 타입 - > UserDetails 타입 객체
//Security Session -> Authntication -> UserDetails(PrincipalDetails)
public class PrincipalDetails implements OAuth2User{
	

	private Map<String, Object> attributes;
	private String role;

	public PrincipalDetails(Map<String, Object> attributes, String role) {
		this.attributes = attributes;
		this.role = role;
	}
	


	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		Collection<GrantedAuthority> collect = new ArrayList<>();
		if("ADMIN".equals(role)) {
			collect.add(new SimpleGrantedAuthority("ADMIN"));
		}else {
			collect.add(new SimpleGrantedAuthority("USER"));
		}
		
		//collect.add(() -> accountEntity.getUsrRole());
	    return collect;
	}


	@Override
	public Map<String, Object> getAttributes() {
		return attributes;
	}

	@Override
	public String getName() {
		return "sns";
	}

}

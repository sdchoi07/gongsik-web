package com.gongsik.gsw.util.oauth;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

//시큐리티 설정에서 loginProcessingUrl("/api/accunt/login")
///login 요청이 오면 자동으로 UserDetialsService 타입으로 IoC되어있는 loadUserByUsername 함수가실행
import com.gongsik.gsw.account.entity.AccountEntity;
import com.gongsik.gsw.account.repository.AccountRepository;

//@Service
//public class PrincipalService implements UserDetailsService {
//
////    @Autowired
////    private AccountRepository accountRepository;
////
////
////    @Override
////    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
////        Optional<AccountEntity> accountEntity = accountRepository.findByUsrId(username);
////
////        if (accountEntity.isPresent()) {
////            AccountEntity result = accountEntity.get();
////            return new PrincipalDetails(result);
////        }
////
////        throw new UsernameNotFoundException("해당 계정으로 로그인 실패: " + username);
////    }
//}

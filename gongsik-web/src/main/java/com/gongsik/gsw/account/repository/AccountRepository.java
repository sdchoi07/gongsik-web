package com.gongsik.gsw.account.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gongsik.gsw.account.entity.AccountEntity;


@Repository
public interface AccountRepository extends JpaRepository<AccountEntity, String>{

	Optional<AccountEntity> findByUsrId(String AccountMultiKey);

	long countByUsrId(String usrId);



}


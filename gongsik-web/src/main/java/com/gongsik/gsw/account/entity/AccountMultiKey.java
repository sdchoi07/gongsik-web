package com.gongsik.gsw.account.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Data
public class AccountMultiKey implements Serializable{
	@Column(name = "USR_ID")
	private String usrId;
	@Column(name= "USR_NO")
	private String usrNo;
}

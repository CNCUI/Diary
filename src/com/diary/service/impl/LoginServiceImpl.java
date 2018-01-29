package com.diary.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.diary.dao.ILoginDao;
import com.diary.service.ILoginService;

@Service
public class LoginServiceImpl implements ILoginService{

	@Autowired
	private ILoginDao ILoginDao;
	@Override
	public void login() {
		ILoginDao.login();
	}
	@Override
	public List<Map> login(Map map) {
		return ILoginDao.login(map);
	}
	

}

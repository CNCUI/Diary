package com.diary.dao.impl;

import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.context.support.FileSystemXmlApplicationContext;
import org.springframework.stereotype.Repository;

import com.diary.dao.ILoginDao;

@Repository
public class LoginDaoImpl extends ComDao implements ILoginDao{
	
	@Override
	public void login() {
		System.out.println("loginnnnnnnnnnnn");
	}

	@Override
	public List<Map> login(Map map) {
		System.out.println("µÇÂ½");
		List<Map> c = getSqlSession().selectList("UserMapper.login",map);
//		this.template.selectOne("UserMapper.login", map);
		return c;
	}
	
	
	
}

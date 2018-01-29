package com.diary.dao.impl;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class ComDao {
	
	static ApplicationContext ac = new ClassPathXmlApplicationContext("applicationContext.xml");
	static SqlSessionTemplate template = (SqlSessionTemplate) ac.getBean("sqlSession");
	public static SqlSessionTemplate getSqlSession(){
		if(template == null){
			 template = (SqlSessionTemplate) ac.getBean("sqlSession");
		}
		return template;
	}

}

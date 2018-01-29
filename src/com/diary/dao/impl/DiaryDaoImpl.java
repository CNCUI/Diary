package com.diary.dao.impl;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;

import com.diary.dao.DiaryDao;
import com.diary.entity.Diary;
import com.diary.util.Pager;

public class DiaryDaoImpl implements DiaryDao {

	protected SqlSessionTemplate template;
	
	
	public SqlSessionTemplate getTemplate() {
		return template;
	}

	public void setTemplate(SqlSessionTemplate template) {
		this.template = template;
	}

	@Override
	public int addDiary(Diary diary) {
		
		return this.template.insert("com.diary.dao.DiaryDao.addDiary", diary);
	}

	@Override
	public List<Diary> findAll() {
		
		return this.template.selectList("com.diary.dao.DiaryDao.findAll");
	}

	@Override
	public Diary findOne(Diary diary) {
		
		return this.template.selectOne("com.diary.dao.DiaryDao.findOne", diary);
	}

	@Override
	public int update(Diary diary) {
		return this.template.update("com.diary.dao.DiaryDao.update", diary);
	}

	@Override
	public int del(Diary diary) {
		return this.template.delete("com.diary.dao.DiaryDao.del", diary);
	}

	@Override
	public List<Diary> findAllPage(int pageSize, int startRow) {
		Pager pager = new Pager();
		pager.setPagesize(pageSize);
		pager.setStartRows(startRow);
		return this.template.selectList("com.diary.dao.DiaryDao.findAllPage", pager);
	}

}

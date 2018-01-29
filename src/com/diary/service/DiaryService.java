package com.diary.service;

import java.util.List;

import com.diary.dao.DiaryDao;
import com.diary.entity.Diary;

public class DiaryService {
	
	private DiaryDao diaryDao;

	public DiaryDao getDiaryDao() {
		return diaryDao;
	}

	public void setDiaryDao(DiaryDao diaryDao) {
		this.diaryDao = diaryDao;
	}
	/**
	 * 新增日记
	 * @param diary
	 * @return
	 */
	public int addDiary(Diary diary){
		return this.diaryDao.addDiary(diary);
	}
	
	/**
	 * 查询所有日记
	 * @return
	 */
	public List<Diary> findAll(){
		return this.diaryDao.findAll();
	}
	
	/**
	 * 查找单个日记
	 * @param diary
	 * @return
	 */
	public Diary findOne(Diary diary){
		return this.diaryDao.findOne(diary);
	}
	/**
	 * 修改日记
	 * @param diary
	 * @return
	 */
	public int update(Diary diary){
		return this.diaryDao.update(diary);
	}
	
	/**
	 * 删除日记
	 * @param diary
	 * @return
	 */
	public int del(Diary diary){
		return this.diaryDao.del(diary);
	}
	
	/**
	 * 分页搜索
	 * @param pageSize
	 * @param startRow
	 * @return
	 */
	public List<Diary> findAllPage(int pageSize, int startRow){
		return this.diaryDao.findAllPage(pageSize, startRow);
	}
}

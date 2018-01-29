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
	 * �����ռ�
	 * @param diary
	 * @return
	 */
	public int addDiary(Diary diary){
		return this.diaryDao.addDiary(diary);
	}
	
	/**
	 * ��ѯ�����ռ�
	 * @return
	 */
	public List<Diary> findAll(){
		return this.diaryDao.findAll();
	}
	
	/**
	 * ���ҵ����ռ�
	 * @param diary
	 * @return
	 */
	public Diary findOne(Diary diary){
		return this.diaryDao.findOne(diary);
	}
	/**
	 * �޸��ռ�
	 * @param diary
	 * @return
	 */
	public int update(Diary diary){
		return this.diaryDao.update(diary);
	}
	
	/**
	 * ɾ���ռ�
	 * @param diary
	 * @return
	 */
	public int del(Diary diary){
		return this.diaryDao.del(diary);
	}
	
	/**
	 * ��ҳ����
	 * @param pageSize
	 * @param startRow
	 * @return
	 */
	public List<Diary> findAllPage(int pageSize, int startRow){
		return this.diaryDao.findAllPage(pageSize, startRow);
	}
}

package com.diary.dao;

import java.util.List;

import com.diary.entity.Diary;

public interface DiaryDao {
	/**
	 * �����ռ�
	 * @param diary
	 * @return
	 */
	public int addDiary(Diary diary);
	
	/**
	 * ��ѯ�����ռ�
	 * @return
	 */
	public List<Diary> findAll();
	
	/**
	 * ��ҳ����
	 * @param pageSize
	 * @param startRow
	 * @return
	 */
	public List<Diary> findAllPage(int pageSize, int startRow);
	
	/**
	 * ���ҵ����ռ�
	 * @param diary
	 * @return
	 */
	public Diary findOne(Diary diary);
	
	/**
	 * �޸��ռ�
	 * @param diary
	 * @return
	 */
	public int update(Diary diary);
	
	/**
	 * ɾ���ռ�
	 * @param diary
	 * @return
	 */
	public int del(Diary diary);
}

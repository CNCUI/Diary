package com.diary.dao;

import java.util.List;

import com.diary.entity.Diary;

public interface DiaryDao {
	/**
	 * 新增日记
	 * @param diary
	 * @return
	 */
	public int addDiary(Diary diary);
	
	/**
	 * 查询所有日记
	 * @return
	 */
	public List<Diary> findAll();
	
	/**
	 * 分页搜索
	 * @param pageSize
	 * @param startRow
	 * @return
	 */
	public List<Diary> findAllPage(int pageSize, int startRow);
	
	/**
	 * 查找单个日记
	 * @param diary
	 * @return
	 */
	public Diary findOne(Diary diary);
	
	/**
	 * 修改日记
	 * @param diary
	 * @return
	 */
	public int update(Diary diary);
	
	/**
	 * 删除日记
	 * @param diary
	 * @return
	 */
	public int del(Diary diary);
}

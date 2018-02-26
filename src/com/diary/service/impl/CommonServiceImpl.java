package com.diary.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.diary.base.IResult;
import com.diary.base.PageListResult;
import com.diary.base.Result;
import com.diary.dao.CommonDao;
import com.diary.service.CommonService;

@Service
public class CommonServiceImpl implements CommonService{
	@Autowired
	private CommonDao commonDao;

	@Override
	public List findUserPageList(Map<String, Object> map) {
		return commonDao.findUserPageList(map);
	}

	@Override
	public PageListResult findUserPageList(int page, int rows,
			Map<String, Object> map) {
		return new PageListResult(commonDao.findPageList(page, rows, map));
	}

	@Override
	public IResult saveUser(Map<String, String> map) {
		IResult rs = new Result();
		int i = commonDao.saveUser(map);
		rs.setSuccess(i>0);
		return rs;
	}

	@Override
	public IResult updateUser(Map<String, String> map) {
		IResult rs = new Result();
		int i = commonDao.updateUser(map);
		rs.setSuccess(i>0);
		return rs;
	}

	@Override
	public IResult deleteUser(Map<String, Object> map) {
		IResult rs = new Result();
		int i = commonDao.deleteUser(map);
		rs.setSuccess(i>0);
		return rs;
	}

	@Override
	public List<Map<String, Object>> findUser(Map<String, String> qmap) {
		return commonDao.findUser(qmap);
	}
	
	@Override
	public PageListResult findOrderPageList(int page, int rows,
			Map<String, Object> map) {
		return new PageListResult(commonDao.findOrderPageList(page, rows, map));
	}

	@Override
	public PageListResult findFoodPageList(int page, int rows,
			Map<String, Object> map) {
		return new PageListResult(commonDao.findFoodPageList(page, rows, map));
	}

	@Override
	public PageListResult findMyOrderList(int page, int rows,
			Map<String, Object> map) {
		return new PageListResult(commonDao.findMyOrderList(page, rows, map));
	}

	@Override
	public PageListResult findTypePageList(int page, int rows,
			Map<String, Object> map) {
		return new PageListResult(commonDao.findTypePageList(page, rows, map));
	}

	@Override
	public PageListResult findFoodManegePageList(int page, int rows, Map<String, Object> map) {
		return new PageListResult(commonDao.findFoodManegePageList(page, rows, map));
	}

	@Override
	public IResult addType(Map<String, Object> map) {
		IResult rs = new Result();
		int i = commonDao.addType(map);
		rs.setSuccess(i>0);
		return rs;
	}

	@Override
	public IResult updateType(Map<String, Object> map) {
		IResult rs = new Result();
		int i = commonDao.updateType(map);
		rs.setSuccess(i>0);
		return rs;
	}

	@Override
	public List<Map<String, Object>> findType(Map<String, Object> map) {
		return commonDao.findType(map);
	}

	@Override
	public IResult delType(Map<String, Object> map) {
		IResult rs = new Result();
		int i = commonDao.delType(map);
		rs.setSuccess(i>0);
		return rs;
	}

	@Override
	public List<Map<String, Object>> findFood(Map<String, Object> qmap) {
		return commonDao.findFood(qmap);
	}

	@Override
	public IResult addFood(Map<String, Object> map) {
		IResult rs = new Result();
		int i = commonDao.addFood(map);
		rs.setSuccess(i>0);
		return rs;
	}

	@Override
	public IResult updateFood(Map<String, Object> map) {
		IResult rs = new Result();
		int i = commonDao.updateFood(map);
		rs.setSuccess(i>0);
		return rs;
	}

	@Override
	public IResult delFood(Map<String, Object> map) {
		IResult rs = new Result();
		int i = commonDao.delFood(map);
		rs.setSuccess(i>0);
		return rs;
	}

	@Override
	public IResult updateOrderState(Map<String, Object> map) {
		IResult rs = new Result();
		int i = commonDao.updateOrderState(map);
		rs.setSuccess(i>0);
		return rs;
	}

	@Override
	public IResult delOrder(Map<String, Object> map) {
		IResult rs = new Result();
		int i = commonDao.delOrder(map);
		rs.setSuccess(i>0);
		return rs;
	}

	@Override
	public IResult updatePassword(Map<String, String> map) {
		IResult rs = new Result();
		int i = commonDao.updatePassword(map);
		rs.setSuccess(i>0);
		return rs;
	}

	@Override
	public IResult saveOrderFood(Map<String, String> savemap) {
		IResult rs = new Result();
		int i = commonDao.saveOrderFood(savemap);
		rs.setSuccess(i>0);
		return rs;
	}

	@Override
	public IResult saveOrdering(Map<String, Object> savemap2) {
		IResult rs = new Result();
		int i = commonDao.saveOrdering(savemap2);
		rs.setSuccess(i>0);
		return rs;
	}

	@Override
	public PageListResult frontOrderList(int page, int rows, Map<String, String> map) {
		return new PageListResult(commonDao.frontOrderList(page, rows, map));
	}

	@Override
	public Map<String, Object> updateMm(Map<String, String> updateMm) {
		Map<String, Object> rs = new HashMap<String, Object>();
		int i = commonDao.updateMm(updateMm);
		rs.put("success", i>0);
		return rs;
	}

	@Override
	public Map<String, Object> getUserInfoById(Map<String, Object> param) {
		return commonDao.getUserInfoById(param);
	}

	@Override
	public Map<String, Object> updateInfo(Map<String, String> param) {
		Map<String, Object> rs = new HashMap<String, Object>();
		int i = commonDao.updateInfo(param);
		rs.put("success", i>0);
		return rs;
	}

	

}

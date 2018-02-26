package com.diary.dao.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.diary.base.PageTools;
import com.diary.dao.CommonDao;

@Repository
public class CommonDaoImpl extends ComDao implements CommonDao{

	@Override
	public List findUserPageList(Map<String, Object> map) {
		System.out.println("≤È—Ø”√ªß");
		List c = getSqlSession().selectList("UserMapper.findUserPageList",map);
		return c;
	}

	@Override
	public PageTools findPageList(int pageno, int pagesize, Map<String, Object> bean) {
		List list = getSqlSession().selectList("UserMapper.findUserPageList",bean);
		int size = list.size();
		int index = (pageno-1)*pagesize;
		List d = list.subList(index, (index+pagesize)>size?size:(index+pagesize));
		return new PageTools(pageno,pagesize,size,d);
	}

	@Override
	public int saveUser(Map<String, String> map) {
		return getSqlSession().insert("UserMapper.saveUser", map);
	}

	@Override
	public int updateUser(Map<String, String> map) {
		return getSqlSession().update("UserMapper.updateUser", map);
	}

	@Override
	public int deleteUser(Map<String, Object> map) {
		return getSqlSession().delete("UserMapper.deleteUser", map);
	}

	@Override
	public List<Map<String, Object>> findUser(Map<String, String> qmap) {
		return getSqlSession().selectList("UserMapper.findUser", qmap);
	}
	
	@Override
	public PageTools findOrderPageList(int pageno, int pagesize, Map<String, Object> bean) {
		List list = getSqlSession().selectList("UserMapper.findOrderPageList",bean);
		int size = list.size();
		int index = (pageno-1)*pagesize;
		List d = list.subList(index, (index+pagesize)>size?size:(index+pagesize));
		return new PageTools(pageno,pagesize,size,d);
	}
	@Override
	public PageTools findTypePageList(int page, int rows, Map<String, Object> map) {
		List list = getSqlSession().selectList("UserMapper.findTypePageList",map);
		int size = list.size();
		int index = (page-1)*rows;
		List d = list.subList(index, (index+rows)>size?size:(index+rows));
		return new PageTools(page,rows,size,d);
	}
	
	

	@Override
	public PageTools findFoodPageList(int pageno, int pagesize, Map<String, Object> bean) {
		List list = getSqlSession().selectList("UserMapper.findFoodPageList",bean);
		int size = list.size();
		int index = (pageno-1)*pagesize;
		List d = list.subList(index, (index+pagesize)>size?size:(index+pagesize));
		return new PageTools(pageno,pagesize,size,d);
	}

	@Override
	public PageTools findMyOrderList(int page, int rows, Map<String, Object> map) {
		List list = getSqlSession().selectList("UserMapper.findMyOrderList",map);
		int size = list.size();
		int index = (page-1)*rows;
		List d = list.subList(index, (index+rows)>size?size:(index+rows));
		return new PageTools(page,rows,size,d);
	}

	@Override
	public PageTools findFoodManegePageList(int page, int rows, Map<String, Object> map) {
		List list = getSqlSession().selectList("UserMapper.findFoodManegePageList",map);
		int size = list.size();
		int index = (page-1)*rows;
		List d = list.subList(index, (index+rows)>size?size:(index+rows));
		return new PageTools(page,rows,size,d);
	}

	@Override
	public int addType(Map<String, Object> map) {
		return getSqlSession().insert("UserMapper.addType", map);
	}

	@Override
	public int updateType(Map<String, Object> map) {
		return getSqlSession().update("UserMapper.updateType", map);
	}

	@Override
	public List<Map<String, Object>> findType(Map<String, Object> map) {
		return getSqlSession().selectList("UserMapper.findType", map);
	}

	@Override
	public int delType(Map<String, Object> map) {
		return getSqlSession().delete("UserMapper.delType", map);
	}

	@Override
	public List<Map<String, Object>> findFood(Map<String, Object> qmap) {
		return getSqlSession().selectList("FoodMapper.findFood", qmap);
	}

	@Override
	public int addFood(Map<String, Object> map) {
		return getSqlSession().insert("FoodMapper.addFood", map);
	}

	@Override
	public int updateFood(Map<String, Object> map) {
		return getSqlSession().update("FoodMapper.updateFood", map);
	}

	@Override
	public int delFood(Map<String, Object> map) {
		return getSqlSession().delete("FoodMapper.delFood", map);
	}

	@Override
	public int updateOrderState(Map<String, Object> map) {
		return getSqlSession().update("UserMapper.updateOrderState", map);
	}

	@Override
	public int delOrder(Map<String, Object> map) {
		return getSqlSession().delete("UserMapper.delOrder", map);
	}

	@Override
	public int updatePassword(Map<String, String> map) {
		return getSqlSession().update("UserMapper.updatePassword", map);
	}

	@Override
	public int saveOrderFood(Map<String, String> savemap) {
		return getSqlSession().insert("FoodMapper.saveOrderFood", savemap);
	}

	@Override
	public int saveOrdering(Map<String, Object> savemap2) {
		return getSqlSession().insert("FoodMapper.saveOrdering", savemap2);
	}

	@Override
	public PageTools frontOrderList(int page, int rows, Map<String, String> map) {
		List list = getSqlSession().selectList("FoodMapper.frontOrderList",map);
		int size = list.size();
		int index = (page-1)*rows;
		List d = list.subList(index, (index+rows)>size?size:(index+rows));
		return new PageTools(page,rows,size,d);
	}

	@Override
	public int updateMm(Map<String, String> updateMm) {
		return getSqlSession().update("UserMapper.updateMm", updateMm);
	}

	@Override
	public Map<String, Object> getUserInfoById(Map<String, Object> param) {
		return getSqlSession().selectOne("UserMapper.getUserInfoById", param);
	}

	@Override
	public int updateInfo(Map<String, String> param) {
		return getSqlSession().update("UserMapper.updateInfo", param);
	}






}

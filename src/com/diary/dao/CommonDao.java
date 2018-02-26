package com.diary.dao;

import java.util.List;
import java.util.Map;

import com.diary.base.IResult;
import com.diary.base.PageTools;

public interface CommonDao {

	List findUserPageList(Map<String, Object> map);

	PageTools findPageList(int page, int rows, Map<String, Object> map);

	int saveUser(Map<String, String> map);

	int updateUser(Map<String, String> map);

	int deleteUser(Map<String, Object> map);
	
	List<Map<String, Object>> findUser(Map<String, String> qmap);

	PageTools findOrderPageList(int page, int rows, Map<String, Object> map);

	PageTools findFoodPageList(int page, int rows, Map<String, Object> map);

	PageTools findMyOrderList(int page, int rows, Map<String, Object> map);

	PageTools findTypePageList(int page, int rows, Map<String, Object> map);

	PageTools findFoodManegePageList(int page, int rows, Map<String, Object> map);

	int addType(Map<String, Object> map);

	int updateType(Map<String, Object> map);

	List<Map<String, Object>> findType(Map<String, Object> map);

	int delType(Map<String, Object> map);

	List<Map<String, Object>> findFood(Map<String, Object> qmap);

	int addFood(Map<String, Object> map);

	int updateFood(Map<String, Object> map);

	int delFood(Map<String, Object> map);

	int updateOrderState(Map<String, Object> map);

	int delOrder(Map<String, Object> map);

	int updatePassword(Map<String, String> map);

	int saveOrderFood(Map<String, String> savemap);

	int saveOrdering(Map<String, Object> savemap2);

	PageTools frontOrderList(int page, int rows, Map<String, String> map);

	int updateMm(Map<String, String> updateMm);

	Map<String, Object> getUserInfoById(Map<String, Object> param);

	int updateInfo(Map<String, String> param);

	


}

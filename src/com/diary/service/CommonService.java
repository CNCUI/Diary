package com.diary.service;

import java.util.List;
import java.util.Map;

import com.diary.base.IResult;
import com.diary.base.ListResult;
import com.diary.base.PageListResult;

public interface CommonService {

	List findUserPageList(Map<String, Object> map);

	PageListResult findUserPageList(int page, int rows, Map<String, Object> map);

	IResult saveUser(Map<String, String> map);

	IResult updateUser(Map<String, String> map);

	IResult deleteUser(Map<String, Object> map);
	
	List<Map<String, Object>> findUser(Map<String, String> qmap);

	PageListResult findOrderPageList(int page, int rows, Map<String, Object> map);

	PageListResult findFoodPageList(int page, int rows, Map<String, Object> map);

	PageListResult findMyOrderList(int page, int rows, Map<String, Object> map);

	PageListResult findTypePageList(int page, int rows, Map<String, Object> map);

	PageListResult findFoodManegePageList(int page, int rows,Map<String, Object> map);

	IResult addType(Map<String, Object> map);

	IResult updateType(Map<String, Object> map);

	List<Map<String, Object>> findType(Map<String, Object> map);

	IResult delType(Map<String, Object> map);

	List<Map<String, Object>> findFood(Map<String, Object> qmap);

	IResult addFood(Map<String, Object> map);

	IResult updateFood(Map<String, Object> map);

	IResult delFood(Map<String, Object> map);

	IResult updateOrderState(Map<String, Object> map);

	IResult delOrder(Map<String, Object> map);

	IResult updatePassword(Map<String, String> map);

	IResult saveOrderFood(Map<String, String> savemap);

	IResult saveOrdering(Map<String, Object> savemap2);

	PageListResult frontOrderList(int page, int rows, Map<String, String> map);

	Map<String, Object> updateMm(Map<String, String> updateMm);

	Map<String, Object> getUserInfoById(Map<String, Object> param);

	Map<String, Object> updateInfo(Map<String, String> param);

	IResult submitPj(Map<String, String> map);

	int commentReply(Map<String, String> map);


}

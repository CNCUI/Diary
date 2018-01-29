package com.diary.util;

import javax.servlet.http.*;

public class PageHelp {

	public PageHelp() {

	}

	public static Pager getPager(HttpServletRequest request, int totalRows) {
		// 定义 Pager 对象用于传到页面
		Pager pager = new Pager(totalRows);// totalRows 数据库里的数据的总行数
		// 获得当前页 currentPage
		String currentPage = request.getParameter("currentPage");
		// 如果当前页（currentPage）为空，则表示首次查询
		// 如果当前页（currentPage）不为空，则刷新 Pager 对象输入当前页号
		if(currentPage==null||currentPage.equals("0")){
			currentPage = "1";
		}
		if (currentPage != null) {
			pager.refersh(Integer.valueOf(currentPage));
		}
		// 获得当前执行的方法 首页，下一页，上一页，尾页
		String pageMethod = request.getParameter("pageMethod");
		if (pageMethod != null) {
			if (pageMethod.equals("first")) {
				pager.first();// 第一页
			} else if (pageMethod.equals("previous")) {
				pager.previous();// 上一页
			} else if (pageMethod.equals("next")) {
				pager.next();// 下一页
			} else if (pageMethod.equals("last")) {
				pager.last();// 尾页
			}
		}
		return pager;
	}

}

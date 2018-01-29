package com.diary.util;

import javax.servlet.http.*;

public class PageHelp {

	public PageHelp() {

	}

	public static Pager getPager(HttpServletRequest request, int totalRows) {
		// ���� Pager �������ڴ���ҳ��
		Pager pager = new Pager(totalRows);// totalRows ���ݿ�������ݵ�������
		// ��õ�ǰҳ currentPage
		String currentPage = request.getParameter("currentPage");
		// �����ǰҳ��currentPage��Ϊ�գ����ʾ�״β�ѯ
		// �����ǰҳ��currentPage����Ϊ�գ���ˢ�� Pager �������뵱ǰҳ��
		if(currentPage==null||currentPage.equals("0")){
			currentPage = "1";
		}
		if (currentPage != null) {
			pager.refersh(Integer.valueOf(currentPage));
		}
		// ��õ�ǰִ�еķ��� ��ҳ����һҳ����һҳ��βҳ
		String pageMethod = request.getParameter("pageMethod");
		if (pageMethod != null) {
			if (pageMethod.equals("first")) {
				pager.first();// ��һҳ
			} else if (pageMethod.equals("previous")) {
				pager.previous();// ��һҳ
			} else if (pageMethod.equals("next")) {
				pager.next();// ��һҳ
			} else if (pageMethod.equals("last")) {
				pager.last();// βҳ
			}
		}
		return pager;
	}

}

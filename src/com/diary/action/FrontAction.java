package com.diary.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.diary.base.AdminAction;
import com.diary.base.DataTablesResult;
import com.diary.base.IResult;
import com.diary.base.Result;
import com.diary.service.CommonService;


@Scope("prototype")
@Controller("com.FrontAction")
public class FrontAction extends AdminAction{
	private static final long serialVersionUID = 1L;
	
	@Autowired
	private CommonService commonService;
	
	public String findFoodPageList(){
		Map<String, Object> map = new HashMap<String, Object>(); 
        map.putAll(getParameters());
        List list = commonService.findUserPageList(map);
        DataTablesResult dt = new DataTablesResult(commonService.findFoodPageList(getPage(), getRows(), map), getDraw());
        return renderResult(dt);
	}
	
	
	public String findMyOrderList(){
		Map<String, Object> map = new HashMap<String, Object>(); 
        map.putAll(getParameters());
        List list = commonService.findUserPageList(map);
        DataTablesResult dt = new DataTablesResult(commonService.findMyOrderList(getPage(), getRows(), map), getDraw());
        return renderResult(dt);
	}
	
	public String add1(){
		IResult rs = new Result();
		boolean flag = false;
		Cookie[] cookies = getRequest().getCookies();
		for(Cookie cookie : cookies){
			if("vvvvvvvvip".equals(cookie.getName())){
				flag = true;
				String value = String.valueOf(Integer.parseInt(cookie.getValue())+1);
				cookie.setValue(value);
				getResponse().addCookie(cookie);
			}
		}
		if(!flag){
			Cookie cookie1 = new Cookie("vvvvvvvvip", "1");
			getResponse().addCookie(cookie1);
		}
		
		showCookie();
		return renderResult(rs);
	}
	public void showCookie(){
		Cookie[] cookies = getRequest().getCookies();
		for(Cookie cookie : cookies){
			System.out.print(cookie.getName());
			System.out.println(cookie.getValue());
		}
	}
	public String del1(){
		IResult rs = new Result();
		Cookie[] cookies = getRequest().getCookies();
		for(Cookie cookie : cookies){
			if("vvvvvvvvip".equals(cookie.getName())){
				String value = String.valueOf(Integer.parseInt(cookie.getValue())-1);
				cookie.setValue(value);
				getResponse().addCookie(cookie);
			}
		}
		showCookie();
		return renderResult(rs);
	}
}

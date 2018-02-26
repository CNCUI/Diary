package com.diary.action;

import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;

import org.omg.CORBA.Request;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import sun.reflect.ReflectionFactory.GetReflectionFactoryAction;

import com.diary.base.BaseAction;
import com.diary.base.HttpSession;
import com.diary.base.SessionUtils;
import com.diary.base.SysSession;
import com.diary.service.CommonService;
import com.diary.service.ILoginService;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Scope("prototype")
@Controller("com.loginAction")
public class loginAction extends BaseAction{
	private static final long serialVersionUID = 1L;
	private static javax.servlet.http.HttpSession session;
	@Autowired
	private ILoginService LoginService;
	@Autowired
	private CommonService commonService;
	public String init(){
//		LoginService.login();
		return SUCCESS;
	}
	
	/**
	 * 登陆
	 * @return
	 */
	public String login(){
		Map<String,String> map = new HashMap<String,String>();
		map.putAll(getParameters());
		List<Map> c = LoginService.login(map);
		if(c.size()>0){
			ActionContext act = ActionContext.getContext();
			act.getSession().put("userId", c.get(0).get("id"));
			return SUCCESS;
		}else{
			getRequest().setAttribute("mmcw", "用户名或密码错误");
			return "login";
		}
	}
			
	public String logOut(){
		ActionContext act = ActionContext.getContext();
		act.getSession().remove("userId");
		return "login";
	}
	
	public String frontLogin(){
		Map<String,Object> result = new HashMap<String,Object>();
		Map<String,String> map = new HashMap<String,String>();
		map.putAll(getParameters());
		List<Map> c = LoginService.login(map);
		if(c.size()>0){
			ActionContext act = ActionContext.getContext();
			act.getSession().put("front_userId", c.get(0).get("id"));
			result.put("success", true);
			result.put("data", c.get(0));
		}else{
			result.put("success", false);
		}
		return renderJson(JSONObject.fromObject(result).toString());
	}
	
	public String isLogin(){
		Map<String,Object> result = new HashMap<String,Object>();
		ActionContext act = ActionContext.getContext();
		String userid = String.valueOf(act.getSession().get("front_userId"));
		if(!"null".equals(userid) && userid != null){
			Map<String, String> qmap = new HashMap<String, String>();
	        qmap.put("userid", userid);
	        List<Map<String,Object>> list = commonService.findUser(qmap);
			result.put("success", true);
			result.put("data", list.get(0));
		}else{
			result.put("success", false);
		}
		return renderJson(JSONObject.fromObject(result).toString());
	}
		
	public void frontlogout(){
		ActionContext act = ActionContext.getContext();
		act.getSession().remove("front_userId");
		
		Cookie[] cookies = getRequest().getCookies();
		for(Cookie cookie : cookies){
			if("vvvvvvvvip".equals(cookie.getName())){
				cookie.setValue("");
				cookie.setMaxAge(0);
				getResponse().addCookie(cookie);
			}
		}
	}
			
}

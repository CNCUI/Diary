package com.diary.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.omg.CORBA.Request;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import sun.reflect.ReflectionFactory.GetReflectionFactoryAction;

import com.diary.base.BaseAction;
import com.diary.base.HttpSession;
import com.diary.base.SessionUtils;
import com.diary.base.SysSession;
import com.diary.service.ILoginService;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;

@Scope("prototype")
@Controller("com.loginAction")
public class loginAction extends BaseAction{
	private static final long serialVersionUID = 1L;
	private static javax.servlet.http.HttpSession session;
	@Autowired
	private ILoginService LoginService;
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
}

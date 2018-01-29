package com.diary.interceptor;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.struts2.ServletActionContext;
import org.springframework.stereotype.Service;

import com.diary.base.SessionUtils;
import com.diary.base.SysSession;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.I18nInterceptor;

@Service("weixin.WxInterceptor")
public class Sysinterceptor extends I18nInterceptor {
	private static final long serialVersionUID = 1L;
	
	@Override
	public String intercept(ActionInvocation arg0) throws Exception {
		HttpServletRequest request = (HttpServletRequest) arg0.getInvocationContext().get(ServletActionContext.HTTP_REQUEST);
		HttpServletResponse response = (HttpServletResponse) arg0.getInvocationContext().get(ServletActionContext.HTTP_RESPONSE);
		
		ActionContext act = ActionContext.getContext();
		Map session = act.getSession();
		String result = null;
		if (session.get("userId") == null){
			String contentpath = request.getContextPath();
			String uri = request.getRequestURI();
			if (!"".equals(contentpath)) {
				uri = uri.replaceFirst(contentpath, "");
			}
			session.put("backurl", uri + "?" + request.getQueryString());
			return "transfer";
		}
		try{
			result = arg0.invoke();
		}catch(Exception e){
			e.printStackTrace();
			result = "wxerror";
		}
		
		return result;
	}

}


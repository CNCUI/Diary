package com.diary.action;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONObject;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.diary.base.BaseAction;

public class BaseController extends BaseAction{
	private Integer sEcho;
	private Integer iDisplayStart;
	private Integer iDisplayLength;
	private String order;
	private List<Map<String,Object>> list;;
	
	public BaseController(){
		
	}
	public String getDataTable(List list){
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("sEcho", getsEcho());  
        map.put("iTotalRecords", list.size());//数据总条�?  
        map.put("iTotalDisplayRecords", list.size());//显示的条�?  
        map.put("aData", list.subList(getiDisplayStart(), (getiDisplayStart()+getiDisplayLength()) >= list.size() ? list.size() : (getiDisplayStart()+getiDisplayLength())));//数据集合
        return JSONObject.fromObject(map).toString();
	}
	public Integer getsEcho() {
		return Integer.valueOf(getRequest().getParameter("sEcho")) + 1;
	}
	public void setsEcho(Integer sEcho) {
		this.sEcho = sEcho;
	}
	public Integer getiDisplayStart() {
		return Integer.valueOf(getRequest().getParameter("iDisplayStart"));
	}
	public void setiDisplayStart(Integer iDisplayStart) {
		this.iDisplayStart = iDisplayStart;
	}
	public Integer getiDisplayLength() {
		return Integer.valueOf(getRequest().getParameter("iDisplayLength"));
	}
	public void setiDisplayLength(Integer iDisplayLength) {
		this.iDisplayLength = iDisplayLength;
	}
	
	public String getOrder() {
		return order;
	}
	public void setOrder(String order) {
		this.order = order;
	}
//	public HttpServletRequest getRequest()
//	{
//		return ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();  
//	}
	
//	public  Map<String, String> getParameters()
//	{
//	     Map objs = new HashMap();
//	     Map em = getRequest().getParameterMap();
//	     Iterator e = em.entrySet().iterator();
//	     while (e.hasNext()) {
//	       Map.Entry name = (Map.Entry)e.next();
//	 
//	       StringBuilder vs = new StringBuilder();
//	 
//	       boolean isfirst = true;
//	       for (int i = 0; i < ((String[])name.getValue()).length; i++) {
//	         if (((String[])name.getValue())[i] != null) {
//	           if (!isfirst) {
//	             vs.append(",");
//	           }
//	           vs.append(((String[])name.getValue())[i]);
//	           isfirst = false;
//	         }
//	       }
//	       objs.put((String)name.getKey(), vs.toString());
//	     }
//	     return objs;
//	   }
}

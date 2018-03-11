package com.diary.action;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.Cookie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.diary.base.AdminAction;
import com.diary.base.DataTablesResult;
import com.diary.base.IResult;
import com.diary.base.Result;
import com.diary.service.CommonService;
import com.opensymphony.xwork2.ActionContext;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;


@Scope("prototype")
@Controller("com.FrontAction")
public class FrontAction extends AdminAction{
	private static final long serialVersionUID = 1L;
	
	@Autowired
	private CommonService commonService;
	
	public String getFoodList(){
		return "foodList";
	}
	
	
	
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
	
	public String add1() throws UnsupportedEncodingException{
		Map<String, String> map = getParameters();
		JSONObject j1 = JSONObject.fromObject(map);
		j1.put("name", URLEncoder.encode(j1.getString("name"),"UTF-8"));
		System.out.println(j1);
		
		JSONObject rs = new JSONObject();
		boolean flag = false;
		Cookie[] cookies = getRequest().getCookies();
		for(Cookie cookie : cookies){
			if("vvvvvvvvip".equals(cookie.getName())){
				flag = true;
				
				boolean c1 = true;
				JSONArray jr2 = JSONArray.fromObject(cookie.getValue());
				for(Object obj : jr2){
					JSONObject j2 = (JSONObject)obj;
					if(j1.get("id").equals(j2.get("id"))){
						j2.put("num", j1.get("num"));
						j2.put("name", j1.get("name"));
						j2.put("price", j1.get("price"));
						c1 = false;
					}
				}
				if(c1){
					jr2.add(j1);
				}
				String value = jr2.toString();
				cookie.setValue(value);
				getResponse().addCookie(cookie);
			}
		}
		if(!flag){
			JSONArray jr1 = new JSONArray();
			jr1.add(j1);
			Cookie cookie1 = new Cookie("vvvvvvvvip", jr1.toString());
			getResponse().addCookie(cookie1);
		}
		Cookie[] c = getRequest().getCookies();
		for(Cookie cookie : cookies){
			if("vvvvvvvvip".equals(cookie.getName())){
				JSONArray jr3 = JSONArray.fromObject(cookie.getValue());
				rs.put("data", jr3);
				
			}
		}
		System.out.println(c);
		return renderJson(rs.toString());
	}
	public String showCookie() throws UnsupportedEncodingException{
		JSONObject rs = new JSONObject();
		Cookie[] cookies = getRequest().getCookies();
		for(Cookie cookie : cookies){
			if("vvvvvvvvip".equals(cookie.getName())){
				JSONArray jr3 = JSONArray.fromObject(cookie.getValue());
				for(Object obj : jr3){
					JSONObject j4 = (JSONObject)obj;
					j4.put("name", URLDecoder.decode(j4.getString("name"),"UTF-8"));
				}
				rs.put("data", jr3);
				
			}
		}
		return renderJson(rs.toString());
	}
	public String cleanCookie(){
		IResult rs = new Result();
		Cookie[] cookies = getRequest().getCookies();
		for(Cookie cookie : cookies){
			if("vvvvvvvvip".equals(cookie.getName())){
				cookie.setValue("");
				cookie.setMaxAge(0);
				getResponse().addCookie(cookie);
			}
		}
		rs.setSuccess(true);
		return renderResult(rs);
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
		return renderResult(rs);
	}
	
	public String submitOrder(){
		IResult rs = new Result();
		
		Map<String,Object> result = new HashMap<String,Object>();
		ActionContext act = ActionContext.getContext();
		String userid = String.valueOf(act.getSession().get("front_userId"));
		//未登陆则需要登陆
		if("null".equals(userid) || userid == null){
			result.put("success", false);
			result.put("message", "请先登陆！");
			return renderJson(JSONObject.fromObject(result).toString());
		}
		//增加订单
		String uuid = UUID.randomUUID().toString().replaceAll("-", "");
		String remark = "";
		String orderaddress = "";
		int numprice = 0;
		Map<String,String> map = getParameters();
		JSONArray jr = JSONArray.fromObject(map.get("param"));
		for(Object obj : jr){
			JSONObject json = (JSONObject)obj;
			String id = json.getString("id");
			String name = json.getString("name");
			String num = json.getString("num");
			String price = json.getString("price");
			numprice = numprice + Integer.parseInt(price);
			
			Map<String,String> savemap = new HashMap<String,String>();
			savemap.put("order_id", uuid);
			savemap.put("food_id", id);
			savemap.put("num", num);
			rs = commonService.saveOrderFood(savemap);
			
			remark = json.getString("remark");
			orderaddress = json.getString("orderaddress");
		}
		
		Map<String,Object> savemap2 = new HashMap<String,Object>();
		savemap2.put("id", uuid);
		savemap2.put("num", "A"+System.currentTimeMillis());
		savemap2.put("sumprice", String.valueOf(numprice));
		
		savemap2.put("user_id", userid);
		
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("userid", userid);
		result = commonService.getUserInfoById(param);
		
		savemap2.put("state", "0");
		savemap2.put("user_name",result.get("realname"));
		savemap2.put("phone", result.get("phone"));
		savemap2.put("address", orderaddress);
		savemap2.put("remarks", remark);
		rs = commonService.saveOrdering(savemap2);

		System.out.println(rs);
		 return renderResult(rs);
	}
	
	public String frontregister(){
		IResult rs = new Result();
		Map<String, String> map = new HashMap<String, String>(); 
        map.putAll(getParameters());
        Map<String, String> qmap = new HashMap<String, String>();
        qmap.put("username", map.get("username"));
        List<Map<String,Object>> list = commonService.findUser(qmap);
        if(list.size() > 0){
        	rs.setMessage("添加失败，请检查用户名是否重复");
        	return renderResult(rs);
        }
        rs = commonService.saveUser(map);
        if(rs.getSuccess()){
        	rs.setMessage("添加成功");
        }else{
        	rs.setMessage("添加失败");
        }
        return renderResult(rs);
	}
	
	public String todayOrderInit(){
		return "todayOrderInit";
	}
	public String historyOrderInit(){
		return "historyOrderInit";
	}
	
	public String todayOrderList(){
		Map<String, Object> result = new HashMap<String, Object>();
		Map<String, String> map = new HashMap<String, String>();
		String front_userId = checkLo();
		if("".equals(front_userId)){
			result.put("success", false);
			result.put("message", "请先登陆！");
			return renderJson(JSONObject.fromObject(result).toString());
		}
		map.put("front_userId", front_userId);
		map.put("tody", "yes");
		DataTablesResult dt = new DataTablesResult(commonService.frontOrderList(getPage(), getRows(), map), getDraw());
        return renderResult(dt);
	}
	public String historyOrderList(){
		Map<String, Object> result = new HashMap<String, Object>();
		Map<String, String> map = new HashMap<String, String>();
		String front_userId = checkLo();
		if("".equals(front_userId)){
			result.put("success", false);
			result.put("message", "请先登陆！");
			return renderJson(JSONObject.fromObject(result).toString());
		}
		map.put("front_userId", front_userId);
		DataTablesResult dt = new DataTablesResult(commonService.frontOrderList(getPage(), getRows(), map), getDraw());
        return renderResult(dt);
	}
	public String checkLo(){
		ActionContext act = ActionContext.getContext();
		String userid = String.valueOf(act.getSession().get("front_userId"));
		//未登陆则需要登陆
		if("null".equals(userid) || userid == null){
			return "";
		}
		return userid;
	}
	
	
	public String updateMmInit(){
		return "updateMmInit";
	}
	public String updateInfoInit(){
		return "updateInfoInit";
	}
	//front updatemm
	public String updateMm(){
		Map<String, Object> result = new HashMap<String, Object>();
		ActionContext act = ActionContext.getContext();
		String front_userId = String.valueOf(act.getSession().get("front_userId"));
		if("null".equals(front_userId)){
			result.put("success", false);
			result.put("message", "请先登陆！");
			return renderJson(JSONObject.fromObject(result).toString());
		}
		Map<String, String> qmap = new HashMap<String, String>();
        qmap.put("userid", front_userId);
        qmap.put("ymm", getParameters().get("ymm"));
        List<Map<String,Object>> list = commonService.findUser(qmap);
		if(list.size() > 0){
			Map<String, String> updateMm = new HashMap<String, String>();
			updateMm.put("userid", front_userId);
			updateMm.put("password", getParameters().get("xmm"));
			result = commonService.updateMm(updateMm);
			result.put("message", "修改成功！");
			return renderJson(JSONObject.fromObject(result).toString());
		}else{
			result.put("success", false);
			result.put("message", "原密码不正确！");
			return renderJson(JSONObject.fromObject(result).toString());
		}
        
	}
	
	public String getUserInfoById(){
		Map<String, Object> result = new HashMap<String, Object>();
		ActionContext act = ActionContext.getContext();
		String front_userId = String.valueOf(act.getSession().get("front_userId"));
		if("null".equals(front_userId)){
			result.put("success", false);
			result.put("message", "请先登陆！");
			return renderJson(JSONObject.fromObject(result).toString());
		}
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("userid", front_userId);
		result = commonService.getUserInfoById(param);
		result.put("success", true);
		return renderJson(JSONObject.fromObject(result).toString());
	}
	public String updateInfo(){
		Map<String, Object> result = new HashMap<String, Object>();
		Map<String, String> param = getParameters();
		result = commonService.updateInfo(param);
		result.put("success", true);
		return renderJson(JSONObject.fromObject(result).toString());
	}
	
	public String findTypePageList(){
		Map<String, Object> map = new HashMap<String, Object>(); 
        map.putAll(getParameters());
        DataTablesResult dt = new DataTablesResult(commonService.findTypePageList(getPage(), getRows(), map), getDraw());
        return renderResult(dt);
	}
	
	
	public String submitPj(){
		IResult rs = new Result();
		Map<String, String> map = getParameters();
		ActionContext act = ActionContext.getContext();
		String front_userId = String.valueOf(act.getSession().get("front_userId"));
		map.put("user_id", map.get("front_userId"));
		rs = commonService.submitPj(map);
		return renderResult(rs);
	}
}

package com.diary.action;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;


import com.diary.base.AdminAction;
import com.diary.base.DataTablesResult;
import com.diary.base.IResult;
import com.diary.base.Result;
import com.diary.service.CommonService;
import com.diary.service.ILoginService;
import com.diary.util.Base64SaveToFile;
import com.opensymphony.xwork2.ActionContext;

import net.sf.json.JSONObject;

@Scope("prototype")
@Controller("com.ManagerAction")
public class ManagerAction extends AdminAction{
	private static final long serialVersionUID = 1L;

	@Autowired
	private ILoginService LoginService;
	@Autowired
	private CommonService commonService;
	public String init(){
		System.out.println("��̨��ҳ");
		LoginService.login();
		return SUCCESS;
	}
	
	
	public String user(){
		return "user";
	}
	public String order(){
		return "order";
	}
	public String type(){
		return "type";
	}
	public String food(){
		return "food";
	}
	//��ѯ�û��б�
	public String findUserPageList() throws IOException{
		Map<String, Object> map = new HashMap<String, Object>(); 
        map.putAll(getParameters());
        List list = commonService.findUserPageList(map);
//        return renderJson(getDataTable(list));
        DataTablesResult dt = new DataTablesResult(commonService.findUserPageList(getPage(), getRows(), map), getDraw());
        return renderResult(dt);
//        getResponse().getWriter().write(getDataTable(list));
	}

	public String addUser(){
		IResult rs = new Result();
		Map<String, String> map = new HashMap<String, String>(); 
        map.putAll(getParameters());
        Map<String, String> qmap = new HashMap<String, String>();
        qmap.put("username", map.get("username"));
        List<Map<String,Object>> list = commonService.findUser(qmap);
        if(list.size() > 0){
        	rs.setMessage("���ʧ�ܣ������û����Ƿ��ظ�");
        	return renderResult(rs);
        }
        rs = commonService.saveUser(map);
        if(rs.getSuccess()){
        	rs.setMessage("��ӳɹ�");
        }else{
        	rs.setMessage("���ʧ��");
        }
        return renderResult(rs);
	}

	public String updateUser(){
		IResult rs = new Result();
		Map<String, String> map = new HashMap<String, String>(); 
        map.putAll(getParameters());
        Map<String, String> qmap = new HashMap<String, String>();
        qmap.put("myid", map.get("user_id"));
        qmap.put("username", map.get("username"));
        List<Map<String,Object>> list = commonService.findUser(qmap);
        if(list.size() > 0){
        	rs.setMessage("�޸�ʧ�ܣ��������Ƿ��ظ�");
        	return renderResult(rs);
        }
        rs = commonService.updateUser(map);
        if(rs.getSuccess()){
        	rs.setMessage("�޸ĳɹ�");
        }else{
        	rs.setMessage("�޸�ʧ��");
        }
        return renderResult(rs);
        
	}
	
	public String deleteUser(){
		IResult rs = new Result();
		String type_id = getParameters().get("ids");
		String[] type_ids = type_id.split(",");
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("ids", type_ids);
		rs = commonService.deleteUser(map);
		if(rs.getSuccess()){
			rs.setMessage("ɾ���ɹ�");
        }else{
        	rs.setMessage("ɾ��ʧ��");
        }
		return renderResult(rs);
	}
	
	//��ѯ�����б�
	public String findOrderPageList(){
		Map<String, Object> map = new HashMap<String, Object>(); 
        map.putAll(getParameters());
        List list = commonService.findUserPageList(map);
        DataTablesResult dt = new DataTablesResult(commonService.findOrderPageList(getPage(), getRows(), map), getDraw());
        return renderResult(dt);
		
	}
	//�޸Ķ���״̬
	public String updateOrderState(){
		IResult rs = new Result();
		Map<String, Object> map = new HashMap<String, Object>(); 
        map.putAll(getParameters());//state  order_id
        String type_id = getParameters().get("ids");
		String[] type_ids = type_id.split(",");
		map.put("ids", type_ids);
        rs = commonService.updateOrderState(map);
        if(rs.getSuccess()){
			rs.setMessage("�����ɹ�");
        }else{
        	rs.setMessage("����ʧ��");
        }
		return renderResult(rs);
	}
	//ɾ������
	public String delOrder(){
		IResult rs = new Result();
		String type_id = getParameters().get("ids");
		String[] type_ids = type_id.split(",");
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("ids", type_ids);
		rs = commonService.delOrder(map);
		if(rs.getSuccess()){
			rs.setMessage("ɾ���ɹ�");
        }else{
        	rs.setMessage("ɾ��ʧ��");
        }
		return renderResult(rs);
	}
	//��ѯ��Ʒ����type�б�
	public String findTypePageList(){
		Map<String, Object> map = new HashMap<String, Object>(); 
        map.putAll(getParameters());
        DataTablesResult dt = new DataTablesResult(commonService.findTypePageList(getPage(), getRows(), map), getDraw());
        return renderResult(dt);
	}
	//���ӷ���
	public String addType(){
		IResult rs = new Result();
		Map<String, Object> map = new HashMap<String, Object>(); 
        map.putAll(getParameters());
        Map<String, Object> qmap = new HashMap<String, Object>();
        qmap.put("code", map.get("code"));
        List<Map<String,Object>> list = commonService.findType(qmap);
        if(list.size() > 0){
        	rs.setMessage("���ʧ�ܣ��������Ƿ��ظ�");
        	return renderResult(rs);
        }
        rs = commonService.addType(map);
        if(rs.getSuccess()){
        	rs.setMessage("��ӳɹ�");
        }else{
        	rs.setMessage("���ʧ��");
        }
        return renderResult(rs);
	}
	//�޸ķ���
	public String updateType(){
		IResult rs = new Result();
		Map<String, Object> map = new HashMap<String, Object>(); 
        map.putAll(getParameters());
        Map<String, Object> qmap = new HashMap<String, Object>();
        qmap.put("myid", map.get("type_id"));
        qmap.put("code", map.get("code"));
        List<Map<String,Object>> list = commonService.findType(qmap);
        if(list.size() > 0){
        	rs.setMessage("�޸�ʧ�ܣ��������Ƿ��ظ�");
        	return renderResult(rs);
        }
        rs = commonService.updateType(map);
        if(rs.getSuccess()){
        	rs.setMessage("�޸ĳɹ�");
        }else{
        	rs.setMessage("�޸�ʧ��");
        }
        return renderResult(rs);
	}
	//ɾ������
	public String delType(){
		IResult rs = new Result();
		String type_id = getParameters().get("ids");
		String[] type_ids = type_id.split(",");
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("type_ids", type_ids);
		rs = commonService.delType(map);
		if(rs.getSuccess()){
			rs.setMessage("ɾ���ɹ�");
        }else{
        	rs.setMessage("ɾ��ʧ��");
        }
		return renderResult(rs);
	}
	//��ѯ��Ʒ�б�
	public String findFoodManegePageList(){
		Map<String, Object> map = new HashMap<String, Object>(); 
		map.putAll(getParameters());
		DataTablesResult dt = new DataTablesResult(commonService.findFoodManegePageList(getPage(), getRows(), map), getDraw());
		return renderResult(dt);
	}
	
	//���Ӳ�Ʒ
	public String addFood(){
		IResult rs = new Result();
		Map<String, Object> map = new HashMap<String, Object>(); 
        map.putAll(getParameters());
        Map<String, Object> qmap = new HashMap<String, Object>();
        qmap.put("name", map.get("name"));
        List<Map<String,Object>> list = commonService.findFood(qmap);
        if(list.size() > 0){
        	rs.setMessage("���ʧ�ܣ����������Ƿ��ظ�");
        	return renderResult(rs);
        }
        rs = commonService.addFood(map);
        if(rs.getSuccess()){
        	rs.setMessage("��ӳɹ�");
        }else{
        	rs.setMessage("���ʧ��");
        }
        return renderResult(rs);
	}
	//�޸Ĳ�Ʒ
	public String updateFood(){
		IResult rs = new Result();
		Map<String, Object> map = new HashMap<String, Object>(); 
        map.putAll(getParameters());
        Map<String, Object> qmap = new HashMap<String, Object>();
        qmap.put("myid", map.get("food_id"));
        qmap.put("name", map.get("name"));
        List<Map<String,Object>> list = commonService.findFood(qmap);
        if(list.size() > 0){
        	rs.setMessage("�޸�ʧ�ܣ��������Ƿ��ظ�");
        	return renderResult(rs);
        }
        rs = commonService.updateFood(map);
        if(rs.getSuccess()){
        	rs.setMessage("�޸ĳɹ�");
        }else{
        	rs.setMessage("�޸�ʧ��");
        }
        return renderResult(rs);
	}
	/**
	 * �ϴ�ͼƬ��������
	 * @throws Exception 
	 */
	public String uplodaImg() throws Exception{
		Map<String,String> map = getParameters();
		String path = getRequest().getSession().getServletContext().getRealPath("");
		String sfzimg = map.get("imgstr");
		String file_path_icard = "";
		if(!"".equals(sfzimg)){
			String sfzimgPath =  Base64SaveToFile.GenerateImage(sfzimg.substring(sfzimg.indexOf(",")+1,sfzimg.length()),"",path+Base64SaveToFile.createFolder(getRootPath(),"/Diary/uploadfiles/img/"));
			file_path_icard = sfzimgPath.replace(path, "");
		}
		Map<String,String> remap = new HashMap<String,String>();
		remap.put("imgPath", file_path_icard);
		return renderJson(JSONObject.fromObject(remap).toString());
	}
	//ɾ����Ʒ
	public String delFood(){
		IResult rs = new Result();
		String type_id = getParameters().get("ids");
		String[] type_ids = type_id.split(",");
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("ids", type_ids);
		rs = commonService.delFood(map);
		if(rs.getSuccess()){
			rs.setMessage("ɾ���ɹ�");
        }else{
        	rs.setMessage("ɾ��ʧ��");
        }
		return renderResult(rs);
	}
	
	/**
	 * �޸�����
	 * @return
	 */
	public String updatePassword(){
		IResult rs = new Result();
		ActionContext act = ActionContext.getContext();
		String userId = String.valueOf(act.getSession().get("userId"));
		String username = getParameters().get("username");
		String old_password = getParameters().get("old_password");
		String new_password = getParameters().get("new_password");
		Map<String,String> map = new HashMap<String,String>();
		map.put("username", username);
		map.put("password", old_password);
		List<Map> c = LoginService.login(map);
		if(c.size() > 0){
			Map<String,String> umap = new HashMap<String,String>();
			umap.put("username", username);
			umap.put("password", new_password);
			rs = commonService.updatePassword(map);
		}else{
			rs.setMessage("ԭ�������");
			rs.setSuccess(false);
		}
		return renderResult(rs);
	}
}

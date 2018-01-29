package com.diary.action;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.struts2.ServletActionContext;

import com.diary.entity.Diary;
import com.diary.service.DiaryService;
import com.diary.util.PageHelp;
import com.diary.util.Pager;
import com.opensymphony.xwork2.ActionSupport;
import com.opensymphony.xwork2.ModelDriven;

public class DiaryAction extends ActionSupport implements ModelDriven<Diary> {
	private static final long serialVersionUID = 1L;
	private Diary diary;
	private DiaryService diaryService;
	private List<Diary> diaries;
	private HttpSession session;
	private HttpServletRequest request;
	private Integer totalRows = 0;//总行数
	/**
	 * 新增日记
	 * @return
	 */
	public String addDiary(){
		session = ServletActionContext.getRequest().getSession();
		Date dt=new Date();//当前系统时间
		DateFormat df = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");//设置显示格式
		String nowTime = df.format(dt);//用DateFormat的format()方法在dt中获取并以yyyy/MM/dd HH:mm:ss格式显示
		diary.setCreateTime(nowTime);//设置当前时间
		int res = diaryService.addDiary(diary);
		if(res>=1){
			session.setAttribute("msg", "新增成功");
		}else{
			session.setAttribute("msg", "新增失败");
		}
		return SUCCESS;
	}
	/**
	 * 分页查询日记
	 * @return
	 */
	public String findAll(){
		request = ServletActionContext.getRequest();
		session = request.getSession();
		totalRows = diaryService.findAll().size();
		//通过来获得输入到页面的 Pager对象
		Pager pager = PageHelp.getPager(request, totalRows);
		diaries = diaryService.findAllPage(pager.getPagesize(), pager.getStartRows());
		if(diaries.size()>0){
			session.setAttribute("diaries", diaries);
			session.setAttribute("pager", pager);//返回分页对象
		}
		return SUCCESS;
	}
	/**
	 * 查询单个日记
	 * @return
	 */
	public String findOne(){
		session = ServletActionContext.getRequest().getSession();
		Diary d = new Diary();
		d = diaryService.findOne(diary);
		session.setAttribute("d", d);
		return SUCCESS;
	}
	/**
	 * 查询单个日记
	 * @return
	 */
	public String updateFindOne(){
		session = ServletActionContext.getRequest().getSession();
		Diary d = new Diary();
		d = diaryService.findOne(diary);
		session.setAttribute("dd", d);
		return SUCCESS;
	}
	/**
	 * 修改日记
	 * @return
	 */
	public String update(){
		session = ServletActionContext.getRequest().getSession();
	/*	Date dt=new Date();//当前系统时间
		DateFormat df = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");//设置显示格式
		String nowTime = df.format(dt);//用DateFormat的format()方法在dt中获取并以yyyy/MM/dd HH:mm:ss格式显示
		diary.setCreateTime(nowTime);//设置当前时间
*/		int res = diaryService.update(diary);
		if(res>=1){
			session.setAttribute("msg", "修改成功");
		}else{
			session.setAttribute("msg", "修改失败");
		}
		return SUCCESS;
	}
	
	/**
	 * 删除日记
	 * @return
	 */
	public String del(){
		session = ServletActionContext.getRequest().getSession();
		int res = diaryService.del(diary);
		int all = diaryService.findAll().size();
		if(all>1){
			if(res>=1){
				session.setAttribute("msg", "删除成功");
			}else{
				session.setAttribute("msg", "删除失败");
			}
		}else{
			session.setAttribute("msg", "删除失败");
		}
		return SUCCESS;
	}
	
	public List<Diary> getDiaries() {
		return diaries;
	}

	public void setDiaries(List<Diary> diaries) {
		this.diaries = diaries;
	}

	public Diary getDiary() {
		return diary;
	}

	public void setDiary(Diary diary) {
		this.diary = diary;
	}

	public DiaryService getDiaryService() {
		return diaryService;
	}

	public void setDiaryService(DiaryService diaryService) {
		this.diaryService = diaryService;
	}
	
	public Integer getTotalRows() {
		return totalRows;
	}
	public void setTotalRows(Integer totalRows) {
		this.totalRows = totalRows;
	}
	@Override
	public Diary getModel() {
		if(diary==null){
			diary = new Diary();
		}
		return diary;
	}

}

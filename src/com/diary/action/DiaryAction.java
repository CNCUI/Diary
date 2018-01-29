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
	private Integer totalRows = 0;//������
	/**
	 * �����ռ�
	 * @return
	 */
	public String addDiary(){
		session = ServletActionContext.getRequest().getSession();
		Date dt=new Date();//��ǰϵͳʱ��
		DateFormat df = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");//������ʾ��ʽ
		String nowTime = df.format(dt);//��DateFormat��format()������dt�л�ȡ����yyyy/MM/dd HH:mm:ss��ʽ��ʾ
		diary.setCreateTime(nowTime);//���õ�ǰʱ��
		int res = diaryService.addDiary(diary);
		if(res>=1){
			session.setAttribute("msg", "�����ɹ�");
		}else{
			session.setAttribute("msg", "����ʧ��");
		}
		return SUCCESS;
	}
	/**
	 * ��ҳ��ѯ�ռ�
	 * @return
	 */
	public String findAll(){
		request = ServletActionContext.getRequest();
		session = request.getSession();
		totalRows = diaryService.findAll().size();
		//ͨ����������뵽ҳ��� Pager����
		Pager pager = PageHelp.getPager(request, totalRows);
		diaries = diaryService.findAllPage(pager.getPagesize(), pager.getStartRows());
		if(diaries.size()>0){
			session.setAttribute("diaries", diaries);
			session.setAttribute("pager", pager);//���ط�ҳ����
		}
		return SUCCESS;
	}
	/**
	 * ��ѯ�����ռ�
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
	 * ��ѯ�����ռ�
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
	 * �޸��ռ�
	 * @return
	 */
	public String update(){
		session = ServletActionContext.getRequest().getSession();
	/*	Date dt=new Date();//��ǰϵͳʱ��
		DateFormat df = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");//������ʾ��ʽ
		String nowTime = df.format(dt);//��DateFormat��format()������dt�л�ȡ����yyyy/MM/dd HH:mm:ss��ʽ��ʾ
		diary.setCreateTime(nowTime);//���õ�ǰʱ��
*/		int res = diaryService.update(diary);
		if(res>=1){
			session.setAttribute("msg", "�޸ĳɹ�");
		}else{
			session.setAttribute("msg", "�޸�ʧ��");
		}
		return SUCCESS;
	}
	
	/**
	 * ɾ���ռ�
	 * @return
	 */
	public String del(){
		session = ServletActionContext.getRequest().getSession();
		int res = diaryService.del(diary);
		int all = diaryService.findAll().size();
		if(all>1){
			if(res>=1){
				session.setAttribute("msg", "ɾ���ɹ�");
			}else{
				session.setAttribute("msg", "ɾ��ʧ��");
			}
		}else{
			session.setAttribute("msg", "ɾ��ʧ��");
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

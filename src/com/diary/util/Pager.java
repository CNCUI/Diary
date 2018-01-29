package com.diary.util;

public class Pager {
	
	private int totalRows;// ����������
	private int pagesize=9;//ÿҳ��ʾ ���� ������
	private int currentPage;//��ǰΪ�ڼ�ҳ
	private int startRows;//��ǰҳ�����ݿ��е���ʼ�� 
	private int totalPages;//�ܹ���ʾ����ҳ����
	private Object object;//����
	public Object getObject() {
		return object;
	}
	public void setObject(Object object) {
		this.object = object;
	}
	public int getCurrentPage() {
		return currentPage;
	}
	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;	
	}
	public int getPagesize() {
		return pagesize;
	}
	public void setPagesize(int pagesize) {
		this.pagesize = pagesize;
	}
	public int getStartRows() {
		return startRows;
	}
	public void setStartRows(int startRows) {
		this.startRows = startRows;
	}
	public int getTotalPages() {
		return totalPages;
	}
	public void setTotalPages(int totalPages) {
		this.totalPages = totalPages;
	}
	public int getTotalRows() {
		return totalRows;
	}
	public void setTotalRows(int totalRows) {
		this.totalRows = totalRows;
	}
	
	public Pager(){
		
	}
	
	/**
	 * ��ʼ������
	 *
	 */
	public Pager(int _totalRows){
		this.totalRows=_totalRows;//���ݿ����ܹ��ж���������
		this.totalPages=this.totalRows/pagesize;//�ܹ�Ҫ��ʾ����ҳ
		int mod=this.totalRows%pagesize;
		if(mod>0){
			 totalPages++;//Ҫ��ʾ��ҳ����һҳ
		}
		this.currentPage=1;//��ǰΪ��һҳ
		this.startRows=0;//�����ݿ��еĵ�һ�п�ʼ������
	}
	
	/**
	 * ��һ ҳ
	 *
	 */
	public void first(){
		this.currentPage=1;//��ǰΪ��һҳ
		this.startRows=0;//�����ݿ�ĵ� 0 �п�ʼ��ȡ
	}
	
	/**
	 * ��һҳ
	 *
	 */
	public void previous(){
		if(currentPage==1){//�����ǰΪ��һҳ�ͷ���,����� --
			return;
		}
		currentPage--;
		startRows=(currentPage-1)*pagesize;
		//���Ϊ�� 1 ҳ(1-1)*pagesize ��Ϊ 0��������ݿ�ĵ� 0  �����ݿ�ʼ��ȡ
		//���Ϊ�� 2 ҳ(2-1)*pagesize ��Ϊ 1��������ݿ�ĵ� 5  �����ݿ�ʼ��ȡ
	}
	
	/**
	 * ��һҳ
	 *
	 */
	public void next(){
		if(currentPage<totalPages){
			currentPage++;//�����ǰҳС���ܹ�Ҫ��ʾ��ҳ������ǰҳ�������һҳ
		}
		startRows=(currentPage-1)*pagesize;
		//���Ϊ�� 1 ҳ(1-1)*pagesize ��Ϊ 0��������ݿ�ĵ� 0  �����ݿ�ʼ��ȡ
		//���Ϊ�� 2 ҳ(2-1)*pagesize ��Ϊ 1��������ݿ�ĵ� 5  �����ݿ�ʼ��ȡ
	}
	
	/**
	 * ���һҳ
	 *
	 */
	public void last(){
		currentPage=totalPages;
		startRows=(currentPage-1)*pagesize;
	}
	
	/**
	 * ˢ��
	 *
	 */
	public void refersh(int _currentPage){
		this.currentPage=_currentPage;
		if(currentPage>totalPages){
			this.last();
		}
	}
}

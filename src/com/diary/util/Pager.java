package com.diary.util;

public class Pager {
	
	private int totalRows;// 数据总行数
	private int pagesize=9;//每页显示 多少 条数据
	private int currentPage;//当前为第几页
	private int startRows;//当前页在数据库中的起始行 
	private int totalPages;//总共显示多少页数据
	private Object object;//参数
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
	 * 初始化参数
	 *
	 */
	public Pager(int _totalRows){
		this.totalRows=_totalRows;//数据库中总共有多少条数据
		this.totalPages=this.totalRows/pagesize;//总共要显示多少页
		int mod=this.totalRows%pagesize;
		if(mod>0){
			 totalPages++;//要显示的页数加一页
		}
		this.currentPage=1;//当前为第一页
		this.startRows=0;//从数据库中的第一行开始读数据
	}
	
	/**
	 * 第一 页
	 *
	 */
	public void first(){
		this.currentPage=1;//当前为第一页
		this.startRows=0;//从数据库的第 0 行开始读取
	}
	
	/**
	 * 上一页
	 *
	 */
	public void previous(){
		if(currentPage==1){//如果当前为第一页就返回,否则就 --
			return;
		}
		currentPage--;
		startRows=(currentPage-1)*pagesize;
		//如果为第 1 页(1-1)*pagesize 就为 0，则从数据库的第 0  条数据开始读取
		//如果为第 2 页(2-1)*pagesize 就为 1，则从数据库的第 5  条数据开始读取
	}
	
	/**
	 * 下一页
	 *
	 */
	public void next(){
		if(currentPage<totalPages){
			currentPage++;//如果当前页小于总共要显示的页数，则当前页往下面加一页
		}
		startRows=(currentPage-1)*pagesize;
		//如果为第 1 页(1-1)*pagesize 就为 0，则从数据库的第 0  条数据开始读取
		//如果为第 2 页(2-1)*pagesize 就为 1，则从数据库的第 5  条数据开始读取
	}
	
	/**
	 * 最后一页
	 *
	 */
	public void last(){
		currentPage=totalPages;
		startRows=(currentPage-1)*pagesize;
	}
	
	/**
	 * 刷新
	 *
	 */
	public void refersh(int _currentPage){
		this.currentPage=_currentPage;
		if(currentPage>totalPages){
			this.last();
		}
	}
}

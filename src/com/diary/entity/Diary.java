package com.diary.entity;
/**
 * 日记
 * @author Fcy
 *
 */
public class Diary {
	private Integer id;//编号
	private String title;//标题
	private String content;//内容
	private String createTime;//创建时间
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	public Diary(Integer id, String title, String content, String createTime) {
		super();
		this.id = id;
		this.title = title;
		this.content = content;
		this.createTime = createTime;
	}
	public Diary() {
		super();
	}
}

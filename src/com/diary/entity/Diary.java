package com.diary.entity;
/**
 * �ռ�
 * @author Fcy
 *
 */
public class Diary {
	private Integer id;//���
	private String title;//����
	private String content;//����
	private String createTime;//����ʱ��
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

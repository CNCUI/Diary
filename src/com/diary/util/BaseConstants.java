package com.diary.util;

public enum BaseConstants {
	START(0,"0","��ʼ"),
	ACCEPT(1,"1","����"),
	REFUSE(2,"2","�ܾ�");
	int num;
	String value;
	String descri;
	BaseConstants(int n,String val,String des){
		num = n;
		value = val;
		descri = des;
	}
	public String getValue(){
		return value;
	}

}

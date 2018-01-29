package com.diary.util;

public enum BaseConstants {
	START(0,"0","≥ı º"),
	ACCEPT(1,"1","Ω” ’"),
	REFUSE(2,"2","æ‹æ¯");
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

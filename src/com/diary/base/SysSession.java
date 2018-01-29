package com.diary.base;

public abstract interface SysSession
{
  public static final String TOKEN = "token";

  public abstract <T> T get(String paramString);

  public abstract void put(String paramString, Object paramObject);

  public abstract String getSessionID();

  public abstract void clear();
}

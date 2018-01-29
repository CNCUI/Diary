package com.diary.base;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public abstract interface SysSessionUtil
{
  public abstract SysSession getSession(HttpServletRequest paramHttpServletRequest, HttpServletResponse paramHttpServletResponse);

  public abstract SysSession getSession(HttpServletRequest paramHttpServletRequest, String paramString);
}

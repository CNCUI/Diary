package com.diary.base;

import java.util.UUID;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public final class SessionUtils
{
  public static final int SESSION_OUTTIME = 30;

  public static final String SESSIONCLASS = "com.diary.base.HttpSession";

  private static volatile SysSessionUtil sysSession = null;

  public static SysSessionUtil getSessionUtils()
  {
    try
    {
      if (sysSession == null)
        synchronized (SysSessionUtil.class) {
          if (sysSession == null) {
            Class c = Class.forName(SESSIONCLASS);
            sysSession = (SysSessionUtil)c.newInstance();
          }
        }
    }
    catch (Exception e) {
      e.printStackTrace();
    }
    return sysSession;
  }

  public static String getSessionID(HttpServletRequest request, HttpServletResponse response)
  {
    CookieUtils cu = CookieUtils.getCookieUtils(request, response);
    String token = cu.getCookieValue("token");

    if (token == null) {
      token = request.getHeader("Authorization");
    }
    if (token == null) {
      token = UUID.randomUUID().toString();
      setSessionID(cu, token);
    }

    return token;
  }

  public static void setSessionID(HttpServletRequest request, HttpServletResponse response, String token) {
    CookieUtils cu = CookieUtils.getCookieUtils(request, response);
    setSessionID(cu, token);
  }

  public static void setSessionID(CookieUtils cu, String token) {
    cu.addCookie("token", token, true);
  }

  public static String newSessionID(HttpServletRequest request, HttpServletResponse response)
  {
    String token = UUID.randomUUID().toString();
    CookieUtils cu = CookieUtils.getCookieUtils(request, response);
    cu.addCookie("token", token);
    return token;
  }
}


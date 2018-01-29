package com.diary.base;

import com.opensymphony.xwork2.ActionContext;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CookieUtils
{
  protected static Logger log = LoggerFactory.getLogger(CookieUtils.class);

  private static final String DOMAIN = "";

  private static final int TIME = 0;

  private static final boolean SECURE = false;

  private HttpServletRequest request = null;
  private HttpServletResponse response = null;
  private Map<String, String> cookieMAP = null;
  public static final String CSRF_COOKIE = "CSRF_COOKIE";

  private CookieUtils(HttpServletRequest rq, HttpServletResponse rs)
  {
    this.request = rq;
    this.response = rs;
    if (getCookieMap() == null) {
      this.cookieMAP = new HashMap();
      Cookie[] cookies = this.request.getCookies();
      if (cookies != null) {
        for (Cookie cookie : cookies) {
          this.cookieMAP.put(cookie.getName(), cookie.getValue());
        }
      }

      if (ActionContext.getContext() != null)
      {
        ActionContext.getContext().put("cookieHolder", this.cookieMAP);
      }
    }
  }

  private Map<String, String> getCookieMap()
  {
    if (ActionContext.getContext() != null)
      return (Map)ActionContext.getContext().get("cookieHolder");
    return this.cookieMAP;
  }

  public static CookieUtils getCookieUtils(HttpServletRequest rq, HttpServletResponse rs)
  {
    return new CookieUtils(rq, rs);
  }

  public String getCookieValue(String name)
  {
    if (getCookieMap().containsKey(name)) {
      return (String)getCookieMap().get(name);
    }
    return null;
  }

  public void addCookie(String name, String value)
  {
    addCookie(name, value, TIME, false);
  }

  public void addCookie(String name, String value, boolean httpOnly)
  {
    addCookie(name, value, TIME, httpOnly);
  }

  private String getPath() {
    if (TrigSysProperty.getContentPath() == null || "".equals(TrigSysProperty.getContentPath())) {
      return "/";
    }
    return TrigSysProperty.getContentPath();
  }

  public void addCookie(String name, String value, int time, boolean httpOnly)
  {
    Cookie cookie = new Cookie(name, value);
    cookie.setPath(getPath());

    if (DOMAIN != null) {
      cookie.setDomain(DOMAIN);
    }

    cookie.setSecure(SECURE);
    if ((httpOnly) && (TrigSysProperty.getServletVersion() > 2)) {
      cookie.setHttpOnly(true);
    }

    if (time > 0) {
      cookie.setMaxAge(time * 60);
    }
    this.response.addCookie(cookie);
    getCookieMap().put(name, value);
  }

  public void delCookie(String name)
  {
    Cookie cookie = new Cookie(name, "");
    cookie.setPath(getPath());

    if (DOMAIN != null) {
      cookie.setDomain(DOMAIN);
    }

    cookie.setSecure(SECURE);

    cookie.setMaxAge(0);
    this.response.addCookie(cookie);
    getCookieMap().remove(name);
  }

  public Map<String, String> getCookies()
  {
    return getCookieMap();
  }

  public static String randomToken()
  {
    return UUID.randomUUID().toString();
  }

  public void addCsrfCookie(String val, SysSession session)
  {
    addCookie("CSRF_COOKIE", val, true);
  }
}


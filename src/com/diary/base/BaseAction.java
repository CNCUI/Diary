package com.diary.base;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.LocaleProvider;
import com.opensymphony.xwork2.TextProvider;
import com.opensymphony.xwork2.TextProviderFactory;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.struts2.ServletActionContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class BaseAction
  implements LocaleProvider
{
  protected Logger log = LoggerFactory.getLogger(getClass());
  public static final String ERROR = "error";
  public static final String SUCCESS = "success";
  private JsonUtil.ResultType rt = JsonUtil.ResultType.JOSN;

  private String jsonpcall = "JSONP";

  private String result = "success";
  private String msg;
  private transient TextProvider textProvider;

  public String getSessionID()
  {
    return SessionUtils.getSessionID(getRequest(), getResponse());
  }

  protected SysSession getSession()
  {
    return SessionUtils.getSessionUtils().getSession(getRequest(), getSessionID());
  }

  public void setRt(JsonUtil.ResultType rt)
  {
    this.rt = rt;
  }

  public String renderResult(IResult rs)
  {
      if (this.rt == JsonUtil.ResultType.JOSN) {
        renderJson(rs.toJsonString());
      } else if (this.rt == JsonUtil.ResultType.XML) {
        renderXML(rs.toXmlString());
      } else if (this.rt == JsonUtil.ResultType.JSONP) {
        render(this.jsonpcall + "(" + rs.toJsonString() + ")", "text/javascript;charset=UTF-8");
      } else {
        getRequest().setAttribute("rs", rs);
        this.msg = rs.getMessage();
        return getResult();
      }
    return null;
  }

  protected Logger getLog()
  {
    return this.log;
  }

  protected String render(String text, String contentType)
  {
    try
    {
      HttpServletResponse response = getResponse();
      response.setContentType(contentType);
      response.getWriter().write(text);
    } catch (IOException e) {
      this.log.error(e.getMessage(), e);
    }
    return null;
  }

  protected String renderText(String text)
  {
    return render(text, "text/plain;charset=UTF-8");
  }

  protected String renderJson(String text)
  {
    render(text, "text/html;charset=UTF-8");
    return null;
  }

  protected String renderHtml(String html)
  {
    return render(html, "text/html;charset=UTF-8");
  }

  protected String renderXML(String xml)
  {
    return render(xml, "text/xml;charset=UTF-8");
  }

  public HttpServletResponse getResponse()
  {
    return ServletActionContext.getResponse();
  }

  public HttpServletRequest getRequest()
  {
    return ServletActionContext.getRequest();
  }

  public Map<String, String> getParameters()
  {
    return getParameters(getRequest());
  }

  public static Map<String, String> getParameters(HttpServletRequest request)
  {
    Map objs = new HashMap();
    Map em = request.getParameterMap();
    Iterator e = em.entrySet().iterator();
    while (e.hasNext()) {
      Map.Entry name = (Map.Entry)e.next();

      StringBuilder vs = new StringBuilder();

      boolean isfirst = true;
      for (int i = 0; i < ((String[])name.getValue()).length; i++) {
        if (((String[])name.getValue())[i] != null) {
          if (!isfirst) {
            vs.append(",");
          }
          vs.append(((String[])name.getValue())[i]);
          isfirst = false;
        }
      }
      objs.put((String)name.getKey(), vs.toString());
    }

    String uid = (String)ServletActionContext.getRequest().getAttribute("ADMIN_USER_ID");
    if (uid != null) {
      objs.put("ADMIN_USER_ID", uid);
    }
    return objs;
  }

  public String getText(String key)
  {
    return getTextProvider().getText(key);
  }

  public String getText(String key, Object[] objs)
  {
    return String.format(getText(key), objs);
  }

  private TextProvider getTextProvider()
  {
    if (this.textProvider == null) {
      TextProviderFactory tpf = new TextProviderFactory();
      this.textProvider = tpf.createInstance(getClass(), this);
    }
    return this.textProvider;
  }

  public Locale getLocale()
  {
    ActionContext ctx = ActionContext.getContext();
    if (ctx != null) {
      return ctx.getLocale();
    }
    if (this.log.isDebugEnabled()) {
      this.log.debug("Action context not initialized");
    }
    return null;
  }

  public String getResult()
  {
    return this.result;
  }

  public void setResult(String result)
  {
    this.result = result;
  }

  public String getJsonpcall()
  {
    return this.jsonpcall;
  }

  public void setJsonpcall(String jsonpcall)
  {
    this.jsonpcall = jsonpcall;
  }

//  public String getClientIp()
//  {
//    return IpUtils.getIp(getRequest());
//  }

  public String getMsg()
  {
    return this.msg;
  }

  public void setMsg(String msg)
  {
    this.msg = msg;
  }
}



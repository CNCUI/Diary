package com.diary.base;

import java.lang.reflect.Method;
import java.util.Map;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

public class AdminAction extends BaseAction
{
  private int page = 1;

  private int rows = SimplePage.DEF_COUNT;
  private String ids;
  private String id;
  private int exptype = 1;

  private int draw = 0;

  public void setExptype(int type)
  {
    this.exptype = type;
  }

  protected int getExptype() {
    return this.exptype;
  }

  public void setPage(int page)
  {
    this.page = page;
  }

  public void setRows(int rows)
  {
    this.rows = rows;
  }

  public int getPage()
  {
    return this.page;
  }

  public int getRows()
  {
    return this.rows;
  }

  public String[] getIds()
  {
    if (this.ids!= null && !"".equals(this.ids))
      return this.ids.split(",");
    return null;
  }

  public void setIds(String ids)
  {
    this.ids = ids;
  }

  public String getId()
  {
	if(this.id == null || "".equals(this.id)){
		return "";
	}else{
		return this.id;
	}
  }

  public void setId(String id)
  {
    this.id = id;
  }



  protected String returnSuccess()
  {
    IResult jr = new Result();
    jr.setSuccess(true);
    return renderResult(jr);
  }

  private String getMethodName(StackTraceElement[] s)
  {
    if (getRequest().getAttribute("ACTION_METHOD") != null) {
      return (String)getRequest().getAttribute("ACTION_METHOD");
    }
    String mn = null;
    Method[] ms = getClass().getMethods();
    for (StackTraceElement e : s) {
      String l = e.getMethodName();
      for (Method method : ms) {
        if (method.getName().equals(l)) {
          mn = l;
          break;
        }
      }
      if (mn != null) {
        break;
      }
    }
    return mn;
  }

  protected String getRootPath()
  {
    return getRequest().getSession().getServletContext().getRealPath("");
  }

  public String renderResult(IResult rs)
  {
    return super.renderResult(rs);
  }

  public String renderListResult(ListResult<? extends Map<String, Object>> rs)
  {
    return super.renderResult(new DataTablesResult(rs, getDraw()));
  }

  public int getDraw() {
    return this.draw;
  }

  public void setDraw(int draw) {
    this.draw = draw;
  }

}


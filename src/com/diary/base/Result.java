package com.diary.base;

import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import oracle.sql.CLOB;

import net.sf.json.JSON;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.xml.XMLSerializer;

public class Result
  implements IResult
{
  private boolean success = false;

  private int errorCode = 0;

  private String message = "";

  public Result()
  {
  }

  public Result(String message) {
    setMessage(message);
  }

  public Result(boolean success) {
    setSuccess(success);
  }

  public Result(int code, boolean success) {
    setErrorCode(code);
    setSuccess(success);
  }

  public boolean getSuccess()
  {
    return this.success;
  }

  public void setSuccess(boolean success)
  {
    this.success = success;
  }

  public int getErrorCode()
  {
    return this.errorCode;
  }

  public void setErrorCode(int errorCode)
  {
    this.errorCode = errorCode;
  }

  public String getMessage()
  {
    return this.message;
  }

  public void setMessage(String message)
  {
    this.message = message;
  }
  public String toJsonString() {
    return toJsonString(this).toString();
  }

  public String toXmlString() {
    return new XMLSerializer().write(toJsonString(this));
  }

  public void removeUserColumn(Map<String, String> uc)
  {
  }

  protected void removeUserColumn(Map<String, String> uc, Map<String, Object> m)
  {
    if ((uc != null) && (m != null)) {
      Iterator e = m.entrySet().iterator();
      while (e.hasNext()) {
        Map.Entry entry = (Map.Entry)e.next();
        if (uc.containsKey(entry.getKey()))
          m.put((String)entry.getKey(), "\u672A\u6388\u6743/NO PRIVLEGE");
      }
    }
  }

  public void setResult(IResult rs)
  {
    this.message = rs.getMessage();
    this.errorCode = rs.getErrorCode();
    this.success = rs.getSuccess();
  }
  
  
  public JSON toJsonString(Object obj) {
	  if (((obj instanceof Collection)) || ((obj instanceof Set))) {
	    JSONArray jsonArray = JSONArray.fromObject(obj);
	    return jsonArray;
	  }
	  return JSONObject.fromObject(obj);
	}
}


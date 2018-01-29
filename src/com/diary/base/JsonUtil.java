package com.diary.base;
import java.sql.Clob;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import javax.servlet.http.HttpServletRequest;
import net.sf.json.JSON;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import oracle.sql.CLOB;

public final class JsonUtil
{
  public static String toJsonString(Object obj)
  {
    return toJson(obj).toString();
  }

  public static JSON toJson(Object obj) {
    if (((obj instanceof Collection)) || ((obj instanceof Set))) {
      JSONArray jsonArray = JSONArray.fromObject(obj);
      return jsonArray;
    }
    return JSONObject.fromObject(obj);
  }

  public static Object toFieldValString(Object val)
  {
//    Object v = null;
//    if (((val instanceof java.util.Date)) || ((val instanceof java.sql.Date)) || 
//      ((val instanceof Timestamp)))
//      v = DateUtils.getDateTimeString((java.util.Date)val);
//    else {
//      v = val;
//    }
//    return v;
	  return null;
  }

  public static Map<String, Object> toJsonMap(Map m)
  {
    Map jmap = new LinkedHashMap();
    Iterator e = m.entrySet().iterator();
    while (e.hasNext()) {
      Map.Entry obj = (Map.Entry)e.next();
      jmap.put(String.valueOf(obj.getKey()), toFieldValString(obj.getValue()));
    }
    return jmap;
  }

  public static String toXMLString(IResult result)
  {
//    return new ResultXmlConverter(result).converter();
	  return null;
  }

  public static ResultType getResultType(HttpServletRequest request) {
    String uri = request.getRequestURI();
    if (uri.endsWith(".xml"))
    {
      return ResultType.XML;
    }if (uri.endsWith(".json"))
    {
      return ResultType.JOSN;
    }if (uri.endsWith(".jsonp"))
    {
      return ResultType.JSONP;
    }
    return ResultType.HTML;
  }

  public static enum ResultType
  {
    JOSN, XML, HTML, JSONP;
  }
}


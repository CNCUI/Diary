//package com.diary.base;
//import java.sql.Clob;
//import java.util.regex.Matcher;
//import java.util.regex.Pattern;
//import net.sf.json.JSONNull;
//
//public final class StringUtils
//{
//  private static final Pattern HTML_PATTERN = Pattern.compile("<[^<^>]+>");
//
//  private static final Pattern SQL_FIELD_PATTERN = Pattern.compile("^[0-9A-Za-z_\\,]{0,100}$");
//
//  private static final Pattern XSS_PATTERN = Pattern.compile("[<>&%\\+]+");
//
//  private static final String SQL_FILTER = Resources.getResources().getText("trig.sql.filter");
//  private static final int CHINA_ASC = 256;
//
//  public static boolean isEmpty(String str)
//  {
//    return (str == null) || (str.equals("")) || (str.equals("undefined")) || (str.equals("null"));
//  }
//  public static boolean isEmpty(Object obj) {
//    if ((obj instanceof String)) {
//      return isEmpty((String)obj);
//    }
//    if ((obj instanceof JSONNull)) {
//      return true;
//    }
//    return obj == null;
//  }
//  public static boolean isEmpty(StringBuilder sb) {
//    return (sb == null) || (sb.toString().equals(""));
//  }
//
//  public static boolean isNotEmpty(String str)
//  {
//    return !isEmpty(str);
//  }
//
//  public static String xssFilter(String value)
//  {
//    StringBuffer result = new StringBuffer(value.length());
//    for (int i = 0; i < value.length(); i++) {
//      char v = value.charAt(i);
//      switch (v) {
//      case '<':
//        result.append("&lt;");
//        break;
//      case '>':
//        result.append("&gt;");
//        break;
//      case '%':
//        result.append("&#37;");
//        break;
//      case '&':
//        result.append("&amp;");
//        break;
//      case '+':
//        result.append("&#43;");
//        break;
//      default:
//        result.append(v);
//      }
//    }
//
//    return result.toString();
//  }
//
//  public static boolean IsXSS(String value)
//  {
//    Matcher matcher = XSS_PATTERN.matcher(value);
//    return matcher.find();
//  }
//
//  public static String sqlReplace(String str)
//  {
//    if (str == null) return "";
//    return str.replaceAll("'", "''").replaceAll(SQL_FILTER, "");
//  }
//
//  public static String sqlReplace(Object obj)
//  {
//    if (obj == null) return "";
//    return sqlReplace(String.valueOf(obj));
//  }
//
//  public static int length(String s)
//  {
//    int count = 0;
//    if ((s != null) && (!s.equals(""))) {
//      int i = 0;
//      for (; i < s.length(); i++) {
//        if (s.codePointAt(i) < 256)
//          count++;
//        else {
//          count += 2;
//        }
//      }
//    }
//    return count;
//  }
//
//  public static String textCut(String s, int len, String append)
//  {
//    if (s == null) {
//      return null;
//    }
//    int slen = s.length();
//    if (slen <= len) {
//      return s;
//    }
//
//    int maxCount = len * 2;
//    int count = 0;
//    int i = 0;
//    for (; (count < maxCount) && (i < slen); i++) {
//      if (s.codePointAt(i) < 256)
//        count++;
//      else {
//        count += 2;
//      }
//    }
//    if (i < slen) {
//      if (count > maxCount) {
//        i--;
//      }
//      if (!org.apache.commons.lang.StringUtils.isBlank(append)) {
//        if (s.codePointAt(i - 1) < 256)
//          i -= 2;
//        else {
//          i--;
//        }
//        return s.substring(0, i) + append;
//      }
//      return s.substring(0, i);
//    }
//
//    return s;
//  }
//
//  public static String htmlCut(String html, int len, String append)
//  {
//    String text = html2Text(html);
//    return textCut(text, len, append);
//  }
//
//  public static String html2Text(String html)
//  {
//    if (html == null) {
//      return "";
//    }
//    String htmlstr = html.replaceAll("&nbsp;", "");
//    Matcher matcher = HTML_PATTERN.matcher(htmlstr);
//    return matcher.replaceAll("");
//  }
//
//  public static String columnToLower(String columnname)
//  {
//    columnname = columnname.toLowerCase();
//    String c = columnname.substring(0, 1).toLowerCase() + columnname.substring(1);
//    while (c.indexOf('_') > -1) {
//      int i = c.indexOf('_');
//      String last = c.substring(i + 1);
//      c = c.substring(0, i);
//
//      c = c + last.substring(0, 1).toUpperCase() + last.substring(1);
//    }
//    return c;
//  }
//
//  public static String tableToLower(String tablename)
//  {
//    tablename = tablename.toLowerCase();
//    String[] cs = tablename.split("_");
//    StringBuilder c = new StringBuilder();
//    c.append(cs[0].charAt(0));
//    if (cs.length > 1) {
//      for (int i = 1; i < cs.length; i++) {
//        c.append(cs[i].charAt(0));
//      }
//    }
//    return c.toString();
//  }
//
//  public static void assertSQLField(String fd) {
//    if (isNotEmpty(fd)) {
//      Matcher matcher = SQL_FIELD_PATTERN.matcher(fd);
//      if (!matcher.find()){
//    	  
//      }
////    	  e.printStackTrace();
//    }
//  }
//
//  public static String getClobString(Clob clob)
//  {
//    String value = "";
//    try {
//      if (clob != null) {
//        int size = (int)clob.length();
//        value = clob.getSubString(1L, size);
//      }
//    } catch (Exception e) {
//    	e.printStackTrace();
//    }
//    return value;
//  }
//
//  public static String split(String[] array, String split) {
//    String s = "";
//    if (array != null) {
//      String[] arrayOfString = array; int j = array.length; for (int i = 0; i < j; i++) { String id = arrayOfString[i];
//        s = s + id + split;
//      }
//    }
//    return s;
//  }
//}
//
//

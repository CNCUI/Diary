package com.diary.base;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public final class Resources
{
  private static Properties rb = null;
  private static volatile Properties jdbc = null;
  private Properties defaultProperty = null;
  private static Map<String, Properties> PMS = new HashMap();
  private static final Resources rs = new Resources();

  private Resources() {
    initDefaultProperty("com/szjx/util/default");
  }

  private Resources(String baseName) {
    initDefaultProperty(baseName);
  }

  public static Resources getResources() {
    return rs;
  }

  public static Resources getResources(String baseName) {
    return new Resources(baseName);
  }

  public String getJdbcText(String key) {
//    if (jdbc == null) {
//      synchronized (Resources.class) {
//        if (jdbc == null) {
//          jdbc = getProperties("jdbc");
//        }
//      }
//    }
//    if (JdbcPropertiesPersist.IS_ENCRY) {
//      return DataSecurityUtil.getDataSecurity().decrypt(JdbcPropertiesPersist.PWD, jdbc.getProperty(key));
//    }
//    return jdbc.getProperty(key);
	  return null;
  }

  private void initDefaultProperty(String baseName)
  {
    rb = getProperties("trig");
    this.defaultProperty = getProperties(baseName);
  }

  private Properties getProperties(String name) {
    Properties p = null;
    if (PMS.containsKey(name))
      p = (Properties)PMS.get(name);
    else {
      try {
        p = new Properties();
        name = name.replaceAll("\\.", "\\/");
        p.load(getClass().getResourceAsStream("/" + name + ".properties"));
        PMS.put(name, p);
      } catch (Exception e) {
        p = null;
      }
    }
    return p;
  }

  public Properties getDefaultProperty()
  {
    return this.defaultProperty;
  }

  public Properties getSysProperty()
  {
    return rb;
  }

  public String getText(String str)
  {
    String r = System.getProperty(str);
    if (r == null) {
      r = (rb != null) && (rb.containsKey(str)) ? rb.getProperty(str) : null;
      if (r == null) {
        r = getDefaultProperty(str);
      }

    }

    return r;
  }

  public boolean getBoolean(String str) {
    if ((str == null) || ("".equals(str))) return false;
    return new Boolean(getText(str)).booleanValue();
  }

  public int getInteger(String str) {
    return new Integer(getText(str)).intValue();
  }

  private String getDefaultProperty(String name)
  {
    return this.defaultProperty.getProperty(name);
  }
}


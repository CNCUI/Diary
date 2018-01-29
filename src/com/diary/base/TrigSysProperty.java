package com.diary.base;

public final class TrigSysProperty
{
  private static String WEB_PATH = null;
  private static String CONTENT_PATH = null;
  private static boolean IS_START = false;
  private static boolean IS_VALIDATE = false;
  private static int ServletVersion = 2;
  private static String UPLOAD_PATH = null;

  public static void setStart(boolean start)
  {
    IS_START = start;
  }

  public static boolean getStart()
  {
    return (IS_START) && (IS_VALIDATE);
  }

  public static void setWebPath(String path)
  {
    WEB_PATH = path;
  }

  public static void setValidate(boolean validate)
  {
    IS_VALIDATE = validate;
  }

  public static String getWebPath() {
    return WEB_PATH;
  }

  public static void setContentPath(String path)
  {
    CONTENT_PATH = path;
  }

  public static String getContentPath() {
    return CONTENT_PATH;
  }

  public static void setServletVersion(int version)
  {
    ServletVersion = version;
  }

  public static int getServletVersion() {
    return ServletVersion;
  }

  public static void setUploadPath(String path)
  {
    UPLOAD_PATH = path;
  }

  public static String getUploadPath() {
    return UPLOAD_PATH == null ? WEB_PATH : UPLOAD_PATH;
  }
}


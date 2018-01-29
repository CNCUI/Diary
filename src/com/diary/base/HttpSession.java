package com.diary.base;

import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class HttpSession
  implements SysSession, SysSessionUtil
 {
   private javax.servlet.http.HttpSession session;
   private String token;
   private Map<String, Object> sessionMap;
 
   public HttpSession()
   {
   }
 
   private HttpSession(HttpServletRequest request, HttpServletResponse response)
   {
     setSession(request);
     init(SessionUtils.getSessionID(request, response));
   }
 
   private HttpSession(HttpServletRequest request, String sessionID) {
     setSession(request);
     init(sessionID);
   }
 
   private void setSession(HttpServletRequest request) {
     this.session = request.getSession(false);
     if (this.session == null)
       this.session = request.getSession();
   }
 
   private void init(String token)
   {
     if (token == null) {
       throw new NullPointerException("token is null");
     }
     this.token = token;
     if (this.session.getAttribute(token) == null) {
       this.sessionMap = new HashMap();
       this.session.setAttribute(token, this.sessionMap);
     } else {
       this.sessionMap = ((Map)this.session.getAttribute(token));
     }
   }
 
   public <T> T get(String key)
   {
     return (T) this.sessionMap.get(key);
   }
 
   public String getSessionID()
   {
     return this.token;
   }
 
   public void put(String key, Object obj)
   {
     this.sessionMap.put(key, obj);
     this.session.setAttribute(this.token, this.sessionMap);
   }
 
   public void clear()
   {
     this.session.removeAttribute(this.token);
   }
 
   public SysSession getSession(HttpServletRequest request, HttpServletResponse response) {
     return new HttpSession(request, response);
   }
 
   public SysSession getSession(HttpServletRequest request, String tokenId) {
     return new HttpSession(request, tokenId);
   }
 
   public void clearAll()
   {
     this.session.invalidate();
   }
 }
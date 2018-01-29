package com.diary.util;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import org.apache.log4j.PropertyConfigurator;

public class Log4jInitServlet extends HttpServlet {  
	  
    private static final long serialVersionUID = 1L;  
  
    public void init() throws ServletException {  
        System.out.println("---path:"+getServletContext().getRealPath("/"));  
        System.setProperty("webappRoot", getServletContext().getRealPath("/"));  
        PropertyConfigurator.configure(getServletContext().getRealPath("/")  
                + getInitParameter("configfile"));  
    }  
}  

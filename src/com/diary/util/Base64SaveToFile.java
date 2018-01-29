package com.diary.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

import sun.misc.BASE64Decoder;

public class Base64SaveToFile {

	/**
	 * 保存base64的图片文件到指定目录
	 * 
	 * @param imgStr
	 * @param baseFileName
	 * @param filePath
	 * @return 文件路径
	 */
	public static String GenerateImage(String imgStr, String baseFileName,
			String filePath) {
		if (imgStr == null)return null; // 图像数据为空
		BASE64Decoder decoder = new BASE64Decoder();
		try {
			// Base64解码
			byte[] b = decoder.decodeBuffer(imgStr);
			for (int i = 0; i < b.length; ++i) {
				if (b[i] < 0) {// 调整异常数据
					b[i] += 256;
				}
			}

			Random random = new Random();
			filePath = filePath + baseFileName + System.currentTimeMillis()
					+ "-" + random.nextInt(10000) + ".jpg";

			OutputStream out = new FileOutputStream(filePath);
			out.write(b);
			out.flush();
			out.close();
		} catch (Exception e) {
			return null;
		}
		return filePath;
	}
	
	/**
	 * 创建本地的文件夹
	 * */
	public static String createFolder(String rootpath,String path) throws Exception{
		File file = new File((rootpath+path).replace("\\", "/"));
		if(!file.exists()&&!file.isDirectory()){
		   file.mkdirs();    
		}
		return path;
	}

}

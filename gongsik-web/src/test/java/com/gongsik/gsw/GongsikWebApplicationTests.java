package com.gongsik.gsw;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
@AutoConfigureMockMvc
@SpringBootTest
class GongsikWebApplicationTests {

		
		@Value("${coolsms.api.key}")
		private String apiKey;
		@Test
		public void spikey() throws Exception{
			System.out.println("test : " + apiKey);
		}
	
}

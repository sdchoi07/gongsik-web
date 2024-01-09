package com.gongsik.gsw;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.web.reactive.function.client.WebClient;
@AutoConfigureMockMvc
@SpringBootTest
class GongsikWebApplicationTests {

		@Autowired
	    private MockMvc mockMvc;
		
		@Autowired
	    private WebTestClient webTestClient;
	 	
	 	@Test
		void contextLoads() throws Exception {
				//testYourWebClientPostRequest();

	 			joinPost();
			
		
		
		}
	    void testYourWebClientPostRequest() {
	        // 여기에 WebClient로 요청하는 코드가 있어야 합니다.
	        // 예를 들어, webClient.post() ... 를 호출하여 서버에 요청하는 코드가 있어야 합니다.
	    	WebClient.Builder webClientBuilder = WebClient.builder().baseUrl("http://localhost:9090");

	        // WebTestClient를 사용하여 요청 및 응답 확인
	    	webClientBuilder.build().post()
	                .uri("/api/account/join/authNoSave")
	                .contentType(MediaType.APPLICATION_JSON)
	                .retrieve()
	                .bodyToFlux(Map.class);
	    }
	    
	    
	    void joinPost() throws Exception {
	    	 mockMvc.perform(MockMvcRequestBuilders.post("/api/account/join/singUp")
	                 .contentType(MediaType.APPLICATION_JSON))
	                 .andExpect(MockMvcResultMatchers.status().isOk())
	                 .andExpect(MockMvcResultMatchers.content().string("This is the response data"));
	     }
	}

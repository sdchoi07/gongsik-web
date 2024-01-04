package com.gongsik.gsw.config;

import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

public class WebClients {
	private WebClient webClient = WebClient.builder().baseUrl("http://localhost:9090").build();
	
	 public <T> Mono<T> callApi(Class<T> responseType, String endpoint) {
	        return webClient.get()
	                .uri(endpoint)
	                .retrieve()
	                .bodyToMono(responseType);
	    }

	    public <T> Mono<T> callApi(Object body, Class<T> responseType, String endpoint) {
	        return webClient.post()
	                .uri(endpoint)
	                .contentType(MediaType.APPLICATION_JSON)
	                .body(BodyInserters.fromValue(body))
	                .retrieve()
	                .bodyToMono(responseType);
	            
	    }
	
}

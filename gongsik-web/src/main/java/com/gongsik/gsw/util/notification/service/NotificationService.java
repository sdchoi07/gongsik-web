package com.gongsik.gsw.util.notification.service;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.gongsik.gsw.util.notification.controller.NotificationController;

@Service
public class NotificationService {
	
//	private final CopyOnWriteArrayList<SseEmitter> emitters = new CopyOnWriteArrayList<>();

	private final Map<String, SseEmitter> emitter = new ConcurrentHashMap<>();

	 // 메시지 알림
    public SseEmitter subscribe(String userId) {
    
        // 1. 현재 클라이언트를 위한 sseEmitter 객체 생성
        SseEmitter sseEmitter = new SseEmitter(Long.MAX_VALUE);
        
        // 2. 연결
        try {
            sseEmitter.send(SseEmitter.event().name("connect").data("connect"));
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 3. 저장
        NotificationController.sseEmitters.put(userId, sseEmitter);
        System.out.println("여기에 오냐뇨 : " + userId);
		// 4. 연결 종료 처리
        sseEmitter.onCompletion(() -> NotificationController.sseEmitters.remove(userId));	// sseEmitter 연결이 완료될 경우
        sseEmitter.onTimeout(() -> NotificationController.sseEmitters.remove(userId));		// sseEmitter 연결에 타임아웃이 발생할 경우
        sseEmitter.onError((e) -> NotificationController.sseEmitters.remove(userId));		// sseEmitter 연결에 오류가 발생할 경우

//        notifyMessage(userId);
        
        return sseEmitter;
    }

    // 채팅 수신 알림 - receiver 에게
    public void notifyMessage(String receiver) {
    	// 5. 수신자 정보 조회
//        User user = userRepository.findByNickname(receiver);

		// 6. 수신자 정보로부터 id 값 추출
//        Long userId = user.getId();
    		
		// 7. Map 에서 userId 로 사용자 검색
        if (NotificationController.sseEmitters.containsKey(receiver)) {		
            SseEmitter sseEmitterReceiver = NotificationController.sseEmitters.get(receiver);
            // 8. 알림 메시지 전송 및 해체
            try {
                sseEmitterReceiver.send(SseEmitter.event().name("addMessage").data("메시지가 왔습니다."));
            } catch (Exception e) {
                NotificationController.sseEmitters.remove(receiver);
            }
        }
    }
    
    // 댓글 알림 - 게시글 작성자 에게
    public void notifyComment(Long postId) {
//        Post post = postRepository.findById(postId).orElseThrow(
//                () -> new IllegalArgumentException("게시글을 찾을 수 없습니다.")
//        );

//        Long userId = post.getUser().getId();

        if (NotificationController.sseEmitters.containsKey(postId)) {
            SseEmitter sseEmitter = NotificationController.sseEmitters.get(postId);
            try {
                sseEmitter.send(SseEmitter.event().name("addComment").data("댓글이 달렸습니다."));
            } catch (Exception e) {
                NotificationController.sseEmitters.remove(postId);
            }
        }
    }
}
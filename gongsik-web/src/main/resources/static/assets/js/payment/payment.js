var IMP = window.IMP;

var init = function() {

	//사용자 정보 가져오기

	_accountInfo();
	//	let result = $('#itemLists').val();
	//result =  result.substring(1, result.length - 1);
	//	var itemArray = JSON.parse(result);

	// 파싱된 객체를 콘솔에 출력

	// 원하는 작업 수행
	// 예를 들어, 각 항목을 순회하며 출력
	//	itemArray.forEach(function(item) {
	//		console.log(item.itemKey + ' - ' + item.itemNm + ' - ' + item.count + ' - ' + item.totalPrice);
	//	});
	$("#usePoint").on("input", function() {
		limitInput();
	});

	IMP.init("imp14751858");


	// 입력 필드에서 포커스가 빠져나갈 때 이벤트 처리
	$("#usePoint").on("blur", function() {
		const inputValue = parseInt($(this).val().replace(/,/g, ''), 10);
		if (!isNaN(inputValue)) {
			const formattedValue = inputValue.toLocaleString();
			$(this).val(formattedValue);
		} else {
			$(this).val('');
		}
	});

	// 입력 필드에서 포커스가 빠져나갈 때 이벤트 처리
	$("#payBtn").on("click", function() {
		requestPay();
	});
	
	$("#paykakaoBtn").on("click", function() {
		paykakaoBtn();
	});


}
function paykakaoBtn() {
	console.log("버튼 클릭함")
	IMP.request_pay({
		pg: "TC0ONETIME",
		pay_method: "card",
		merchant_uid: "ORD20180131-0000011",   // 주문번호
		name: "노르웨이 회전 의자",
		amount: 64900,                         // 숫자 타입
		buyer_email: "gildong@gmail.com",
		buyer_name: "홍길동",
		buyer_tel: "010-4242-4242",
		buyer_addr: "서울특별시 강남구 신사동",
		buyer_postcode: "01181"
	}, function(rsp) { // callback
//		$.ajax({
//			type: 'POST',
//			url: '/verify/' + rsp.imp_uid
//		}).done(function(data) {
//			if (rsp.paid_amount === data.response.amount) {
//				alert("결제 성공");
//			} else {
//				alert("결제 실패");
//			}
//		});
	});
}

function requestPay() {
	console.log("버튼 클릭함")
	IMP.request_pay({
		pg: "html5_inicis",
		pay_method: "card",
		merchant_uid: "ORD20180131-0000011",   // 주문번호
		name: "노르웨이 회전 의자",
		amount: 64900,                         // 숫자 타입
		buyer_email: "gildong@gmail.com",
		buyer_name: "홍길동",
		buyer_tel: "010-4242-4242",
		buyer_addr: "서울특별시 강남구 신사동",
		buyer_postcode: "01181"
	}, function(rsp) { // callback
//		$.ajax({
//			type: 'POST',
//			url: '/verify/' + rsp.imp_uid
//		}).done(function(data) {
//			if (rsp.paid_amount === data.response.amount) {
//				alert("결제 성공");
//			} else {
//				alert("결제 실패");
//			}
//		});
	});
}
function limitInput() {
	// 사용 가능한 포인트
	const availablePoint = parseInt($("#totalPoint").text().replace(',', ''));

	// 입력된 값을 숫자로 변환
	const inputValue = parseInt($("#usePoint").val());
	console.log("차액 설정 :" + availablePoint + " " + inputValue);

	// 사용 가능한 포인트보다 큰 값이 입력되면 최대값으로 설정
	if (inputValue > availablePoint) {
		const formattedValue = availablePoint.toLocaleString(); // 천 단위 콤마 추가
		$("#usePoint").val(formattedValue);
	}

}

function _accountInfo() {

	var token = localStorage.getItem("accessToken");
	var usrId = localStorage.getItem("usrId");
	$.ajax({
		url: '/api/payment/accountInfo/' + usrId,
		type: 'GET',
		headers: {
			'Authorization': 'Bearer ' + token
		},
	}).done(function(data) {
		if (data.code === 'success') {
			let lists = data.result[0];
			let usrEmail = lists[0];
			let usrNm = lists[1];
			let usrPhone = lists[2];
			let delvAddr = lists[3];
			$('#usrNm').text(usrNm);
			$('#usrEmail').text(usrEmail);
			$('#usrPhone').val(usrPhone);
			$('#delvAddr').text(delvAddr);
			$('#delvUsrPhone').val(usrPhone);

			_totalPoint();
		}
	}).fail(function(xhr, textStatus, errorThrowna) {
		if (xhr.status === 403) {
			var msg = "로그인을 다시 해주세요.";
			if (confirm(msg)) {
				window.location.href = '/account/login';
			}
		} else {
			// 그 외의 경우 처리
		}
	});

}

function _totalPoint() {
	var usrId = localStorage.getItem("usrId");
	var logTp = localStorage.getItem("logTp");
	var token = localStorage.getItem("accessToken");
	var resultData = {};
	resultData.usrId = usrId;
	resultData.logTp = logTp;
	$.ajax({
		url: "/api/mypage/profile/pointPt",
		type: 'POST',
		data: JSON.stringify(resultData), // form 데이터를 JSON 문자열로 변환하여 전송
		headers: {
			'Authorization': 'Bearer ' + token
		},
		contentType: 'application/json',
	}).done(function(data) {

		if (data.code === 'success') {
			var point = data.poinTotal;
			$('#totalPoint').text(point);

		} else {
			alert(data.msg);
		}
	}).fail(function(xhr, textStatus, errorThrowna) {
		if (xhr.status === 400) {
			// HTTP 상태 코드가 400인 경우 처리
			var errorMessage = xhr.responseJSON.msg; // 혹은 다른 방식으로 오류 메시지 추출
			alert(errorMessage);
		} else {
		}
	});
}








$(document).ready(function() {
	init();
});
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
		let itemNm = $('#itemNm').text();
		let totalPrice = $('#totalPrice').text().replaceAll(',', '');
		totalPrice = parseInt(totalPrice)
		let usrNm = $('#usrNm').text();
		let usrEmail = $('#usrEmail').text();
		let delvUsrPhone = $('#delvUsrPhone').text();
		let addr = $('#delvAddr').text();
		let delvAreaNo = $('#delvAreaNo').val();
		let result = {};
		result.itemNm = itemNm;
		result.totalPrice = totalPrice;
		result.usrNm = usrNm;
		result.usrEmail = usrEmail;
		result.delvUsrPhone = delvUsrPhone;
		result.addr = addr;
		result.delvAreaNo = delvAreaNo;
		requestPay(result);
	});

	$("#paykakaoBtn").on("click", function() {
		paykakaoBtn();
	});




}
function paykakaoBtn() {
	console.log("버튼 클릭함")
	IMP.request_pay({
		pg: "kakaopay",
		pay_method: "card",
		merchant_uid: "ORD_" + new Date().getTime(),   // 주문번호
		name: "노르웨이 회전 의자",
		amount: 64900,                         // 숫자 타입
		buyer_email: "gildong@gmail.com",
		buyer_name: "홍길동",
		buyer_tel: "010-4242-4242",
		buyer_addr: "서울특별시 강남구 신사동",
		buyer_postcode: "01181"
	}, function(rsp) { // callback

		if (rsp.success) {//결제 성공시
			var msg = '결제가 완료되었습니다';
			var result = {
				"imp_uid": rsp.imp_uid,
				"merchant_uid": rsp.merchant_uid,
				"biz_email": '<%=email%>',
				"pay_date": new Date().getTime(),
				"amount": rsp.paid_amount,
				"card_no": rsp.apply_num,
				"refund": 'payed'
			}
			console.log("결제성공 " + msg);
		}
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

function requestPay(result) {
	var items = [];
	// 각 아이템 행을 순회하면서 정보를 추출하여 배열에 추가
	$("#itemLiestsBody tr").each(function() {
		var itemName = $(this).find("td:nth-child(1)").text();  // 아이템 이름 추출
		var itemQuantity = parseInt($(this).find("td:nth-child(3)").text());  // 아이템 갯수 추출
		var itemPrice = parseInt($(this).find("td:nth-child(4)").text().replace(',', ''));  // 아이템 가격 추출

		// 각 아이템의 정보를 객체로 생성하여 배열에 추가
		var item = {
			name: itemName,
			amount: itemPrice,
			quantity: itemQuantity
		};

		items.push(item);  // 배열에 아이템 추가
	});
	console.log("버튼 클릭함" + JSON.stringify(result))
	IMP.request_pay({
		pg: "AO09C",
		pay_method: "vbank",
		merchant_uid: "ORD_" + new Date().getTime(),   // 주문번호
		name: result.itemNm,
		amount: 500,                         // 숫자 타입
		buyer_email: result.usrEmail,
		buyer_name: result.usrNm,
		buyer_tel: result.delvUsrPhone,
		buyer_addr: result.addr,
		buyer_postcode: result.delvAddrNo
	}, function(rsp) { // callback
		if (rsp.success) {//결제 성공시
			var msg = '결제가 완료되었습니다';
			var result = {
				"imp_uid": rsp.imp_uid,
				"merchant_uid": rsp.merchant_uid,
				"pay_date": new Date().getTime(),
				"amount": rsp.paid_amount,
				"card_no": rsp.apply_num,
				"refund": 'payed',
				"itemPrice" : $('#itemPrice').text(),
				"count" : $('#count').text(),
				"itemKey" : $('#itemKey').val(),
				"point" : $('#usePoint').val()
				
				
			}
			console.log("결제성공 " + msg + " " + JSON.stringify(result));

			$.ajax({
				type: 'GET',
				url: '/api/payment/verify',
				data: JSON.stringify(result), // form 데이터를 JSON 문자열로 변환하여 전송
				contentType: 'application/json',
			}).done(function(data) {
				console.log(rsp.amount + " " + data.iamResponse)
				if (rsp.amount === data.paidAmount) {
					alert("결제 성공");
				} else {
					alert("결제 실패");
				}
			});
		} else {
			alert("결제에 실패하였습니다. 에러 내용: " + rsp.error_msg);
		}
	});
}


function limitInput() {
	// 사용 가능한 포인트
	const availablePoint = parseInt($("#totalPoint").text().replace(',', ''));

	// 입력된 값을 숫자로 변환
	const inputValue = parseInt($("#usePoint").val());
	// 최종 값 설정
	// 사용 가능한 포인트보다 큰 값이 입력되면 최대값으로 설정
	const originalTotlaPrice = parseInt($("#originalTotlaPrice").val().replace(',', '').substring(0, $('#originalTotlaPrice').val().indexOf('원')));

	if (inputValue > availablePoint) {
		$("#usePoint").val('');
		$('#totalPrice').text(originalTotlaPrice.toLocaleString() + '원');
		return alert("사용 가능한 포인트는 총 " + $("#totalPoint").text() + "포인트입니다.")
	}
	if (inputValue >= 0) {
		const newTotalPrice = originalTotlaPrice - inputValue
		$('#totalPrice').text(newTotalPrice.toLocaleString() + '원');
	} else {
		$('#totalPrice').text(originalTotlaPrice.toLocaleString() + '원');
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
			let delvAreaNo = lists[4];
			$('#usrNm').text(usrNm);
			$('#usrEmail').text(usrEmail);
			$('#usrPhone').val(usrPhone);
			$('#delvAddr').text(delvAddr);
			$('#delvUsrPhone').val(usrPhone);
			$('#delvAreaNo').val(delvAreaNo);
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
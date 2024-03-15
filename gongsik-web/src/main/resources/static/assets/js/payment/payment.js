var IMP = window.IMP;
var init = function() {
	//사용자 정보 가져오기

	_accountInfo();

	_itemListsTable();

	$("#usePoint").on("input", function() {
		limitInput();
	});

	IMP.init("imp14751858");

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
		let payMethod = $('input[type="radio"]:checked').val();
		result.payMethod = payMethod;
		let pgType = '';
		if(payMethod === 'kakao'){
			pgType = 'kakaopay'
			payMethod = 'card';
		}else {
			pgType = 'AO09C'
		}
		result.pgType = pgType
		console.log(payMethod + " " + pgType)
		requestPay(result);
	});

	// 라디오 버튼 클릭 이벤트 처리
    $('input[type="radio"]').click(function() {
        // 클릭된 라디오 버튼을 제외한 나머지 버튼을 비활성화하고 회색으로 표시
         var isChecked = $(this).prop('checked');

        // 다른 라디오 버튼의 상태를 초기화합니다.
        $('input[type="radio"]').not(this).prop('checked', false);


        // 선택된 라디오 버튼의 상태에 따라 텍스트 색상을 변경합니다.
        if (isChecked) {
            $(this).next('label').css('color', '#000'); // 선택된 경우
        } else {
            $(this).next('label').css('color', '#ccc'); // 선택이 해제된 경우
        }
    });
}


function requestPay(result) {
	var items = [];
	// 각 아이템 행을 순회하면서 정보를 추출하여 배열에 추가
	$("#itemLiestsBody tr").each(function() {
		var itemName = $(this).find("td:nth-child(3)").text(); // 아이템 이름 추출
		var itemQuantity = parseInt($(this).find("td:nth-child(4)").text());  // 아이템 갯수 추출
		var itemPrice = parseInt($(this).find("td:nth-child(5)").text().replaceAll(',', '').replace('원', ''));  // 아이템 가격 추출
		var itemKey = $(this).find("input[name='itemKey']").val();
		// 각 아이템의 정보를 객체로 생성하여 배열에 추가
		var item = {
			itemNo: itemKey,
			itemName: itemName,
			itemAmount: itemPrice,
			itemQuantity: itemQuantity
		};

		items.push(item);  // 배열에 아이템 추가
	});
	console.log("버튼 클릭함" + JSON.stringify(result) + " " + JSON.stringify(items))
	IMP.request_pay({
		pg: result.pgType,
		pay_method: result.payMethod,
		merchant_uid: "ORD_" + new Date().getTime(),   // 주문번호
		name: result.itemNm,
		amount: $('#totalPrice').text(),                         // 숫자 타입
		buyer_email: result.usrEmail,
		buyer_name: result.usrNm,
		buyer_tel: result.delvUsrPhone,
		buyer_addr: result.addr,
		buyer_postcode: result.delvAddrNo
	}, function(rsp) { // callback
		if (rsp.success) {//결제 성공시
	  		let usePoint = ($('#usePoint').val() === undefined || $('#usePoint').val() === '') ? 0 : $('#usePoint').val();
   			var msg = '결제가 완료되었습니다';
			var result = {
				"imp_uid": rsp.imp_uid,
				"merchant_uid": rsp.merchant_uid,
				"pay_date": new Date().getTime(),
				"amount": rsp.paid_amount,
				"card_no": rsp.apply_num,
				"refund": 'payed',
				"itemPrice": $('#itemPrice').text(),
				"count": $('#count').text(),
				"itemKey": $('#itemKey').val(),
				"point": usePoint,
				"items": items,
				"totalBenePrice": $('#totalBenePrice').text(),
				"usrId": localStorage.getItem('usrId')

			}
			console.log("결제성공 " + msg + " " + JSON.stringify(result));

			$.ajax({
				type: 'POST',
				url: '/api/payment/verify',
				data: JSON.stringify(result), // form 데이터를 JSON 문자열로 변환하여 전송
				contentType: 'application/json',
			}).done(function(data) {
				console.log(rsp.amount + " " + data.iamResponse)
				if (data.code === 'success') {
					if (confirm(data.msg)) {
						window.location.href = '/';
					}
				} else if(data.code === 'outOfStock'){
					alert(data.msg);
				}else if(data.code === 'diffAmountPrice'){
					alert(data.msg);
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
	const originalTotlaPrice = parseInt($("#originalTotlaPrice").val());
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

function _itemListsTable() {
	let itemLists = $('#itemLists').val().replace('{itemLists=', '').replace(']}', ']');
	const parsedData = JSON.parse(itemLists);
	console.log("왜 not " + parsedData)
	$('.n-item-view').show();
	var tableBody = $("#itemLiestsBody");
	var itemTrList = $(".itemTrList");
	// 기존에 있는 내용 비우기
	itemTrList.empty();

	let totalPrice = 0;
	// 데이터를 기반으로 동적으로 테이블 생성
	for (let i = 0; i < parsedData.length; i++) {
		const itemList = parsedData[i];
		const row = $("<tr>").addClass("itemTrList");

		// 셀 생성 및 추가
		row.append(`<td class="align-middle">
    <div class="img-container">
        <a href="/categories/itemDetaiList?menuItemNo=${itemList.itemKey}&menuNm=${itemList.itemNm}" class="img-block">
            <img src="${itemList.url}" alt="${itemList.itemNm}" class="img-fluid product-image" style="width: 100px; display: block; margin: 0 auto;">
        </a>
    </div>
</td>`);
		row.append(`<input type="hidden" name="itemKey" id="itemKey${i}" value ="${itemList.itemKey}">`);
		row.append(`<td class="align-middle text-center" id="itemNm" >${itemList.itemNm}</td>`);
		row.append(`<td class="align-middle text-center" id="count">${itemList.count}</td>`);
		row.append(`<td class="align-middle text-center" id="itemPrice">${itemList.totalPrice}
            </td></tr>`);


		tableBody.append(row);
		let parseTotalPrice = parseInt(itemList.totalPrice.replaceAll(',', '').replace('원', ''));
		totalPrice += itemList.count * parseTotalPrice
	}
	$('#totalPrice').text(totalPrice.toLocaleString() + '원');
	$('#originalTotlaPrice').val(totalPrice);
	let benePrice = totalPrice / 100;
	$('#totalBenePrice').text(benePrice.toLocaleString() + '적립');
}






$(document).ready(function() {
	init();
});
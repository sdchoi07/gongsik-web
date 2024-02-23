var init = function() {
	// 상품 정보
	_categorieDetail();

	$("#count").change(function() {
		var itemPrice = $("#itemPrice").text();
		console.log("itemPrice : " + itemPrice)
		calculateTotalPrice(itemPrice);
	});

	$("#goToWish").on('click', function(event) {
		event.preventDefault();
		_gotoWish();
	});

}

function _gotoWish() {
	
	var cartSt = $('#cartSt').val();
    var token = localStorage.getItem("accessToken");
    var usrId = localStorage.getItem("usrId");
    var invenNo = $('#itemKey').val();
    var count = $("#count").val();
    resultData = {};
    resultData.cartSt = cartSt;
    resultData.usrId = usrId;
    resultData.invenNo = invenNo;
    resultData.count = count;
    
    $.ajax({
        url: '/api/categories/intoCart',
        type: 'POST',
        data: JSON.stringify(resultData),
        headers: {
            'Authorization': 'Bearer ' + token
        },
        contentType: 'application/json',
    }).done(function (data) {
		if(data.code === 'success'){
			alert(data.msg);
		}
    }).fail(function (xhr, textStatus, errorThrowna) {
        if (xhr.status === 403) {
			var msg = "로그인을 다시 해주세요.";
			if(confirm(msg)){
	           	window.location.href = '/account/login';
           	}
        } else {
            // 그 외의 경우 처리
        }
    });
    
}



function calculateTotalPrice(itemPrice) {


	var itemCnt = $("#itemCnt").val() * 1;
	var count = $("#count").val();
	if (count <= 0) {
		return;
	}

	if (itemCnt < count) {
		$("#count").val($("#count").val() - 1);
		alert("샹품 재고가 부족합니다. 재고:" + itemCnt + "개")
		return;
	}
	itemPrice = itemPrice.replaceAll(',', "");
	itemPrice = itemPrice.replaceAll('원', "");

	var totalPrice = itemPrice * count;

	var krwFormat = new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' });
	var formattedPrice = krwFormat.format(totalPrice);
	$("#totalPrice").html(formattedPrice + '원');
}


function _categorieDetail() {
	var itemKey = $('#itemKey').val();
	var resultData = {};
	var usrId = localStorage.getItem('usrId');
	resultData.itemKey = itemKey;
	resultData.usrId = usrId;
	$.ajax({
		url: '/api/categories/categorieDetail',
		type: 'POST',
		data: JSON.stringify(resultData),
		contentType: 'application/json',
	}).done(function(data) {
		$('#itemDetail').attr('src', data.result.invenUrl);
		$('#itemNm').text(data.result.invenSClsNm);
		$('#itemInfo').text(data.result.invenText);
		$('#itemPrice').text(data.result.invenPrice);
		$('#benePrfice').text(data.benfit);
		$('#itemCnt').val(data.result.invenCnt);

		calculateTotalPrice(data.result.invenPrice);
	}).fail(function(xhr, textStatus, errorThrowna) {
		if (xhr.status === 403) {
			var msg = "로그인 상태에서만 가능합니다.";
			if (confirm(msg)) {
				window.location.href = '/account/login';
			}
		} else if ((xhr.status === 401)) {
			var msg = "로그인 상태에서만 가능합니다.";
			if (confirm(msg)) {

			}
		}
	});
}

$(document).ready(function() {
	init();
});

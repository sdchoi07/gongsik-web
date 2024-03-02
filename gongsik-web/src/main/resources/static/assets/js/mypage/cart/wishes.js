var currentPage = 1;

var initWish = function() {
	// 주문 목록 조회
	_wishList();

	// '다음' 버튼 클릭 이벤트 핸들러
	$("#nextBtn").on("click", function() {
		currentPage++;
		_wishList();
	});
	$("#prevBtn").on("click", function() {
		currentPage--;
		_wishList();
	});
}


var _wishList = function() {
	var resultData = {};
	var usrId = localStorage.getItem("usrId");
	var token = localStorage.getItem("accessToken");
	resultData.usrId = usrId;
	resultData.cartSt = $('#cartSt').val();
	resultData.currentPage = currentPage;
	if (currentPage <= 0) {
		alert("조회 할 내역이 없습니다.");
		currentPage = 1;
		return;
	}
	$.ajax({
		url: '/api/mypage/usrCart/cartList',
		type: 'POST',
		data: JSON.stringify(resultData),
		headers: {
			'Authorization': 'Bearer ' + token
		},
		contentType: 'application/json',
	}).done(function(data) {
		if(data.totalCnt === 0){
			var myCart = $('.wishTable');
			myCart.empty();
			var row = `<div class="col-xl-12 mt-4 cartEmpty">
					    <div class="bg-white shadow d-flex justify-content-center" style="height: 300px;  width: 100%;">
					        <div class="d-flex align-items-center">
					            <span>장바구니 내역이 없습니다.</span>
					        </div>
					    </div>
					</div>`
			myCart.append(row)
		}else{
		_tableData(data);
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

//주소 삭제
function deleteWishList(index) {

	var cartNo = $(`#cartNo${index}`).val();
	var token = localStorage.getItem("accessToken");
	var usrId = localStorage.getItem("usrId");
	var cartSt = $('#cartSt').val();
	var resultData = {};
	resultData.cartNo = cartNo;
	resultData.cartSt = cartSt;
	resultData.usrId = usrId;
	$.ajax({
		url: '/api/mypage/usrCart/cartDel',
		type: 'POST',
		headers: {
			'Authorization': 'Bearer ' + token
		},
		data: JSON.stringify(resultData),
		contentType: 'application/json',
	}).done(function(data) {
		if (data.result.code === 'success') {
			_wishList();
		} else {
			alert(data.result.msg);
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

var _tableData = function(data) {
	if (data.cnt === 0) {
		alert("더 이상 조회 할 내역이 없습니다.");
		currentPage--;
		return;
	}
	$('.n-wish-view').show();
	$('.pagination').show();
	var tableBody = $("#wishTableBody");
	var wishTrList = $(".wishTrList");
	// 기존에 있는 내용 비우기
	wishTrList.empty();

	var list = data.result;

	// 데이터를 기반으로 동적으로 테이블 생성
	for (let i = 0; i < list.length; i++) {
		const wishes = list[i];
		const row = $("<tr>").addClass("wishTrList");

		// 셀 생성 및 추가
		row.append(`<td class="align-middle">
                    <div class="n-prd-row d-flex align-items-center">
                      <a href="/categories/itemDetaiList?menuItemNo=${wishes.cartItemNo}&menuNm=${wishes.cartItemNm}" class="img-block">
                        <img src="${wishes.cartUrl}" alt="${wishes.cartItemNm}" class="img-fluid product-image">
                      </a>		
                      <span class="itemNm"><a href="/categories/itemDetaiList?menuItemNo=${wishes.cartItemNo}&menuNm=${wishes.cartItemNm}">${wishes.cartItemNm}</a></span>	
                    </div>
                  </td>`);
		row.append(`<input type="hidden" name="cartNo" id="cartNo${i}" value ="${wishes.cartNo}">`);
		row.append(`<td class="align-middle text-center">${wishes.cartItemCnt}</td>`);
		row.append(`<td class="align-middle text-center">${wishes.cartPrice}</td>`);
		row.append(`<td class="align-middle">
              <div class="d-flex flex-column justify-content-center text-center align-items-center">
                  <button type="submit" class="btn btn-primary btn-sm btn-block border-0 fw-bold" 
                    style="background-color: #000000; font-family: 'Noto Sans KR', sans-serif; width: 80px;" onclick='deleteWishList(${i})'
                    id="delBtn">삭제</button>
              </div>
            </td></tr>`);

		tableBody.append(row);

	}

}
$(document).ready(function() {
	initWish();
});

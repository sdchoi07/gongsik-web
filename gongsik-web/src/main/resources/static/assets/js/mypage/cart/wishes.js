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

	// 검색 버튼 클릭 이벤트 핸들러 등록
	$('#paymentBtn').on('click', function(event) {
		event.preventDefault();
		_movePayment();
	});
}

function _movePayment() {

	// 현재 URL 가져오기
	const currentUrl = window.location.href;
	var wishlist = [];
	$(".wishTrList").each(function(index) {
        // 현재 행에서 필요한 값을 추출
        var itemNm = $(this).find(".itemNm a").text();
        var itemKey = $(this).find("input[name='cartNo']").val();
        var count = $(this).find(".text-center:eq(0)").text();
        var totalPrice = $(this).find(".text-center:eq(1)").text();

        // 추출한 값을 콘솔에 출력 (나중에 실제로 사용할 때는 데이터를 어떻게 활용할지 결정)
        console.log("Item Name: " + itemNm);
        console.log("Cart No: " + itemKey);
        console.log("Count: " + count);
        console.log("Total Price: " + totalPrice);

        // 추출한 값을 자유롭게 활용하여 필요한 작업 수행
        // ...

        // 예제에서는 배열에 저장하는 방식으로 구현
        var wishlistItem = {
            itemNm: itemNm,
            itemKey: itemKey,
            count: count,
            totalPrice: totalPrice
        };
        wishlist.push(wishlistItem);
    });
   	 console.log(wishlist);

    // 완성된 Wishlist 배열을 콘솔에 출력

	// 현재 URL에 추가할 파라미터 객체 생성
//	const queryParams = {
//		itemKey: itemKey,
//		itemNm: itemNm,
//		count: count,
//		totalPrice: totalPrice,
//		url: url
//	};

	// 쿼리스트링으로 변환
	const queryString = objectToQueryString(wishlist);
	console.log(encodeURIComponent(JSON.stringify(queryString)))
	// 현재 URL에 쿼리스트링 추가하고 새로운 URL로 이동
 window.location.href = "/payment/paymentDetail?itemLists=" + encodeURIComponent(JSON.stringify(wishlist));
}

function objectToQueryString(obj) {
  return Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
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
		if (data.totalCnt === 0) {
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
		} else {
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

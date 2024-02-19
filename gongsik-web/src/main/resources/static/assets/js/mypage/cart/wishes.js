var currentPage = 1;
	
var initWish = function () {
    // 주문 목록 조회
    _wishList();

    // '다음' 버튼 클릭 이벤트 핸들러
//    $("#nextBtn").on("click", function() {
//        currentPage++;
//        _orderList();
//    });
//    $("#prevBtn").on("click", function() {
//        currentPage--;
//        	
//        _orderList();
//    });
}


var _wishList = function () {
    var resultData = {};
    var usrId = localStorage.getItem("usrId");
    var token = localStorage.getItem("accessToken");
    resultData.usrId = usrId;
    resultData.cartSt = $('#cartSt').val();
    $.ajax({
        url: '/api/mypage/usrCart/cartList',
        type: 'POST',
        data: JSON.stringify(resultData),
        headers: {
            'Authorization': 'Bearer ' + token
        },
        contentType: 'application/json',
    }).done(function (data) {
		_tableData(data);
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

//주소 삭제
function deleteWishList(index){
	
	var cartNo = $(`#cartNo${index}`).val();
    var token = localStorage.getItem("accessToken");
    var usrId = localStorage.getItem("usrId");
    $.ajax({
        url: '/api/mypage/usrCart/cartDel/'+cartNo+'/'+ usrId,
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        contentType: 'application/json',
    }).done(function (data) {
		if(data.result.code === 'success'){
			if(confirm(data.result.msg)){
				_wishList();
			}else{
				alert(data.result.msg);
			}
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

var _tableData = function(data){
	console.log(data.cnt)
	if(data.cnt === 0){
		alert("더 이상 조회 할 내역이 없습니다.");
		return;
	}
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
                      <a href="${wishes.itemImg}" class="img-block">
                        <img src="${wishes.itemImg}" alt="${wishes.cartItemNm}" class="img-fluid product-image">
                      </a>		
                      <span class="itemNm"><a href="${wishes.itemImg}">${wishes.cartItemNm}</a></span>	
                    </div>
                  </td>`);
      row.append(`<input type="hidden" name="cartNo" id="cartNo${i}" value ="${wishes.cartNo}">`);
      row.append(`<td class="align-middle text-center">${wishes.cartItemCnt}</td>`);
      row.append(`<td class="align-middle text-center">${wishes.price}</td>`);
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
$(document).ready(function () {
    initWish();
});

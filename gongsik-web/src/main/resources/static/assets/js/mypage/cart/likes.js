var currentPage = 1;
	
var init = function () {
    // 주문 목록 조회
    _likesList();

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


var _likesList = function () {
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
		console.log(data)
		_tableLikesData(data);
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
function deleteLikesList(index){
	
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
				_likesList();
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

//장바구니 담기
function addWishList(index){
	var cartNo = $(`#cartNo${index}`).val();
    var token = localStorage.getItem("accessToken");
    var usrId = localStorage.getItem("usrId");
    $.ajax({
        url: '/api/mypage/usrCart/wishAdd/'+cartNo+'/'+ usrId,
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        contentType: 'application/json',
    }).done(function (data) {
		if(data.result.code === 'success'){
			if(confirm(data.result.msg)){
				_likesList();
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
var _tableLikesData = function(data){
	console.log(data)
//	if(data.cnt === 0){
//		alert("더 이상 조회 할 내역이 없습니다.");
//		return;
//	}
    var tableBody = $("#likesTableBody");
    var likesTrList = $(".likesTrList");
    // 기존에 있는 내용 비우기
    likesTrList.empty();
    
	var list = data.result;
    
     for (let i = 0; i < list.length; i++) {
	 const likes = list[i];
      const row = $("<tr>").addClass("likesTrList");

      // 셀 생성 및 추가
      row.append(`<td class="align-middle">
                    <div class="n-prd-row d-flex align-items-center">
                      <a href="${likes.itemImg}" class="img-block">
                        <img src="${likes.itemImg}" alt="${likes.cartItemNm}" class="img-fluid product-image">
                      </a>		
                      <span class="itemNm"><a href="${likes.itemImg}">${likes.cartItemNm}</a></span>	
                    </div>
                  </td>`);
      row.append(`<input type="hidden" name="cartNo" id="cartNo${i}" value ="${likes.cartNo}">`);
      row.append(`<td class="align-middle text-center">${likes.cartItemCnt}</td>`);
       row.append(`<td class="align-middle">
              <div class="d-flex flex-column justify-content-center text-center align-items-center">
                 <button type="button" class="btn btn-link border-0 fw-lighter ml-2" onclick='addWishList(${i})' style="color: #000000;  font-family: 'Noto Sans KR', sans-serif;">장바구니 담기</button>
              </div>
            </td></tr>`);
      row.append(`<td class="align-middle">
              <div class="d-flex flex-column justify-content-center text-center align-items-center">
                  <button type="submit" class="btn btn-primary btn-sm btn-block border-0 fw-bold" 
                    style="background-color: #000000; font-family: 'Noto Sans KR', sans-serif; width: 80px;" onclick='deleteLikesList(${i})'
                    id="delBtn">삭제</button>
              </div>
            </td></tr>`);

      tableBody.append(row);
     
    }
    
}
$(document).ready(function () {
    init();
});

var init = function(){
	
	/* 배송지 조회 */
	_delvList();
	
        // 배송지 추가 버튼 클릭 이벤트 핸들러
    $('#addBtn').on("click", function(e) {
		e.preventDefault();
		openModal();
    });

    // 닫기 버튼 클릭 이벤트 핸들러
    $("#closeBtn").on("click", function () {
        closeModal();
    });
    
    // 배송지 추가
    $("#saveBtn").on("click", function () {
        _saveNewAdress();
    });
}

//새 배송지역 저장
var _saveNewAdress = function(){
	var saveNewAddress = $('#saveForm').serializeObject();
	var usrId = localStorage.getItem('usrId');
	var token = localStorage.getItem('accessToken');
	saveNewAddress.usrId = usrId;
	 $.ajax({
        url: '/api/mypage/delv/saveNewAddress',
        type: 'POST',
        data: JSON.stringify(saveNewAddress),
        headers: {
            'Authorization': 'Bearer ' + token
        },
        contentType: 'application/json',
    }).done(function (data) {
		// 주소 목록을 렌더링하는 함수 호출
		console.log("code : " + data.result.code)
		if(data.result.code === 'successs'){
			if(confirm(data.result.msg)){
				closeModal();
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
//배송지역 조회
var _delvList = function(){
    var resultData = {};
    
    var usrId = localStorage.getItem("usrId");
    var token = localStorage.getItem("accessToken");
    resultData.usrId = usrId;
    $.ajax({
        url: '/api/mypage/delv/delvList/'+usrId,
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        contentType: 'application/json',
    }).done(function (data) {
		// 주소 목록을 렌더링하는 함수 호출
        _renderAddresses(data.result);

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

 function searchAddress() {
    new daum.Postcode({
      oncomplete: function(data) {
		  console.log("data : " + data)
		  console.log("code : " + data.zonecode);
		  console.log("address : " + data.address);
		  $("#zipCode").val(data.zonecode);
		  $("#address").val(data.address);
      }
    }).open();
  }

function _renderAddresses(addresses) {
    // 주소 목록을 담을 컨테이너
    const container = $(".delvList");

    // 주소 목록을 for문으로 동적으로 생성
    for (let i = 0; i < addresses.length; i++) {
        const address = addresses[i];

        // 주소 목록에 각 아이템 추가
        const listItem = `
            <div class ="col-xl-12 mb-4" style ="background-color: rgba(245, 238, 39, 0.07); height: 100px; padding-top: 20px;">
                <div data-name="address_form_wrapper">
                    <ul data-name="address_list" class="list-unstyled">
                        <li class="px-[18px] first:border-t border-b border-gray-e9">
                            <div class="d-flex justify-content-between align-items-center" data-name="address_wrapper">
                                <div class="d-flex flex-column" data-name="address_info">
                                    <div class="info mb-2">
                                        <span data-name="receiving_name" class="font-weight-bold">${address.delvAreaNm}</span>
                                        <span data-name="phone" class="inline-block ml-[12px] font-weight-bold">${address.delvPhNo}</span>
                                    </div>
                                    <div class="address">
                                        <span>[${address.delvAreaNo}] ${address.delvAreaAddr}</span>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center ml-auto mt-2">
                                    ${address.delvUseYn ? 
								        `<span class="text-footer10 font-weight-bold mr-2" style="color:rgba(245, 178, 39, 0.82)">기본배송지</span>
								        <img src="/vendor/third/img/box.png"  width="20" height="20">` 
								        : ''
								    }
                                    <button type="button" class="btn btn-primary border-0 fw-bold ml-5" id="searchBtn" style="background-color: #000000; font-family: 'Noto Sans KR', sans-serif; width: 60px;">수정</button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        `;

        // 주소 목록에 각 아이템 추가
        container.append(listItem);
    }
     // 페이지 로딩 후 주소 목록을 모두 추가한 후에 버튼을 맨 아래에 추가
    container.append(`
        		<div class="d-flex justify-content-end mt-2">
		    <!-- 조회 버튼 추가 -->
		    <button onclick='openModal()' class="btn btn-primary border-0 fw-bold" id="addBtn" style="background-color: #000000; font-family: 'Noto Sans KR', sans-serif;">배송지 추가</button>
		</div>
    `);
}



$(document).ready(function () {
    init();
});

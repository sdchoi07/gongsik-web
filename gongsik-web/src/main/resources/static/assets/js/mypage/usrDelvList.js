var init = function(){
	
	/* 배송지 조회 */
	_delvList();
	

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
	var modalDelvAresSeq = $('#modalDelvAresSeq').val();
	saveNewAddress.modalDelvAresSeq = modalDelvAresSeq;
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
		if(data.result.code === 'success'){
			if(confirm(data.result.msg)){
				closeModal();
				_delvList();
			}
		}else{
			alert(data.result.msg);
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

//주소 삭제
function deleteAddress(index){
	
	var delvAresSeq = $(`#delvAresSeq${index}`).val();
    var token = localStorage.getItem("accessToken");
    var usrId = localStorage.getItem("usrId");
    $.ajax({
        url: '/api/mypage/delv/delvDel/'+delvAresSeq+'/'+ usrId,
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        contentType: 'application/json',
    }).done(function (data) {
		if(data.result.code === 'success'){
			if(confirm(data.result.msg)){
				_delvList();
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

//주소 찾기
 function searchAddress() {
    new daum.Postcode({
      oncomplete: function(data) {
		  $("#zipCode").val(data.zonecode);
		  $("#address").val(data.address);
      }
    }).open();
  }

function _renderAddresses(addresses) {
    // 주소 목록을 담을 컨테이너
    const container = $(".delvList");
	container.empty();
    // 주소 목록을 for문으로 동적으로 생성
    for (let i = 0; i < addresses.length; i++) {
        const address = addresses[i];

        // 주소 목록에 각 아이템 추가
        const listItem = `
        <input id="delvAresSeq${i}" name="delvAresSeq" type="hidden" value=${address.delvAreaSeq}>
            <div class ="col-xl-12 mb-4" style ="background-color: rgba(245, 238, 39, 0.07); height: 100px; padding-top: 20px;">
                <div data-name="address_form_wrapper">
                    <ul data-name="address_list" class="list-unstyled">
                        <li class="px-[18px] first:border-t border-b border-gray-e9">
                            <div class="d-flex justify-content-between align-items-center" data-name="address_wrapper">
                                <div class="d-flex flex-column" data-name="address_info">
                                    <div class="info mb-2">
                                        <span data-name="receiving_name" class="font-weight-bold" id="delvAreaNm${i}">${address.delvAreaNm}</span>
                                        <span data-name="phone" class="inline-block ml-[12px] font-weight-bold" id="delvPhNo${i}">${address.delvPhNo}</span>
                                    </div>
                                    <div class="address">
                                        <span id="delvArea${i}">[${address.delvAreaNo}] ${address.delvAreaAddr}${(address.delvAreaDetail === undefined || address.delvAreaDetail === null || address.delvAreaDetail === '')  ? '' : ' - '+address.delvAreaDetail} </span>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center ml-auto mt-2">
	                              ${address.delvUseYn === 'Y' ? 
								    `<span class="text-footer10 font-weight-bold mr-2" style="color:rgba(245, 178, 39, 0.82)">기본배송지</span>
								    <input id="delvYn${i}" name="delvYn" type="hidden" value=${address.delvUseYn}>
								    <img src="/vendor/third/img/box.png"  width="20" height="20">
								    <button type="button" class="btn btn-link border-0 fw-bold ml-2" onclick='openModModal(${i})' style="color: #000000; font-family: 'Noto Sans KR', sans-serif;">수정</button>` 
								    : `<button type="button" class="btn btn-link border-0 fw-bold" onclick='openModModal(${i})' style="color: #000000; font-family: 'Noto Sans KR', sans-serif;">수정</button>
								    <button type="button" class="btn btn-link border-0 fw-bold"  onclick='deleteAddress(${i})' style="color: #000000; font-family: 'Noto Sans KR', sans-serif;">삭제</button>`
								}


                                 
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

function openModModal(index) {
	var addressNm = $(`#delvAreaNm${index}`).text();
	var delvPhNo = $(`#delvPhNo${index}`).text();
	var delvArea = $(`#delvArea${index}`).text();
	var zipCode = delvArea.split(']')[0].replaceAll('[','');
	var delvAreaAdress = delvArea.split('] ')[1].split(' - ')[0];
	var addressDetail = delvArea.split('] ')[1].split(' - ')[1];
	var delvUseYn = $(`#delvYn${index}`).val();
	var delvAresSeq = $(`#delvAresSeq${index}`).val();
	console.log(" addressDetail ? "+addressDetail)
	$('#addressNm').val(addressNm);
	$('#phoneNumber').val(delvPhNo);
	$('#zipCode').val(zipCode);
	$('#address').val(delvAreaAdress);
	$('#addressDetail').val(addressDetail);
	if(delvUseYn === 'Y'){
		$('#addressYn').prop('checked', true);
	}else{
		$('#addressYn').prop('checked', false);
	}
	$('#modalDelvAresSeq').val(delvAresSeq);
	
     $('#delvAdd').modal("show"); // Bootstrap을 사용하는 경우
}

$(document).ready(function () {
    init();
});

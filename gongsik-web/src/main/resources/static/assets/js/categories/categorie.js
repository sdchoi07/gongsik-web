var currentPage = 1;

var initItem = function() {
	// 상품 정보
	_categoriesList();

	// 검색 버튼 클릭 이벤트 핸들러 등록
	$('#selectOrder').on('change', function(event) {
		event.preventDefault();
		currentPage = 1;
		_categoriesList();
	});

	// '다음' 버튼 클릭 이벤트 핸들러
	$("#nextBtn").on("click", function() {
		currentPage++;
		_categoriesList();
	});
	$("#prevBtn").on("click", function() {
		currentPage--;

		_categoriesList();
	});
}

var _categoriesList = function() {
	var itemKey = $('#itemKey').val();
	var resultData = {};
	var ordering = $('#selectOrder').val();
	var usrId = localStorage.getItem("usrId");
	if (currentPage <= 0) {
		alert("조회 할 내역이 없습니다.");
		currentPage = 1;
		return;
	}
	resultData.currentPage = currentPage;
	resultData.itemkey = itemKey;
	resultData.orderBy = ordering;
	resultData.currentPage = currentPage;
	resultData.usrId = usrId;
	$.ajax({
		url: '/api/categories/categoriesList',
		type: 'POST',
		data: JSON.stringify(resultData),
		contentType: 'application/json',
	}).done(function(data) {
		console.log("data : " + data);
		_tableItemData(data)
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


var _tableItemData = function(data) {
	console.log(" ?? " + data.cnt)
	if (data.cnt === 0) {
		alert("더 이상 조회 할 내역이 없습니다.");
		currentPage--;
		return;
	}
	// 주소 목록을 담을 컨테이너
	const container = $(".itemContainer");
	container.empty();

	var list = data.result;
	var itemList = '';
	// 데이터를 기반으로 동적으로 테이블 생성
	for (let i = 0; i < list.length; i++) {
		if (i % 4 === 0) {
			itemList += `<ul class="list-group list-group-horizontal itemLists">`;
		}
		itemList += `
		<input type="hidden" value="${list[i].invenSClsNo}" id="invenNo${i}" name="invenNo">
		<input type="hidden" value="${list[i].useYn}" id="useYn${i}" name="useYn">
        <li class="list-group-item bg-gray-f6 px-4 py-3 flex-grow-1 border p-3 m-1 gradeList col-md-3">
            <a href="/categories/itemDetaiList?menuItemNo=${list[i].invenSClsNo}&menuNm=${list[i].invenSClsNm}" style="text-decoration: none !important; color: black">
                <div class="card product-item border-0 mb-4">
                    <div class="card-header product-img position-relative overflow-hidden bg-transparent border p-0" style="border-bottom: none !important">
                        <img class="img-fluid mx-auto d-block" style="width:400px; height:250px;" src="${list[i].invenUrl}" alt="">
                    </div>
                    <div class="card-body border-left border-right text-left p-0 pt-4 pb-3">
                        <h6 class="text-truncate mb-3" style = "margin-left: 10px;">${list[i].invenSClsNm}</h6>
                        <div class="d-flex justify-left-left">
                            <span style = "margin-left: 10px;">${list[i].invenPrice}</span>
                        </div>
                    </div>
                </div>
            </a>
            <div class="card-footer d-flex justify-content-end bg-light border">
                 <a href="javascript:void(0);" onclick="intoCart(${i})" class="btn btn-sm text-dark p-0">
                    <i class="fas fa-shopping-cart text-primary mr-1"></i>찜하기
                    ${list[i].useYn === 'Y' ? '<img src="/vendor/third/img/plot.png" style="top:52px;" />' : '<img src="/vendor/third/img/plot-empty.png" style="top:52px;" />'}
                </a>
            </div>
        </li>`;

		if ((i + 1) % 4 === 0 || (i === list.length - 1)) {
			itemList += `</ul>`;
		}
	}
	container.append(itemList);


}



function intoCart(index) {
	var invenNo = $(`#invenNo${index}`).val();
	var useYn = $(`#useYn${index}`).val();
	var resultData = {};
	var token = localStorage.getItem("accessToken");
	var usrId = localStorage.getItem("usrId");
	console.log(" ? ?" + invenNo)
	resultData.invenNo = invenNo;
	resultData.usrId = usrId;
	resultData.useYn = useYn;
	$.ajax({
		url: '/api/categories/intoCart',
		type: 'POST',
		data: JSON.stringify(resultData),
		headers: {
			'Authorization': 'Bearer ' + token
		},
		contentType: 'application/json',
	}).done(function(data) {
		if(data.code === 'success'){
		 	_categoriesList();
		}
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
	initItem();
});

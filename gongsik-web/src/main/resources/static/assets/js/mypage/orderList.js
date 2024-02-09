var orderListGrid = document.querySelector('#orderGrid');
var gridOptions; // 전역 변수로 변경
var gridApi; // 전역 변수로 변경
var currentPage = 1;
	
var init = function () {
    // 유저 정보
    _accountList();

    // Ag-Grid 초기화
//    initGrid();

    // 주문 목록 조회
    _orderList();

    // 검색 버튼 클릭 이벤트 핸들러 등록
    $('#searchBtn').on('click', function (event) {
        event.preventDefault();
        _selectDate();
        currentPage = 1;
        _orderList();
    });
    
    // '다음' 버튼 클릭 이벤트 핸들러
    $("#nextBtn").on("click", function() {
        currentPage++;
        _orderList();
    });
    $("#prevBtn").on("click", function() {
        currentPage--;
        	
        _orderList();
    });
}

var _selectDate = function(){
                var selectedValue = $('#selectDate').val();
                console.log("value : " + selectedValue)
                var selectedDateText = $('#selectedDateText');
                // 선택한 값에 따라 텍스트 업데이트
                switch (selectedValue) {
                    case '1':
                        selectedDateText.text('1달 이내 주문 내역');
                        break;
                    case '2':
                        selectedDateText.text('3달 이내 주문 내역');
                        break;
                    case '3':
                        selectedDateText.text('6달 이내 주문 내역');
                        break;
                    case '4':
                        selectedDateText.text('1년 이내 주문 내역');
                        break;
                    default:
                        break;
                }
}
//var initGrid = function () {
//    // Ag-Grid 초기화 옵션 설정
//    gridOptions = {
//        statusBar: {
//            statusPanels: [
//                { statusPanel: 'agTotalRowCountComponent', align: 'center' },
//                // 다른 상태 패널 추가 가능
//            ]
//        },
//        columnDefs: [
//            {
//                maxWidth: 5,
//                headerCheckboxSelection: true,
//                checkboxSelection: true,
//            },
//            { headerName: '', field: '' },
//            { headerName: '사진', field: 'itemPic', autoSize: true },
//            { headerName: '목록', field: 'itemNm', autoSize: true },
//            { headerName: '개수', field: 'itemCnt', autoSize: true },
//            { headerName: '주문상태', field: 'orderSt', autoSize: true },
//        ],
//        defaultColDef: {
//            flex: 1,
//            minWidth: 200,
//            sortable: true,
//            resizable: true,
//            editable: true,
//            floatingFilter: true,
//        },
//        rowSelection: 'multiple',
//        editType: 'fullRow',
//        onSelectionChanged: function () {
//            // 선택 변경이 발생했을 때의 동작
//        }
//    };
//
//    // Ag-Grid 초기화
//    gridApi = agGrid.createGrid(orderListGrid, gridOptions);
//}

var _orderList = function () {
    var resultData = {};
	var pageSize =  '5';
	if(currentPage <= 0){
		return;
	}
    var usrId = localStorage.getItem("usrId");
    var token = localStorage.getItem("accessToken");
    var orderDt = $('#selectDate').val();
    resultData.usrId = usrId;
    resultData.orderDt = orderDt;
    resultData.currentPage = currentPage;
    resultData.pageSize = pageSize;
    $.ajax({
        url: '/api/mypage/order/orderList',
        type: 'POST',
        data: JSON.stringify(resultData),
        headers: {
            'Authorization': 'Bearer ' + token
        },
        contentType: 'application/json',
    }).done(function (data) {
		_tableData(data);
		//글씨 변경
    	
        // Ag-Grid의 행 데이터 설정
//        gridApi.setGridOption('rowData', data.result.content);

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
    var tableBody = $("#orderTableBody");
    var orderTrList = $(".orderTrList");
    // 기존에 있는 내용 비우기
    orderTrList.empty();
    
    //날짜비교
    const currentDate = new Date();

	// 비교할 날짜를 구하는 예시 (현재 날짜로부터 한 달 전)
	const oneMonthAgo = new Date();
	oneMonthAgo.setMonth(currentDate.getMonth() - 1);


	var list = data.result;
    
    // 데이터를 기반으로 동적으로 테이블 생성
    list.forEach(product => {
      const row = $("<tr>").addClass("orderTrList");

      // 셀 생성 및 추가
      row.append(`<td class="align-middle">
                    <div class="n-prd-row d-flex align-items-center">
                      <a href="${product.itemImg}" class="img-block">
                        <img src="${product.itemImg}" alt="${product.itemNm}" class="img-fluid product-image">
                      </a>		
                      <span class="itemNm"><a href="${product.itemImg}">${product.itemNm}</a></span>	
                    </div>
                  </td>`);
      row.append(`<td class="align-middle text-center">${product.orderDt}</td>`);
      row.append(`<td class="align-middle text-center">${product.price}<br><span class="txt-default">${product.itemCnt}개</span></td>`);
      row.append(`<td class="align-middle">
              <div class="d-flex flex-column justify-content-center text-center align-items-center">
                <span class="mb-3">${product.orderStNm}</span>
                ${product.orderSt !== '03'&& product.orderSt !== '02' || oneMonthAgo<=product.orderDt ? 
                  `<button type="submit" class="btn btn-primary btn-sm btn-block border-0 fw-bold" 
                    style="background-color: #000000; font-family: 'Noto Sans KR', sans-serif; width: 80px;" 
                    id="modifyBtn">주문 취소</button>` : ''}
              </div>
            </td></tr>`);

      tableBody.append(row);
     
    });
}
$(document).ready(function () {
    init();
});

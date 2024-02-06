var orderListGrid = document.querySelector('#orderGrid');
var gridOptions; // 전역 변수로 변경
var gridApi; // 전역 변수로 변경

var init = function () {
    // 유저 정보
    _accountList();

    // Ag-Grid 초기화
    initGrid();

    // 주문 목록 조회
    _orderList();

    // 검색 버튼 클릭 이벤트 핸들러 등록
    $('#searchBtn').on('click', function (event) {
        event.preventDefault();
        _orderList();
    });
}

var initGrid = function () {
    // Ag-Grid 초기화 옵션 설정
    gridOptions = {
        statusBar: {
            statusPanels: [
                { statusPanel: 'agTotalRowCountComponent', align: 'center' },
                // 다른 상태 패널 추가 가능
            ]
        },
        columnDefs: [
            {
                maxWidth: 5,
                headerCheckboxSelection: true,
                checkboxSelection: true,
            },
            { headerName: '', field: '' },
            { headerName: '사진', field: 'itemPic', autoSize: true },
            { headerName: '목록', field: 'itemNm', autoSize: true },
            { headerName: '개수', field: 'itemCnt', autoSize: true },
            { headerName: '주문상태', field: 'orderSt', autoSize: true },
        ],
        defaultColDef: {
            flex: 1,
            minWidth: 200,
            sortable: true,
            resizable: true,
            editable: true,
            floatingFilter: true,
        },
        rowSelection: 'multiple',
        editType: 'fullRow',
        onSelectionChanged: function () {
            // 선택 변경이 발생했을 때의 동작
        }
    };

    // Ag-Grid 초기화
    gridApi = agGrid.createGrid(orderListGrid, gridOptions);
}

var _orderList = function () {
    var resultData = {};
    var usrId = localStorage.getItem("usrId");
    var orderDt = $('#selectDate').val();
    resultData.usrId = usrId;
    resultData.orderDt = orderDt;
    $.ajax({
        url: '/api/mypage/order/orderList',
        type: 'POST',
        data: JSON.stringify(resultData),
        contentType: 'application/json',
    }).done(function (data) {
        console.log("data : " + data.result.content);
        console.log("dctna : " + data.cnt);

        // Ag-Grid의 행 데이터 설정
        gridApi.setGridOption('rowData', data.result.content);

    }).fail(function (xhr, textStatus, errorThrowna) {
        if (xhr.status === 400) {
            // HTTP 상태 코드가 400인 경우 처리
            var errorMessage = xhr.responseJSON.msg;
            alert(errorMessage);
        } else {
            // 그 외의 경우 처리
        }
    });
}

$(document).ready(function () {
    init();
});

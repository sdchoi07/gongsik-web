var itemListGrid = document.querySelector('#itemGrid');
var gridOptions; // 전역 변수로 변경
var gridApi; // 전역 변수로 변경

var init = function() {

	// Ag-Grid 초기화
	initGrid();

	//itemList
	itemLst();



}

var itemLst = function() {
	var token = localStorage.getItem("accessToken");
	$.ajax({
		url: '/api/admin/itemList',
		type: 'GET',
		headers: {
			'Authorization': 'Bearer ' + token
		},
	}).done(function(data) {
		// Ag-Grid의 행 데이터 설정
		gridApi.setGridOption('rowData', data.list);
		console.log(data.list)
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

var initGrid = function() {
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
			{ headerName: '대분류명', field: 'invenLClsNm', autoSize: true },
			{ headerName: '중분류명', field: 'invenMClsNm', autoSize: true },
			{ headerName: '소분류명', field: 'invenSClsNm', autoSize: true },
			{ headerName: '대분류 번호', field: 'invenLClsNo', autoSize: true },
			{ headerName: '중분류 번호', field: 'invenMClsNo', autoSize: true },
			{ headerName: '소분류 번호', field: 'invenSClsNo', autoSize: true },
			{
				headerName: '가격', field: 'itemPrice', autoSize: true, valueFormatter: function(params) {
					// 숫자를 특정 형식으로 포맷하고 반환
					return params.value.toLocaleString(); // 예시: 소수점 이하 2자리까지 표시
				}
			},
			{
				headerName: '누적 판매 갯수', field: 'itemSalesCnt', autoSize: true, valueFormatter: function(params) {
					// 숫자를 특정 형식으로 포맷하고 반환
					return params.value.toLocaleString(); // 예시: 소수점 이하 2자리까지 표시 },
				}
			}
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
		onSelectionChanged: function() {
			// 선택 변경이 발생했을 때의 동작
		}
	};

	// Ag-Grid 초기화
	gridApi = agGrid.createGrid(itemListGrid, gridOptions);


}
$(document).ready(function() {
	init();
});

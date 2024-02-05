var init = function () {
	
	
	//유저정보
	_accountList();
	
	//주문목록조회
	_orderList();
	

}

		var gridDiv = document.querySelector('#orderGrid');
		var gridOptions = {
			defaultColDef: {
			    // 기본적으로 모든 열에 적용되는 속성을 정의합니다.
			    sortable: true, // 열 정렬 허용
			    filter: true,   // 열 필터링 허용
			    resizable: true, // 열 크기 조절 허용
			    width: 150,      // 열의 기본 너비
			  },
		  columnDefs: [
		    { headerName: '', field: '' },
		    { headerName: '사진', field: 'itemPic' },
		    { headerName: '목록', field: 'itemNm' },
		    { headerName: '개수', field: 'itemCnt' },
		    { headerName: '주문상태', field: 'orderSt' },
		  ],
		  rowData: [
		    { make: 'Toyota', model: 'Celica', price: 35000 },
		    // 데이터 계속 추가
		  ],
		};
		
		new agGrid.Grid(gridDiv, gridOptions);


var _orderList = function(){
	$.ajax({
		url : "/api/mypage/orderList",
	    type: 'POST',
        data: JSON.stringify(resultData), // form 데이터를 JSON 문자열로 변환하여 전송
        contentType: 'application/json',
	}).done(function(data){
			
		if(data.code === 'success'){
			 var usrGrade = data.result.usrGrade;
	  		$('#levelNumber').text(usrGrade);
	  	
		}else{
			alert(data.msg);
		}
	}).fail(function(xhr, textStatus, errorThrowna) {
       if (xhr.status === 400) {
            // HTTP 상태 코드가 400인 경우 처리
            var errorMessage = xhr.responseJSON.msg; // 혹은 다른 방식으로 오류 메시지 추출
            alert(errorMessage);
        } else {
        }
    });
}
$(document).ready(function () {
    init();
});

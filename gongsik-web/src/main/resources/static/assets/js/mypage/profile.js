var _init = function () {
	
	//기본 셋팅
	_profile();
	
	
	//인증요청;
	$('#authNo').on('click',function(event){
			 event.preventDefault();
			 _confirmBtn();
	   });

}

var _profile = function(){
	 var data = localStorage.getItem("data")
	 var result = JSON.parse(data);
	 var usrId = result.usrId;
	 var usrNm = result.usrNm;
	 var usrBrith = result.usrNo;
	 usrBrith = usrBrith.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1.$2.$3');
	 var usrPhNo = result.usrPhone;
	 usrPhNo = usrPhNo.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
	 console.log(result);
	 var usrSex = result.usrSex;
	  $('#usrId').val(usrId);
	  $('#usrNm').val(usrNm);
	  $('#usrBirth').val(usrBrith);
	  $('#usrPhNo').val(usrPhNo);
	  if(usrSex === 'M'){
		  $('#genderM').prop('checked',true);
	  }else{
		  $('#genderF').prop('checked',true);
	  }
	
	$('#verificationDiv').css("display", "block");
       
       
}
var _confirmBtn =function() {
    var verificationDiv = $('<div/>', {
        id: 'verificationDiv',
        class: 'form-group',
        html:'<div class="d-flex align-items-center">'+ 
        	'<img src="/vendor/third/img/plot.png" class ="plot-img">' +
            '<span style="white-space: nowrap;"  class="spanText">휴대폰 번호</span>' +
            '</div>'+
            '<div class="input-group">' +
            '<input id="usrPhNo" name="usrPhNo" type="usrPhNo" class="form-control">' +
            '<div class="input-group-append">' +
            '<button class="btn btn-dark rounded-1" type="button" style="font-size: 13px; width: 80px;">확인</button>' +
            '</div></div></div>'
    });

    // verificationDiv를 body에 추가
    $('#phAuth').after(verificationDiv);
}

$(document).ready(function () {
    _init();
});

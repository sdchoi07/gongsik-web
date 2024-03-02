function init() {

	_selectDetail();
	$('.modiBtn').css('display', 'none');
	$('.delBtn').css('display', 'none');

	$('#modiBtn').on('click', function() {
		moveModiPage();
	})

	$('#delBtn').on('click', function() {
		delPosts();
	})

	$('#reviewBtn').on('click', function() {
		reviewBtn();
	})

	_selectReview();
}

var _selectReview = function() {
	var itemKey = $('#itemKey').val();

	$.ajax({
		url: '/api/posts/selectReview/' + itemKey,
		type: 'GET',
	}).done(function(data) {
		_tableReview(data);
	}).fail(function(xhr, textStatus, errorThrowna) {
	});
}

var reviewBtn = function(replyNo) {
	var itemKey = $('#itemKey').val();
	resultData = {};
	var usrId = localStorage.getItem("usrId");
	var token = localStorage.getItem("accessToken");
	var reviewText = $('#reviewText').val();
	var replyText = $('#replyText').val();
	var postsNm = $('#postsNm').val();
	resultData.postsNo = itemKey;
	resultData.usrId = usrId;
	resultData.reviewText = reviewText;
	resultData.replyNo = replyNo;
	resultData.replyText = replyText;
	resultData.postsNm = postsNm;
	$.ajax({
		url: '/api/posts/reviewSave',
		type: 'POST',
		data: JSON.stringify(resultData),
		contentType: 'application/json',
		headers: {
			'Authorization': 'Bearer ' + token
		},
	}).done(function(data) {
		if (data.code === 'success') {
			alert(data.msg);
			window.location.href = `/posts/postsDetail?postsNo=${data.replyNo}&postsNm=${data.replyTitle}`
		}
	}).fail(function(xhr, textStatus, errorThrowna) {
	});
}

var moveModiPage = function() {
	window.location.href = '/posts/createPost?postsNo=' + $('#itemKey').val();
}

var _selectDetail = function() {
	var itemKey = $('#itemKey').val();
	var cur = new Date();
	cur = cur.toDateString();

	$.ajax({
		url: '/api/posts/postsDetail/' + itemKey,
		type: 'GET',
	}).done(function(data) {
		$('#postsUsrNm').text(data.result.postsUsrNm);

		var postDate = new Date(data.result.postsYMD);
		postDate = postDate.toDateString();
		if (cur === postDate) {
			$('#postsDate').text(data.result.postsTime);
		} else {
			$('#postsDate').text(data.result.postsYMD);
		}
		$('#postsViewCnt').text(" 조회수 " + data.result.postsViewCnt);
		$('.postsDetail').append(data.result.postsText);
		var postsId = data.result.postsUsrId;
		var usrId = localStorage.getItem('usrId');

		if (usrId !== null) {
			if (usrId === postsId) {
				$('#modiBtn').css('display', 'on');
				$('#delBtn').css('display', 'on');
			} else {
				$('#modiBtn').css('display', 'none');
				$('#delBtn').css('display', 'none');
			}
		} else {
			$('#modiBtn').css('display', 'none');
			$('#delBtn').css('display', 'none');
			$('.reviewForm').css('display', 'none');
		}
	}).fail(function(xhr, textStatus, errorThrowna) {
	});
}


var delPosts = function() {
	var itemKey = $('#itemKey').val();

	$.ajax({
		url: '/api/posts/postsDel/' + itemKey,
		type: 'GET',
	}).done(function(data) {
		if (data.code === 'success') {
			alert(data.msg);
			window.location.href = '/posts/sharePost'
		}
	}).fail(function(xhr, textStatus, errorThrowna) {
	});
}



var _tableReview = function(data) {
	//인기 게시물

	var reviewsTableList = $(".reviews");
	var reviewList = data.result;
	var usrId = localStorage.getItem("usrId");
	reviewsTableList.empty();
	var cur = new Date();
	cur = cur.toDateString();
	// 데이터를 기반으로 동적으로 테이블 생성
	var keyNo = 0;
	var keyMiniNo = 0;
	reviewList.forEach(list => {
		var replyDate = new Date(list.replyYMD);
		replyDate = replyDate.toDateString();
		if (keyNo !== list.replyNo) {
			keyMiniNo = 0;
			keyNo = list.replyNo
			var row = $("<li>").addClass("reviewlists list-group-item mt-2").css({
				'display': 'flex',
				'justify-content': 'space-between',
				'border': `1px solid #ccc`
			});

			row.append(`
							    <div class="name-content" style="font-size: 0.8rem;">
							        <span style="margin-right: 5px;">${list.replyNm}</span><span>${cur === replyDate ? `${list.replyTime}` : `${list.replyYMD}`}</span>
							    </div>
							    <div class="date" style="font-size: 1.5rem; display: flex; justify-content: space-between; align-items: center; width: 100%;">
							        <span>${list.replyText}</span>
							    </div>
						`);

			if (usrId !== null) {
				var buttonsHTML = '<div class="d-flex align-items-center ml-auto mt-2">' +
					'<button type="button" class="btn btn-link border-0 fw-bold ml-2" onclick="openReply((' + list.replyNo + '))" style="color: #000000; font-family: \'Noto Sans KR\', sans-serif; text-decoration: none; font-size: 0.8rem;">답글</button>';

				if (usrId === list.replyId) {
					buttonsHTML += '<button type="button" class="btn btn-link border-0 fw-bold ml-2" onclick="delReview((' + list.replyNo + '))" style="color: #000000; font-family: \'Noto Sans KR\', sans-serif; text-decoration: none; font-size: 0.8rem;">삭제</button>';
				}

				buttonsHTML += '</div>';

				row.find('.date').append(buttonsHTML);
			}

			row.append(`<hr style="width:100%; margin-top:0px"/><div class="d-flex align-items-center" id="divider-${list.replyNo}" style="width: 100%;"></div>`);

			reviewsTableList.append(row);
		} else {

			if (keyMiniNo !== 0) {
				var buttonsHTML = ""; // 버튼 HTML 초기화
				// 사용자 ID가 리뷰 작성자와 일치하는 경우에만 삭제 버튼 추가
				if (usrId === list.replyId) {
					buttonsHTML = `<button type="button" class="btn btn-link border-0 fw-bold ml-2" onclick="delReviewMini(${list.replyNo}, ${list.replyMiniNo})" style="color: #000000; font-family: 'Noto Sans KR', sans-serif; text-decoration: none; font-size: 0.8rem;">삭제</button>`;
				}
				var ulReply = $(`.reviewAndReview-${list.replyNo}`);
				var row = $("<li>").addClass("list-group-item");


				// 셀 생성 및 추가
				row.append(`
		      				 <div class="name-content"  style="font-size: 0.8rem;">
								<span style="margin-right: 5px;">${list.replyNm}</span><span>${cur === replyDate ? `${list.replyTime}` : `${list.replyYMD}`}</span>
							</div>
							 <div class="date" style="font-size: 1.2rem; display: flex; justify-content: space-between; align-items: center; width: 100%;">
							        <span>${list.replyText}</span>
							        ${buttonsHTML}
							    </div>
							<div class="divider d-flex align-items-center" style="width: 100%;">
						</div>
  					  `);

				ulReply.append(row);
			} else if (list.replyMiniNo !== keyMiniNo) {
				var reply = $(`#divider-${list.replyNo}`);
				keyMiniNo = list.replyMiniNo;
				var buttonsHTML = ""; // 버튼 HTML 초기화
				// 사용자 ID가 리뷰 작성자와 일치하는 경우에만 삭제 버튼 추가
				if (usrId === list.replyId) {
					buttonsHTML = `<button type="button" class="btn btn-link border-0 fw-bold ml-2" onclick="delReviewMini(${list.replyNo}, ${list.replyMiniNo})" style="color: #000000; font-family: 'Noto Sans KR', sans-serif; text-decoration: none; font-size: 0.8rem;">삭제</button>`;
				}

				var row = "";
				row = `<ul class="reviewAndReview-${list.replyNo} list-group list-group-flush">` +
					'<li class="list-group-item" style="width:1200px">' +
					'<div class="name-content" style="font-size: 0.8rem;">' +
					'<span style="margin-right: 5px;">' + list.replyNm + '</span><span>' + (cur === replyDate ? list.replyTime : list.replyYMD) + '</span>' +
					'</div>' +
					'<div class="date" style="font-size: 1.2rem; display: flex; justify-content: space-between; align-items: center; width: 100%;">' +
					'<span>' + list.replyText + '</span>' +
					`${buttonsHTML}` +
					'</div>' +
					'<div class="divider d-flex align-items-center" style="width: 100%;"></div>' +
					'</li>';

				reply.append(row);
			}
		}
	});
}
var openReply = function(replyNo) {

	var replyForm = $(`#divider-${replyNo}`)
	var reviewForm = $(`.replyForm-${replyNo}`);
	console.log(reviewForm.length);
	if (reviewForm.length === 0) {
		var row = `
            <div class="replyForm-${replyNo} bg-gray-f6 px-4 py-3 flex-grow-1 border p-3 m-1 col-md-12"style="min-height: 150px; ">
                <span>댓글 작성</span>
                <div class="mt-2" style="height: 50px; width: 100%;">
                    <textarea id="replyText" style="height: 100%; width: 100%;"></textarea>
                    <button type="submit"
                        class="btn btn-primary btn-sm btn-block fw-bold border-left border-right border-top border-bottom"
                        onclick="replySave(${replyNo})"
                        style="background-color: rgba(3, 199, 90, 0.12); font-family: 'Noto Sans KR', sans-serif; color: #009f47; border-radius: 0; width: 50px; height: 40px; margin-right: 10px;">
                        등록
                    </button>
                </div>
            </div>
        `;
		replyForm.after(row);
	} else {
		reviewForm.remove()
	}
}

var delReview = function(replyNo) {

	var itemKey = $('#itemKey').val();
	var resultData = {};
	var usrId = localStorage.getItem("usrId");
	var token = localStorage.getItem("accessToken");
	var postsNm = $('#postsNm').val();
	resultData.replyNo = replyNo;
	resultData.postsNo = itemKey;
	resultData.usrId = usrId;
	resultData.postsNm = postsNm;
	$.ajax({
		url: '/api/posts/replyDel',
		type: 'POST',
		data: JSON.stringify(resultData),
		contentType: 'application/json',
		headers: {
			'Authorization': 'Bearer ' + token
		},
	}).done(function(data) {
		if (data.code === 'success') {
			alert(data.msg);
			window.location.href = `/posts/postsDetail?postsNo=${data.replyNo}&postsNm=${data.replyTitle}`
		}
	}).fail(function(xhr, textStatus, errorThrowna) {
	});
}

var delReviewMini = function(replyNo, replyMiniNo){
	var itemKey = $('#itemKey').val();
	var resultData = {};
	var usrId = localStorage.getItem("usrId");
	var token = localStorage.getItem("accessToken");
	var postsNm = $('#postsNm').val();
	resultData.replyNo = replyNo;
	resultData.postsNo = itemKey;
	resultData.replyMiniNo = replyMiniNo;
	resultData.usrId = usrId;
	resultData.postsNm = postsNm;
	$.ajax({
		url: '/api/posts/replyDel',
		type: 'POST',
		data: JSON.stringify(resultData),
		contentType: 'application/json',
		headers: {
			'Authorization': 'Bearer ' + token
		},
	}).done(function(data) {
		if (data.code === 'success') {
			alert(data.msg);
			window.location.href = `/posts/postsDetail?postsNo=${data.replyNo}&postsNm=${data.replyTitle}`
		}
	}).fail(function(xhr, textStatus, errorThrowna) {
	});
}
var replySave = function(replyNo) {
	reviewBtn(replyNo);
}
$(document).ready(function() {
	init();
});
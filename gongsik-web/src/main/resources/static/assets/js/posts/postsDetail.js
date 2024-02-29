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
	resultData.postsNo = itemKey;
	resultData.usrId = usrId;
	resultData.reviewText = reviewText;
	resultData.replyNo = replyNo;
	resultData.replyText = replyText;

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
			window.location.href = '/posts/sharePost'
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
				$('.reviewForm').css('display', 'on');
			} else {
				$('#modiBtn').css('display', 'none');
				$('#delBtn').css('display', 'none');
				$('.reviewForm').css('display', 'none');
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
		var reviewDate = new Date(list.reviewYMD);
		reviewDate = reviewDate.toDateString();
		if (keyNo !== list.reviewNo) {
//			if (keyMiniNo > 0) {
//				var reply = $(`#divider-${list.keyNo}`);
//				var row = `</ul>`
//				reply.append(row);
//			}
			keyMiniNo = 0;
			keyNo = list.reviewNo
			// jQuery 객체로 초기화
			var row = $("<li>").addClass("list-group-item").css({
				'display': 'flex',
				'justify-content': 'space-between',
			});

			row.append(`
							    <div class="name-content" style="font-size: 0.8rem;">
							        <span style="margin-right: 5px;">${list.reviewNm}</span><span>${cur === reviewDate ? `${list.reviewTime}` : `${list.reviewYMD}`}</span>
							    </div>
							    <div class="date" style="font-size: 1.5rem; display: flex; justify-content: space-between; align-items: center; width: 100%;">
							        <span>${list.reviewText}</span>
							    </div>
						`);

			if (usrId !== null) {
				var buttonsHTML = '<div class="d-flex align-items-center ml-auto mt-2">' +
					'<button type="button" class="btn btn-link border-0 fw-bold ml-2" onclick="openReply((' + list.reviewNo + '))" style="color: #000000; font-family: \'Noto Sans KR\', sans-serif; text-decoration: none; font-size: 0.8rem;">답글</button>';

				if (usrId === list.reviewId) {
					buttonsHTML += '<button type="button" class="btn btn-link border-0 fw-bold ml-2" style="color: #000000; font-family: \'Noto Sans KR\', sans-serif; text-decoration: none; font-size: 0.8rem;">삭제</button>';
				}

				buttonsHTML += '</div>';

				row.find('.date').append(buttonsHTML);
			}

			row.append(`<hr style="width:100%"/><div class="d-flex align-items-center" id="divider-${list.reviewNo}" style="width: 100%;"></div>`);

			// jQuery 객체를 postsTable에 추가
			reviewsTableList.append(row);
		} else {
			var reply = $(`#divider-${list.reviewNo}`);
			if (keyMiniNo !== 0) {
				console.log("??" + reply.html())
				var row = $("<li>").addClass("list-group-item");


				// 셀 생성 및 추가
				row.append(`
		      				 <div class="name-content"  style="font-size: 0.8rem;">
								<span>${list.reviewNm}</span><span>${cur === reviewDate ? `${list.reviewTime}` : `${list.reviewYMD}`}</span>
							</div>
							<div class="date" style="font-size: 0.8rem;">
								 <span>${list.reviewText}</span>
							</div>
							<div class="divider d-flex align-items-center" style="width: 100%;">
						</div>
  					  `);

				// jQuery 객체를 postsTable에 추가
				reply.append(row);
			} else if (list.reviewMiniNo !== keyMiniNo) {
				console.log("plz :" + row)
				keyMiniNo = list.revieMiniNo;
				var row = '<ul class="reviewAndReview list-group list-group-flush">' +
					'<li class="list-group-item">' +
					'<div class="name-content" style="font-size: 0.8rem;">' +
					'<span>' + list.reviewNm + '</span><span>' + (cur === reviewDate ? list.reviewTime : list.reviewYMD) + '</span>' +
					'</div>' +
					'<div class="date" style="font-size: 0.8rem;">' +
					'<span>' + list.reviewText + '</span>' +
					'</div>' +
					'<div class="divider d-flex align-items-center" style="width: 100%;"></div>' +
					'</li>';

				// jQuery 객체를 postsTable에 추가
				reply.html(row);
				console.log(reply.html())
			}
		}
	});
}
var openReply = function(reviewNo) {

	var replyForm = $(`#divider-${reviewNo}`)
	if (replyForm.is(':empty')) {
		var row = `
            <div class="replyForm bg-gray-f6 px-4 py-3 flex-grow-1 border p-3 m-1 col-md-12"style="min-height: 150px; ">
                <span>댓글 작성</span>
                <div class="mt-2" style="height: 50px; width: 100%;">
                    <textarea id="replyText" style="height: 100%; width: 100%;"></textarea>
                    <button type="submit"
                        class="btn btn-primary btn-sm btn-block fw-bold border-left border-right border-top border-bottom"
                        onclick="replySave(${reviewNo})"
                        style="background-color: rgba(3, 199, 90, 0.12); font-family: 'Noto Sans KR', sans-serif; color: #009f47; border-radius: 0; width: 50px; height: 40px; margin-right: 10px;">
                        등록
                    </button>
                </div>
            </div>
        `;
		replyForm.append(row);
	} else {
		replyForm.empty()
	}
}

var replySave = function(replyNo) {
	reviewBtn(replyNo);
}
$(document).ready(function() {
	init();
});
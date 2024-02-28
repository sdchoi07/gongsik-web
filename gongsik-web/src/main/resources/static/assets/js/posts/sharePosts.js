var usrId = localStorage.getItem('usrId');
var currentPage = 1;
var gubun = "";
function init() {
	if (usrId !== null) {
		$('.chkPost').css('display', 'block');
		$('.chkPost').css('display', 'block');
	}

	$('.postsList').click(function() {
		gubun = $(this).text();
		currentPage = 1;
		selectPosts(gubun);
		// 여기에서 원하는 작업을 수행할 수 있습니다.
	});

	selectPosts();
}

function selectPosts(gubun) {
	console.log(gubun);
	var resultData = {};
	resultData.currentPage = currentPage;
	resultData.gubun = gubun;
	resultData.usrId = usrId;
	$.ajax({
		url: '/api/posts/selectPosts',
		type: "POST",
		data: JSON.stringify(resultData),
		contentType: 'application/json',
		success: function(result) {
			_tableData(result);
			_tablePopData(result);

		},
		error: function(e) {
		},
	});
}

var _tableData = function(data) {
	if (data.cnt === 0) {
		alert("조회할 게시글이 없습니다.");
		currentPage--;
		return;
	}
	_createPage(data);
	var postsTable = $(".postsTable");
	// 기존에 있는 내용 비우기
	postsTable.empty();


	// 비교할 날짜를 구하는 예시 (현재 날짜로부터 한 달 전)
	var cur = new Date();
	cur = cur.toDateString();

	var list = data.list;

	// 데이터를 기반으로 동적으로 테이블 생성
	list.forEach(posts => {
		var postDate = new Date(posts.postsYMD);
		postDate = postDate.toDateString();
		// jQuery 객체로 초기화
		var row = $("<div class='blog-entry d-flex blog-entry-search-item mt-4 align-items-center border p-3'></div>");

		// 셀 생성 및 추가
		row.append(`
        <a href="/posts/postsDetail?postsNo=${posts.postsNo}&postsNm=${posts.postsNm}" class="img-link me-4">
            <img src="${posts.postsUrl === null ? '/vendor/third/img/logo.jpg' : `/vendor/third/img/${posts.postsUrl}`}" alt="Image" class="img-fluid" style="width:200px; height:200px;">
        </a>
        <span class="date">${posts.postsUsrNm}
        <div class="">
		    <h2><a href="/posts/postsDetail?postsNo=${posts.postsNo}&postsNm=${posts.postsNm}" style="">${posts.postsNm}</a></h2>
		    <span class="date">${cur === postDate ? `${posts.postsTime}` : `${posts.postsYMD}`} <span>${posts.postsGubunNm}</span></span>
		    <span style="font-size: 0.8em; display: block; margin-top: 5px;">조회수 ${posts.postsViewCnt}</span>
		</div>

    `);

		// jQuery 객체를 postsTable에 추가
		postsTable.append(row);
	});

}
var _tablePopData = function(data) {
	//인기 게시물

	var popTableList = $(".popList");
	var popList = data.popList;
	popTableList.empty();
	var cur = new Date();
	cur = cur.toDateString();
	// 데이터를 기반으로 동적으로 테이블 생성
	popList.forEach(popPosts => {
		var postDate = new Date(popPosts.postsYMD);
		postDate = postDate.toDateString();
		// jQuery 객체로 초기화
		var row = $("<li>").css("display", "flex").css("align-items", "center").css("margin-bottom", "10px");


		// 셀 생성 및 추가
		row.append(`
        <img src="${popPosts.postsUrl === null ? '/vendor/third/img/logo.jpg' : `/vendor/third/img/${popPosts.postsUrl}`}" alt="Image placeholder" class="me-2 rounded" style="width: 30%;">
        <div class="text">
            <h4>${popPosts.postsNm}</h4>
            <div class="post-meta">
                <span>${cur === postDate ? `${popPosts.postsTime}` : `${popPosts.postsYMD}`}</span>
            </div>
        </div>
    `);

		// jQuery 객체를 postsTable에 추가
		popTableList.append(row);
	});
}

var _createPage = function(data) {
	var startPage = data.startPage;
	var endPage = data.endPage;
	var currentPage = data.currentPage;
	var totalPages = data.totalPages;

	var paginationContainer = document.createElement('div');
	paginationContainer.className = 'd-flex justify-content-left';

	var ul = document.createElement('ul');
	ul.className = 'pagination';

	// Previous 버튼 생성
	var previousLi = document.createElement('li');
	previousLi.className = 'page-item';
	if (currentPage === 1) {
		previousLi.classList.add('disabled');
	}
	var previousLink = document.createElement('a');
	previousLink.href = '#';
	previousLink.className = 'page-link';
	previousLink.textContent = '이전';
	previousLink.addEventListener('click', function() {
		if (currentPage > 1) {
			selectPage(currentPage - 1);
		}
	});
	previousLi.appendChild(previousLink);
	ul.appendChild(previousLi);

	// 페이지 번호 생성
	for (var pNo = startPage; pNo <= endPage; pNo++) {
		var pageLi = document.createElement('li');
		pageLi.className = 'page-item';
		if (currentPage == pNo) {
			pageLi.classList.add('active');
		}
		var pageLink = document.createElement('a');
		pageLink.href = '#';
		pageLink.className = 'page-link';
		pageLink.textContent = pNo;
		pageLink.addEventListener('click', function() {
			selectPage(parseInt(this.textContent));
		});
		pageLi.appendChild(pageLink);
		ul.appendChild(pageLi);
	}

	// Next 버튼 생성
	var nextLi = document.createElement('li');
	nextLi.className = 'page-item';
	var nextLink = document.createElement('a');
	if (totalPages === currentPage) {
		nextLi.classList.add('disabled');
	}
	nextLink.href = '#';
	nextLink.className = 'page-link';
	nextLink.textContent = '다음';
	nextLink.addEventListener('click', function() {

		if (endPage <= totalPages) {
			selectPage(currentPage + 1);
		}
	});
	nextLi.appendChild(nextLink);
	ul.appendChild(nextLi);

	paginationContainer.appendChild(ul);
	$("#paginationContainer").html(paginationContainer);
};

function selectPage(page) {
	var resultData = {};
	resultData.currentPage = page || 1; // 기본값은 1페이지
	console.log(gubun);
	resultData.gubun = gubun;
	resultData.usrId = usrId;
	currentPage = resultData.currentPage; // 현재 페이지 갱신

	$.ajax({
		url: '/api/posts/selectPosts',
		type: "POST",
		data: JSON.stringify(resultData),
		contentType: 'application/json',
		success: function(result) {
			_tableData(result);
			_createPage(result);
		},
		error: function(e) {
		},
	});
}

$(document).ready(function() {
	init();
});
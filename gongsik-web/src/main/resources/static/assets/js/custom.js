 $(".nav-item.admin").hide();
  
//헤더 스크롤 고정
/*var hearFix = function(){
		$(window).scroll(function() {
                var header = $('#header');
                if ($(this).scrollTop() > 0) {
                    header.addClass('fixed-header');
                } else {
                    header.removeClass('fixed-header');
                }
            });
}*/
//메뉴 조회
function _menuList(){

	$.ajax({
	url : "/api/main/menuList",
	type: "GET",
	contentType: 'application/json',
	}).done(function(data){
		 menus(data);
		 sessionStorage.setItem('cachedData', JSON.stringify(data)); // 데이터를 세션 스토리지에 저장
		
		  
	});
};
// 페이지 이동 시에 데이터를 사용하는 함수
function useCachedData() {
  const cachedData = sessionStorage.getItem('cachedData'); // 세션 스토리지에서 데이터 가져오기

  if (cachedData) {
    // 가져온 데이터를 사용하여 원하는 동작 수행
   // console.log('Data from cache:', JSON.parse(cachedData));
    //var data = JSON.parse(cachedData);
  	 menus(cachedData)
  } else {
    // 캐시된 데이터가 없는 경우 다시 데이터를 가져오고 캐싱
    
    _menuList();
  }
}

//메뉴 렌더링
function menus(dataMenu){
	var data = JSON.parse(dataMenu);

	 var menuList = $('#menuList'); 
	    // menus를 타임리프 반복문으로 렌더링
	    var menuItem ="";
    	var boolean = true;
	   	for(var i = 0 ;i < data.length; i++){
			if (i == data.length-1 || i== data.length-2){
				 menuItem += '</ul>';
		         menuItem += '</li>';
				 menuItem +='<li class="nav-item"><a class="nav-link" href="#">'+ data[i].menuNm+ '</a></li>';
			}else{
		        if (data[i].menuLevelNo == 0) {
		        	if(!boolean){
			            menuItem += '</ul>';
				        menuItem += '</li>';
				        boolean = true;
				        chk = false;
					}
		            menuItem += '<li class="nav-item dropdown">';
		            menuItem += '<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">' + data[i].menuNm + '</a>';
		            menuItem += '<ul class="dropdown-menu dropdown-menu-end" id="menus" aria-labelledby="navbarDropdown">';
		        }
		        else if (data[i].menuLevelNo == 1) {
					boolean = false;
		            menuItem += '<li><a class="dropdown-item" href="blog-home.html">' + data[i].menuNm + '</a></li>';
		    	    }
				}
			}
		 menuList.append(menuItem);
}

//form정보 가져오기
$.fn.serializeObject = function() {
  "use strict"
  var result = {}
  var extend = function(i, element) {
    var node = result[element.name]
    if ("undefined" !== typeof node && node !== null) {
      if ($.isArray(node)) {
        node.push(element.value)
      } else {
        result[element.name] = [node, element.value]
      }
    } else {
      result[element.name] = element.value
    }
  }

  $.each(this.serializeArray(), extend)
  return result
}

$(document).ready(function() {
	useCachedData();
});
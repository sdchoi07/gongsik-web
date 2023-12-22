 $(".nav-item.admin").hide();
  
  
//메뉴 조회
var menuList = function(){
	
var restServer = $("#restServer").val();
	$.ajax({
	url : restServer+"/api/main/menuList",
	type: "GET",
	dataType: 'json'
	}).done(function(data){
		 var menuList = $('#menuList'); 
	    // menus를 타임리프 반복문으로 렌더링
	    var menuItem ="";
    	var boolean = true;
    	var chk = true;
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
	});
};



$(document).ready(function() {
  menuList();
});
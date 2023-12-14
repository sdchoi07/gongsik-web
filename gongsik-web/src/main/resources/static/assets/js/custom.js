document.addEventListener("DOMContentLoaded", function() {
 $(".nav-item.admin").hide();
 
 
 });
 // GET 요청 보내기
axios.get('http://localhost:9090/api/menuList')
  .then(function (response) {
    // 성공적으로 데이터를 받아온 경우
    console.log(response.data);
  })
  .catch(function (error) {
    // 에러 발생 시
    console.error(error);
  });
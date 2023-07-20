var URLAPI = "http://47.105.132.26:8080/";
var WebSocketURL = "ws://47.105.132.26:8080/websocket";
// var URLAPI = "http://192.168.1.27:8180/wisdom_farming_site/";
// checkLogin();
// 写cookies  默认是保存30天
function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";path= /;expires=" + exp.toGMTString();
}

// 读取cookies
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

// 获取url参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function checkLogin() {
  var loginInfo = getCookie("loginInfo");
  var href = location.href;
  if (href.indexOf("login") == -1 && loginInfo == null) {
    sessionStorage.clear();
    location.href = "../login.html"
  }
}

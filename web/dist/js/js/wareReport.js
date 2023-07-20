(function(){

    $(function(){

        //时间
        var mydate = new Date();
        var y = mydate.getFullYear();
        var m = mydate.getMonth()+1;
        if(parseInt(m)<10){
        	m='0'+m;
        }
        var d = mydate.getDate();
        if(parseInt(d)<10){
        	d='0'+d;
        }

        $("#start_time").val(y+"-"+m+"-"+d);
        $("#end_time").val(y+"-"+m+"-"+d);


        $(".temperature").click(function(){
            var that=$(this);
            that.addClass("activeBg").siblings().removeClass("activeBg");
            getData();
        })

        ////2.5  select发生改变
        $("#gf_num_list").change(function(){
        	getData();
        })
        $("#device_id_list").change(function(){
        	getData();
        })
        //图表
    })
})()
function initData(){
  // var loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
	//获取列表
	$.ajax({
		type:"POST",
    // rl:"actionServlet",
	 		url: URLAPI + "actionServlet",
	 		data: {
        "actionName":"webService",
        "method":"getGroundFishpondList",
        "companyId": loginInfo.id,
        "userType": type_,
        "token": getCookie("token")
      },
	 		dataType:"JSON",
	 		success:function(data){
	 			if(data.statusCode == 100){
				toastr.error('请联系管理员','未拥有权限');
				return;
			}
	 			if(data.statusCode == 1 && data.result.length > 0){
          // return false;
	 				// var searchGf = data.message.split(',')[1];
          var options = "";
          data.result.forEach(function(item) {
            options += '<option value="'+item.number+'">'+item.displayName+'</option>'
          })
          $("#gf_num_list").append(options);

	 				//获取设备列表
	 				$.ajax({
	 	    			type:"POST",
            // rl: "actionServlet",
            url: URLAPI + "actionServlet",
	 	     	 		data:{
                "actionName":"webService",
                "method":"getDeviceListTj",
                "companyId": loginInfo.id,
                "userType": type_,
                "token": getCookie("token")
              },
	 	     	 		dataType:"JSON",
	 	     	 		success:function(data){
 	 	     	 		if(data.statusCode == 100){
 			 				toastr.error('请联系管理员','未拥有权限');
 			 				return;
 			 			}
	 	     	 			if(data.statusCode == 1){
	 	     	 			var searchDevice = data.message;
	 	     	 				for (var i = 0; i < data.result.length; i++) {
 	 	     	 				var option = "<option ";
	 	 							if(data.result[i].id == searchDevice){
	 	 								option+=" selected='selected' ";
	 	 							}
	 	 							option+="value='"+data.result[i].id+"'>"+data.result[i].deviceName+"</option>"
                  //var option = "<option value='"+data.result[i].id+"'>"+data.result[i].deviceName+"</option>"
 	 								$("#device_id_list").append(option);
							      }
	 	     	 				getData();
	 	     	 			}
	 	     	 		}
	 	       });
	 			}
	 		}
 	});
}

function getData(){
  // var loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
	//获取数据
	var strategy = $(".activeBg").attr("data-value")
	var gfNum = $("#gf_num_list").val();
	var deviceNum = $("#device_id_list").val();
	var startTime = $("#start_time").val();
	var endTime = $("#end_time").val();
	$.ajax({
  	type:"POST",
    // l:"actionServlet",
    url: URLAPI + "actionServlet",
		data:{
    	"actionName": "gridService",
    	"method": "dateByDeviceNum",
      "areaNum": gfNum,
    	"strategy": strategy,
    	"deviceNum": deviceNum || 1,
    	"startTime": startTime,
    	"endTime": endTime,
      "companyId": loginInfo.id,
      "userType": type_,
      "isWarehouse": 1,
      "token": getCookie("token")
    },
		dataType:"JSON",
		success:function(data){
  		if(data.statusCode == 100){
    		toastr.error('请联系管理员','未拥有权限');
    		return;
  		}
  		if(strategy=='now'){
  			var count=8;
  		}else{
  			var count=5;
  		}
  		if(data.statusCode == 1){
    		var xlist= data.result.x;
    		var ylist = data.result.y;
    		var chatType = $("#search_chat_type").val();
  			if(chatType == '0'){
          chatType="spline";
    	 	}else{
    	 	   chatType="column";
  	 	  }
   			Highcharts.setOptions({
   				lang:{
   					printChart:'打印',
   					downloadXLS:"下载",
   				},
   			})
   			var companyName = loginInfo.name;
   			var gfName = $("#gf_num_list").find("option:selected").text();
   			var deviceName = $("#device_id_list").find("option:selected").text();
   			var deviceType = $("#device_id_list").val();
   			var unit = getDeviceUnit(deviceType);
   			var chatName = companyName + "-" + gfName + "-" + deviceName;

   			hChat = new Highcharts.Chart('container1' ,{
        	chart: {
        	   type:chatType,
            //zoomType:'x'
          },
    	    credits: {//去掉右下角官网链接
    	       enabled: false
      	  },
          exporting:{
          	filename:chatName
          },
          title: {
          	text: '',
              x: -20 ,//center
              style:{
              	color: '#fff',
              }
          },
          subtitle: {
          	text: '',
            x: -20
          },
          xAxis: {//X轴分组
          	name:"时间",
          	tickInterval:count,
          	categories:  xlist,
          },
          yAxis: {
          	title: {
              	text: deviceName + unit ,
                  align: 'middle',
                  style:{
                  	color:"blue",
                      fontSize:"12px"
                  }
            },
            plotLines: [{
            	value: 0,//水平参照线
                width: 1,//水平参照线宽度
                color: '#808080'
            }],
          },
          tooltip: {
            valueSuffix:'',//提示框显示单位
            formatter:function(){
               var data = this.points;
               var html = "";
               html='<div style="color:#000;">'+$("#device_id_list").find("option:selected").text()+'<br/>'+'时间:'+this.x+'<br/>'+' 值:'+this.y+unit+'</div>';
               return html;
           	}
          },
          series: [
         		{
         			name: gfName+"-"+deviceName,
            	data:ylist ,
          	}
         ],
          plotOptions: {}
  	    })
  	    $(".highcharts-contextbutton").css("display","none")
  	    $(".highcharts-contextmenu").css("display","none")
      }
    }
  })
}

function exportExcel(){
	$(".highcharts-contextbutton").click();
	$(".highcharts-contextmenu").css("display","none")
	$(".highcharts-menu-item").each(function(){
		var text = $(this).html();
		if(text == '下载'){
			$(this).click();
		}
	});



}

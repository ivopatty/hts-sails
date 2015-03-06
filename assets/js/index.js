io.socket.on("update", function(msg){
	console.log(msg);
	console.log("start");
  $("#photo_name").attr("value",JSON.stringify(msg));
  $("#photo").attr("src", msg.clientPath+msg.file);
  console.log("end");
});
$("#get_image").click(function(){
  $.get("/get_image",function(data){
    //alert(data.file);
    $("#photo_name").attr("value",JSON.stringify(data));
    $("#photo").attr("src",data.clientPath+data.file);
  })
});
setTimeout(function(){
	$(".box.box-success").hide();
},2000);
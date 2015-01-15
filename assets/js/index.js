io.socket.on("update", function(msg){
	console.log(msg);
	console.log("start");
  $("#photo_name").attr("value",JSON.stringify(msg));
  $("#photo").attr("src", msg.clientPath+msg.file);
  console.log("end");
});
setTimeout(function(){
	$(".box.box-success").hide();
},2000);
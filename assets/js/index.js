io.socket.on("update", function(msg){
	console.log(msg);
	console.log("start");
	setTimeout(function(){
		$("#photo_name").attr("value",JSON.stringify(msg));
		$("#photo").attr("src", msg.clientPath+msg.file);
		console.log("end");
	},2000);	
});
setTimeout(function(){
	$(".box.box-success").hide();
},2000);
/**
 * ImageController
 *
 * @description :: Server-side logic for managing images
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var restler = require("restler");
var fs = require("fs");
var http = require("http");
var serverPost = "http://dev.100jaarhts.nl/";
var imgType = "image/jpg";
var image_token = "48d2fc2358a74103eddcfc91ce56b845704aa557d6cfd12d83a064ba315118e982f4ca049b1ad309176d5593475b06ac6c1736bfa609349c981cb29687ad44e0";
var user_token = "1b36fc3a3461ecf662b8b839ab7c96ad643e77c886f31346a259bb4bc69b6ab87266efa6af227c2492d999b60c24a33ee98f8af1a5fdec8bfd19c274b7166976";
module.exports = {
	'send_image': function(req,res){
		var id;
		var image;
		if(req.session.person){
			console.log("person:");
			id = _.clone(req.session.person[0].id);
			image = _.clone(req.session.photo);
		}
		else{
			id = req.param("person_id");
			image = req.param("image_name");
		}
		sendImage(serverPost+"/process/new",{
			person_id:id
		},image, image_token, req, res);
		req.session.flash = {success: "image successfully uploaded"}
		res.redirect("/");
	},
	'create_and_send': function(req,res){
		var data = req.params.all();
		delete data["image_name"];
		var image = req.param("image_name");
		console.log(data);
		sendImage(serverPost+"/process/create_person",data,image,user_token, req, res);

	}
};
function sendImage(url, data, image, token, req, res){
	image = JSON.parse(image);
	var imagePath = image.serverPath+image.file;
	if(fs.statSync(imagePath).isFile())
	{
		var request = require("request");
		var r = request.post(url, function optionalCallback (err, httpResponse, body) {
		  	if (err) {
		    	return console.error('upload failed:', err);
		  	}
		  	console.log('Upload successful!  Server responded with:', body);
		  	body = JSON.parse(body);
		  	if(body.error)
		  		req.session.flash = {error: body.error};
		  	else
		  		req.session.flash = {success: body.success};
		  	//res.redirect("/");
		});
		var form = r.form();
		form.append('post_token', token);
		for(key in data){
		form.append(key,data[key]);
		}
		form.append('file_name', fs.createReadStream(imagePath));
	}
	else
	{
		req.session.flash = {error: "Geen foto gevonden"};
		res.redirect("/");
	}
}

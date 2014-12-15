/**
 * PersonController
 *
 * @description :: Server-side logic for managing people
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var user_toke = "1b36fc3a3461ecf662b8b839ab7c96ad643e77c886f31346a259bb4bc69b6ab87266efa6af227c2492d999b60c24a33ee98f8af1a5fdec8bfd19c274b7166976";

var restler = require("restler");
var postServer = "http://localhost:3000";
var photo = "";
var person = {};
module.exports = {
	'check_person': function(req, res){	
		if(req.param('first_name').length == 0 || req.param('last_name').length == 0 ){
			req.session.flash = {error: "Vul een voor- en achternaam in"}
			return res.redirect("main/index");
		}		
		if(req.param('image_name').length == 0){
			req.session.flash = {error: "Er is nog geen foto genomen"}
			return res.redirect("main/index");
		}
		photo = req.param('image_name');
		restler.get(postServer+"/process/check_person", {
		    data: {
		      "post_token": user_toke,
		      "first_name": req.param("first_name"),
		      "last_name": req.param("last_name")
		    }
		  }).on("complete", function(data, response) {
		    console.log("data: "+data);
		    console.log("response: "+response);	
		    person = data;
		    if(data.length == 0)
		    {
		    	person['last_name'] = req.param("last_name");
		    	person['first_name'] = req.param("first_name");
		    	res.redirect("/create_person");
		    }		    	
		    else if(data.length > 1)
		    {		    
		    	res.send(data);
		    	res.redirect("/select_person"); 
		    }
		    else if(data.length == 1){
		    	req.session.person = person;	
		    	req.session.photo = photo;	    			    	
				return res.redirect("send_image");
		    }   	
		  });
	},
	'select_person':function(req,res){
		var photoObj = JSON.parse(photo);
		var photoPath = photoObj.clientPath+photoObj.file;
		return res.view({photo:photo,person:person, photoPath: photoPath});
	},
	'create_person':function(req,res){
		var photoObj = JSON.parse(photo);
		var photoPath = photoObj.clientPath+photoObj.file;
		return res.view({photo:photo, person: person, photoPath: photoPath});
	}
};

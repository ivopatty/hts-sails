/**
* Handels al the user requestes to the server and renders all the user related forms. 
*
* @class PersonController
*/
var user_toke = "1b36fc3a3461ecf662b8b839ab7c96ad643e77c886f31346a259bb4bc69b6ab87266efa6af227c2492d999b60c24a33ee98f8af1a5fdec8bfd19c274b7166976";

var restler = require("restler");
var postServer = "http://pilot.100jaarhts.nl/";
//var photo = ";
//var person = {};
module.exports = {
    /**
    * Sends a check person request to the 100jaarhts server. 
    * it redirects to the select_person path if there are multiple users with the same name.
    * it redirects to thecreate_person path if there is no known user with the given name.
    * it redirects to the send_image path if the given name is known and unique.
    *
    * @method check_person
    * @param {String} first_name . The first name of the user
    * @param {String} last_name . The last name of the user
    * @param {String} image_name . The name of the photo what belongs to the user
    */
	'check_person': function(req, res){
		if(req.param('first_name').length == 0 || req.param('last_name').length == 0 ){
			req.session.flash = {error: "Vul een voor- en achternaam in"}
			return res.redirect("main/index");
		}
		if(req.param('image_name').length == 0){
			req.session.flash = {error: "Er is nog geen foto genomen"}
			return res.redirect("main/index");
		}
		var photo = req.param('image_name');
		restler.get(postServer+"/process/check_person", {
		    data: {
		      "post_token": user_toke,
		      "first_name": req.param("first_name"),
		      "last_name": req.param("last_name")
		    }
		  }).on("complete", function(data, response) {
		    //console.log("data: "+data);
		    //console.log("response: "+response);
		    var person = data;
		    if(data.length == 0)
		    {
		    	person['last_name'] = req.param("last_name");
		    	person['first_name'] = req.param("first_name");
                req.session.person = person;
		    	req.session.photo = photo;
		    	return res.redirect("/create_person");
		    }
		    else if(data.length > 1)
		    {
		    	res.send(data);
                req.session.person = person;
		    	req.session.photo = photo;
		    	return res.redirect("/select_person");
		    }
		    else if(data.length == 1){
		    	req.session.person = person;
		    	req.session.photo = photo;
				return res.redirect("send_image");
		    }
		  });
	},
    /**
    * Renders the select person view
    *
    * @method select_person
    */
	'select_person':function(req,res){
        var photo = _.clone(req.session.photo);
        var person = _.clone(req.session.person);
        console.log("Person: "+person);
		var photoObj = JSON.parse(photo);
		var photoPath = photoObj.clientPath+photoObj.file;
		return res.view({photo:photo,person:person, photoPath: photoPath});
	},
  /**
    * Renders the create person view
    *
    * @method select_person
    */
	'create_person':function(req,res){
        var photo = _.clone(req.session.photo);
        var person = _.clone(req.session.person);
		var photoObj = JSON.parse(photo);
		var photoPath = photoObj.clientPath+photoObj.file;
		return res.view({photo:photo, person: person, photoPath: photoPath});
	}
};

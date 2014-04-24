/**
 * MainController
 *
 * @description :: Server-side logic for managing mains
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var fs = require("fs");
var newestPhoto = "";
var photoPath = "./assets/images/greenscreen/";
var clientPhotoPath = "/images/greenscreen/";
var publicPath = "./.tmp/public/images/greenscreen/";
fs.watch(photoPath,function(event, file){
	{
		if(file != ".DS_Store")
		{
			// if file is deleted or added
		    fs.exists(photoPath+file, function(exists){
		      if(exists)
		      {
            fs.writeFileSync(publicPath+file, fs.readFileSync(photoPath+file));
		        newestPhoto = file;
		        console.log(exists +" "+ file);
		        sails.sockets.blast("update", {file: file, clientPath: clientPhotoPath, serverPath: photoPath});
		      }
		    });
		}
	}
});

// new photo watcher //
module.exports = {
	'index': function(req,res){
		res.locals.flash = _.clone(req.session.flash);
		res.view({photo: newestPhoto});
		req.session.flash = {};
		sails.io.on("connection",function(socket){
			socket.emit("update", {file: newestPhoto, clientPath: clientPhotoPath, serverPath: photoPath})
		});
	}
};


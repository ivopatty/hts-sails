/**
* This controller is main controller. The main controller renders the index page,
* and wachts the photo folder. Whene a photo is added to the folder the maincontoller sends a 
* websocket message to the user. The photo will disapear real-time on the users screen.
*
* @class MainController
*/
var fs = require("fs");
var newestPhoto = "";
var photoPath = "./assets/images/greenscreen/";
var clientPhotoPath = "/images/greenscreen/";
var publicPath = "./.tmp/public/images/greenscreen/";
// watch the photo folder
fs.watch(photoPath,function(event, file){
	{
        // check is the change is not from the .DS_Store file
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
    /**
    * Renders the index page and send a update photo message to the client. 
    *
    * @method index
    */
	'index': function(req,res){
		res.locals.flash = _.clone(req.session.flash);
		res.view({photo: newestPhoto});
		req.session.flash = {};
		sails.io.on("connection",function(socket){
			socket.emit("update", {file: newestPhoto, clientPath: clientPhotoPath, serverPath: photoPath})
		});
	}
};


/**
 * PofController
 *
 * @description :: Server-side logic for managing pofs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	"index": function(req,res){
        res.view("pof/index");
    }
};


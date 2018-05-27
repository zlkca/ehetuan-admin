var Auth = require('auth.model');

module.exports = function(cfg){
	
	//var _db = DB();
	var auth = Auth(cfg);
	var User = model.User;


	return {
		
		//--------------------------------------------------------------------------------------
		//	insert() http post handler
		// Arguments:
		// 		req --- req object, eg {body:{query:{from:'A', to:'B'}}}
		//--------------------------------------------------------------------------------------
		insert: function(req, res){

		}
	}
} 
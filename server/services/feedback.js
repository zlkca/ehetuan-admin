//----------------------------------------------------
// Author:	Martin.Zhang
// Date:  	Jan 13 2018
// All right reserved.
//----------------------------------------------------

'use strict';

var DB = require('../database');

module.exports = function(cfg){
	
	var _db = DB(cfg);

	return {
		
		//--------------------------------------------------------------------------------------
		//	insert() http post handler
		// Arguments:
		// 		req --- req object, eg {body:{query:{from:'A', to:'B'}}}
		//--------------------------------------------------------------------------------------
		insert: function(req, res){
			var origin = req.headers.origin;
			if(cfg.ALLOW_ORIGINS.indexOf(origin) > -1){
			   res.header("Access-Control-Allow-Origin", origin);
			}
  			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			var body = req.body;
			_db.insert('feedbacks', body, function(err, results, fields){
				 return res.json({ success: true, 'feedbacks': results});
			});
		},
		// options: function(req, res){
		// 	res.header("Access-Control-Allow-Origin", cfg.ALLOW_ORIGIN);
  // 			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // 			return res.json({ success: true});
		// }
	}
}
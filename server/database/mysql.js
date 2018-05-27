var mysql = require('mysql')
//var Config = require('../config')

LOGICAL_OPERATORS = ['$and', '$or'];
LOGICAL_OPERATOR_MAPPING = {$and:'AND', $not:'NOT', $or:'OR', '$nor':'NOR'};

COMPARISION_OPERATORS = ['$eq', '$gt', '$gte', '$in', '$lt', '$lte', '$ne', '$nin'];


function getTerms(t){
	if(typeof(t)=='object'){
		var ks = Object.keys(t);
		if(ks.length > 0){
			items = [];
			for(k in t){
				if(typeof(t[k])=='string'){
					items.push(" " + k + "='" + t[k] + "' ");
				}else{
					items.push(" " + k + "=" + t[k] + " ");
				}
			}
			return items;
		}else{
			return t;
		}
	}else{
		return t;
	}
}

module.exports = function(cfg){
	
	var self = {
		//-------------------------------------------------------------------------------------------
		// init
		// Arguments:
		init: function(){
			const db = cfg.DATABASE;
			var connection = mysql.createConnection({
				host     : db.HOST,
				user     : db.USERNAME,
				password : db.PASSWORD,
				database : db.NAME
			});
			return connection;
		},

		parseQuery: function(q){
			//--------------------------------------------------------------------------------------
			// parseQuery(query)
			//		parse all the fields to mongodb standard query object.
			//	AND --- { $and: [ { status:'a'}, {'qty':{$lt:30} } ] }
			//	OR  --- { $or: [ { status: "A" }, { qty: { $lt: 30 } } ] }
			//  IN. --- { status: { $in: [ "A", "D" ] } }
			// Arguments:
			// 		q --- [in] query
			//			type #1: {c1:x1, c2:x2 ... }
			//			type #2: {$and: [{c1:x1, c2:x2}, {c3:x3}], $or: [{c1:x1, c2:x2}, {c3:x3}]}
			//--------------------------------------------------------------------------------------
			if(q){
				var terms = getTerms(q);
				return terms.join('AND');
			}else{
				return null;
			}
		},

		//-------------------------------------------------------------------------------------------
		// find  Database Layer API
		// table 	[string]   	--- name of the collection
		// query	[object] 	--- mongodb query format
		find: function(table, query){
			var conn = self.init();
			var s = 'SELECT * FROM ' + table;
			var q = self.parseQuery(query);
			
			if(q){
				s += ' WHERE' + q; 
			}

			return new Promise(function(resolve, reject){
				conn.connect(function(err){
					conn.query(s, function (err, results, fields) {
					  	conn.end();
				  		if(err){
				  			reject(err);
				  		}else{
				  			resolve(results);
				  		}
					});
				});
			});
		},

		insert: function(table, row){
			var conn = self.init();
			var fields = [];
			var vs = [];
			for(k in row){
				
				if(row[k]!==null && row[k]!==''){
					fields.push("`"+k+"`");
					if(typeof(row[k])=='string'){
						vs.push("'" + row[k] + "'");
					}else{
						vs.push(row[k]);
					}
				}else{
					//vs.push("''");
				}
			}

			var s = 'INSERT INTO ' + table + " ("+ fields.join(',') + ") VALUES (" + vs.join(',') + ");";
			console.log(s);
			return new Promise(function(resolve, reject){
				conn.connect(function(err){
					conn.query(s, function (err, results, fields) {
						conn.end();
				  		if(err){
				  			reject(err);
				  		}else{
				  			resolve(results);
				  		}
					});
				});
			});
		}
	}

	return self;
}
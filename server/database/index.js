var DB = require('./mysql');



		// var ops = Object.keys(q);

		// if(ops[0] in LOGICAL_OPERATORS){
		// 	var operator = LOGICAL_OPERATOR_MAPPING[op];
		// }else{ // and
		// 	terms = [];
		// 	for(k in q){
		// 		terms.push(k + '=' + q);
		// 	}
		// }

		// var items = q[op_l1];
		// var operator = LOGICAL_OPERATOR_MAPPING

		// for(k in items){
		// 	return 
		// }

			// if(q!=null){
				
			// 	for(key in q){
			// 		var val = q[key];
			// 		if(key.indexOf("_id", key.length - 3) > -1){ // parse the other fields end with "_id"
			// 			if(val!=null && val !='' && typeof val == 'string'){
			// 				query[key] = db.toObjectId(val);
			// 			}else if('$in' in val){
			// 				// convert ids to object_ids if needed
			// 				var idArray = [];
			// 				_.each(val['$in'], function(element, index, list){
			// 					if(element !='' && typeof element == 'string'){
			// 						idArray.push(db.toObjectId(element));
			// 					}
			// 				});
			// 				query[key] = {'$in':idArray};
			// 			}else{
			// 				query[key] = val;
			// 			}
			// 		}else if(typeof val=='string' && (val=='null' || val=='') ){
			// 			// Skip
			// 		}else if('$include' in val){ 
			// 			// parse {field:{'$include':val}} to {field:{'$include':RegExp(val, 'i')}
			// 			query[key] = new RegExp(val['$include'],'i');
			// 		}else{
			// 			query[key] = val;
			// 		}
			// 	}
			// }
			// return query;
		// end of parseQuery




module.exports = DB;


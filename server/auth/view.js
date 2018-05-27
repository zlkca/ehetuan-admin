var AuthModel = require('./model');
var jwt = require('jsonwebtoken');

// cb --- function( errors, doc );
// 	function validateLoginAccount(user, cb){
// 		var errors = [];
// 		var account = null;
		
// 		if (user.account.indexOf("@") != -1){
// 			account = {'email':user.account };
// 		}else{
// 			account = {'username':user.account};
// 		}
		
// 		if(user.account == ''){
// 			errors.push(Error.ACCOUNT_EMPTY);
// 			if(cb){
// 				cb(errors, null);
// 			}
// 		}else{
// 			_collection.findOne(account, function(err, doc){
// 				if( doc == null){
// 					errors.push(Error.ACCOUNT_NOT_EXIST);
// 				}
// 				if(cb){
// 					cb(errors, doc);
// 				}
// 			});
// 		}
// 	}
	
// 	// cb --- function(errors)
// 	function validateLoginPassword( user, hashedPassword, cb ){
// 		var errors = [];
// 		if( user.password ){
// 			ut.checkHash(user.password, hashedPassword, function(err, bMatch){
// 				if(!bMatch){
// 					errors.push(Error.PASSWORD_MISMATCH);
// 				}
// 				if(cb){
// 					cb(errors);
// 				}
// 			});
// 		}else{
// 			if(cb){
// 				cb(errors);
// 			}
// 		}
// 	}
	
// 	function isInvalidEmail(errors){
// 		return (errors.indexOf(Error.EMAIL_EMPTY)!==-1 || errors.indexOf(Error.INVALID_EMAIL)!==-1
// 				|| errors.indexOf(Error.EMAIL_EXISTS)!==-1);
// 	}
	
// 	function isInvalidUsername(errors){
// 		return errors.indexOf(Error.USERNAME_EMPTY)!=-1;
// 	}

// getAccount: function( req, rsp ){
// 			ut.renewToken(req, rsp, function(account, token){
// 				return rsp.json({success:true, 
// 					id:account.id, 
// 					username: account.username, 
// 					email: account.email, 
// 					photo: account.photo,
// 					'token': token});
// 			});
// 		},
		

		
		//-------------------------------------------------------------------------
		// login pass token and user object to the front end
		// Arguments:
		// req --- req object
		// rsp
		//-------------------------------------------------------------------------
		// login: function(req, rsp){
		// 	var credential = {account: req.body.account, password: req.body.password};
		// 	validateLoginAccount(credential, function(accountErrors, doc){
		// 		if(accountErrors && accountErrors.length > 0){
		// 			return rsp.json({'errors':accountErrors, 'token':'', 'decoded':''});
		// 		}else{
		// 			validateLoginPassword(credential, doc.password, function(passwordErrors){
		// 				var errors = accountErrors.concat(passwordErrors);
		// 				if(errors && errors.length > 0){
		// 					return rsp.json({'errors':errors, 'token': '', 'decoded':''});
		// 				}else{
		// 					var user = { id: doc._id, username: doc.username, 
		// 							//email: doc.email, 
		// 							role: doc.role, photo:doc.photo };
							
		// 					ut.signToken(user, function(token){	
		// 						delete user.email;
		// 						return rsp.json({'errors': errors, 'token': token, 'decoded': user});
		// 					});
		// 				}
		// 			});	
		// 		}
		// 	});
		// },
		
		// logout: function(req, res){
		// 	if(req.session!=undefined){
		// 		req.session['logged in'] = false;
		// 	}
		// 	res.json({success:true});
		// },

module.exports = function(cfg){
	var self = {
		UserModel: AuthModel(cfg).User,
	}

	self.create_jwt_token = function(obj){
	    payload = {
	        'data': obj,
	        'expiry': new Date().getTime() / 1000 + cfg.JWT.EXPIRY
	    }
	    return jwt.sign(payload, cfg.JWT.SECRET, {algorithm:cfg.JWT.ALGORITHM});
	}
    
    self.valid_token = function(req){
	    // let authorizaion = req.META['HTTP_AUTHORIZATION'];
	    // let token = authorizaion.replace("Bearer ", "");
	    // if(token){

	    // }
	    return false;
	    //     s = base64.b64decode(token).decode("utf-8").replace('"', '')
	    //     payload = decode_jwt_token(s)
	    //     if payload and payload['data']:
	    //         return True
	    // return False
	}

	self.checkToken = function(req, res){
		return res.json({'data':true});
	}
	//-------------------------------------------------------------------------
	// login pass token and user object to the front end
	// Arguments:
	// req --- req object
	// rsp
	//-------------------------------------------------------------------------
	self.login = function(req, res){
		body = req.body;
		email = body.account;
		password = body.password;
		
		// return new Promise(function(resolve, reject){
			AuthModel(cfg).filter({email:email}).then(
				(data)=>{
					if(data && data.length>0){
						var user = data[0];
						user.password = '';
						token = self.create_jwt_token(user.id);
						return res.json({ 'token':token, 'data':user});
					}else{
						return res.json({'token':'', 'data':''});
					}
					// resolve({ 'token': token, 'data': user});
				},
				(err)=>{
					return res.json({'token':'', 'data':''});
					// reject({'token':'', 'data':''});
				}).catch((err)=>{ });
		// });
	}

	//-------------------------------------------------------------------------
	// signup did not pass user object to the front end
	// Arguments:
	// req --- http request object
	// rsp --- http response object
	//-------------------------------------------------------------------------
	self.signup = function(req, rsp){
		var b = req.body;
		return new Promise(function(resolve, reject){
			AuthModel(cfg).filter({email: b.email}).then(
				(data)=>{
					if(data.length == 0){
						console.log(b);
						AuthModel.insert(b).then(
							(data)=>{
								resolve(data);
							},
							(err)=>{
								reject(err);
							});
					}else{
						reject('Email Exist');
					}
				},
				(err)=>{
					reject(err);
				});
			});
	}

	return self;
}
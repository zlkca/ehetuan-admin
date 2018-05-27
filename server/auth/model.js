var Database = require("../database");
const bcrypt = require('bcrypt');

function UserModel(o){

    this.id = o? o.id:'';
    this.username = o? o.username:'';
    this.email = o? o.email:'';
    this.password = o? o.password:'';
    this.type = o.type!=null? o.type:'member';
    this.gender = o.gender!=null? o.gender: 'm';
    this.is_superuser = o.is_superuser!=null? o.is_superuser: 0;
    this.is_staff = o.is_staff!=null? o.is_staff: 0;
    this.is_active = o.is_active!=null? o.is_active: 1;
    this.first_name = o? o.first_name:'';
    this.last_name = o? o.last_name:'';
    this.portrait = o? o.portrait:'';

    this.Meta = {
    	table:'accounts_user',
        fields: ['username', 'email', 'password', 'type', 'gender', 'is_superuser', 'is_staff', 'is_active', 'first_name', 'last_name', 'portrait']
    }

    this.to_json = function(){
        var a = {};
        var self = this;
        for(k in self){
            if(self.Meta.fields.indexOf(k) > -1){
                //console.log(k + " : " + this[k]);
                a[k] = this[k];
            }
        }
        return a;
    }
}

// UserModel.prototype.filter = function(query){
// 	return db.find('accounts_user', query);
// }

// // Only can be used for create new
// UserModel.prototype.insert = function(row){
// 	var password = row.password;
// 	bcrypt.hash(password, 10).then(function(hash){
// 		row.password = hash;
// 		return db.insert('accounts_user', row);
// 	});
// }

module.exports = function(cfg){
    var self = {
        User:UserModel
    }
    

    self.filter = function(query){
        var db = Database(cfg);
        return db.find('accounts_user', query);
    }

    // Only can be used for create new
    self.insert = function(row){
        var db = Database(cfg);
        var password = row.password;

        return new Promise(function(resolve, reject){
            bcrypt.hash(password, 10).then(function(hash){
                row.password = hash;
                var m = new UserModel(row);
                console.log(m);
                var user = m.to_json();
                console.log(user);
                db.insert('accounts_user', user).then(
                    (d)=>{
                        resolve(d);
                    },
                    (e)=>{
                        reject(e);
                    });
            });
        });
    }
    
    return self;
}
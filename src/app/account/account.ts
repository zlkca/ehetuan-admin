export class User{
  public username:string;
  public email:string;
  public first_name:string;
  public last_name:string;
  public portrait:string;
  public type:string;
    constructor(o?:any){
        if(o){
            this.username = o.username;
            this.email = o.email;
            this.first_name = o.first_name;
            this.last_name = o.last_name;
            this.portrait = o.portrait;
            this.type = o.type;
      }
  }
}

export class Province{
  id:string;
  name:string;
  constructor(o?:any){
    if(o){
      this.id = o.id;
      this.name = o.name;
    }
  }
}

export class City{
  id:string;
  name:string;
  province_id:string;
  constructor(o?:any){
    if(o){
      this.id = o.id;
      this.name = o.name;
      this.province_id = o.province.id;
    }
  }
}

export class Address{
  id:string;
  street:string;
  postal_code:string;
  province_id:string;
  city_id:string;
  lat:string;
  lng:string;

  constructor(o?:any){
    if(o){
      this.id = o.id;
      this.street = o.street;
      this.postal_code = o.postal_code;
      this.province_id = o.province.id;
      this.city_id = o.city.id;
      this.lat = o.lat;
      this.lng = o.lng;
    }
  }
}


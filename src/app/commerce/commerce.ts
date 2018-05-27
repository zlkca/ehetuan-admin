import { User，Address } from '../account/account';

const MAX_N_PICTURES = 5;

export class Restaurant{
  public id:string;
  public name:string;
  public description:string;
  categories:Category[];
  address:Address;
  public created:string;
  public updated:string;
    constructor(o?:any){
        if(o){
           this.id = o.id;
            this.name = o.name;
            this.description = o.description;
            this.created = o.created;
            this.updated = o.updated;

            if(o.address){
              this.address = o.address;
            }
            
            if(o.categories && o.categories.length > 0){
              let cs = [];
              for(let c of o.categories){
                cs.push(new Category(c));
              }
              this.categories = cs;
            }else{
              this.categories = [];
            }
      }
  }
}

export class Category{
  public id:string;
  public name:string;
  public description:string;
  public status:string;
  public created:string;
  public updated:string;
    constructor(o?:any){
        if(o){
           this.id = o.id;
            this.name = o.name;
            this.description = o.description;
            this.status = o.status;
            this.created = o.created;
            this.updated = o.updated;
      }
  }
}


export class Color{
  public id:string;
  public name:string;
  public description:string;
  constructor(o?:any){
      if(o){
          this.id = o.id;
          this.name = o.name;
          this.description = o.description;
    }
  }
}

export class ImageDefaultTitle{
  public id:string;
  public name0:string='';
  public name1:string='';
  public name2:string='';
  public name3:string='';

  constructor(o?:any){
        if(o){
            this.id = o.id;
            this.name0 = o.name0;
            this.name1 = o.name1;
            this.name2 = o.name2;
            this.name3 = o.name3;
      }
  }
}


export class Picture{
  public id:string;
  public name:string;
  public description:string;
  public index:number;
  public image:any = { 'data':'', 'file':'' };
  public width:number;
  public height:number;
  public product:any = {id:1};
    constructor(o?:any){
        if(o){
           this.id = o.id;
            this.name = o.name;
            this.description = o.description;
            this.image = o.image;
            this.width = o.width;
            this.height = o.height;
            if(o.product){
                this.product = o.product;
            }
      }
  }
}

export class Product{
  public id:string;
  public name:string;
  public description:string;
  year:string;
  status:string;
  currency:string;
  dimension:string;
  price:number;

  categories:Category[];
  color:Color;
  restaurant:Restaurant;
  pictures:Picture[] = [];
  
  public created:string;
  public updated:string;
    constructor(o?:any){
        if(o){
            this.id = o.id;
            this.name = o.name;
            this.description = o.description;
            this.year = o.year;
            this.status = o.status;
            
            if(o.pictures && o.pictures.length > 0){
              this.pictures = o.pictures;
            }else{
              this.pictures = [];
            }

            // this.pic = o.pic;
            this.dimension = o.dimension;
            this.price = o.price;
            this.currency = o.currency;

            if(o.categories && o.categories.length > 0){
              let cs = [];
              for(let c of o.categories){
                cs.push(new Category(c));
              }
              this.categories = cs;
            }else{
              this.categories = [];
            }
            
            if(o.color){
                this.color = new Color(o.color);
            }

            if(o.restaurant){
                this.restaurant = new Restaurant(o.restaurant);
            }

            // if(o.style){
            //     this.style = o.style;
            // }
            this.created = o.created;
            this.updated = o.updated;
      }
  }
}



export class Subscription{
  public user:any;
  public ip:string;
  public product:any;
  public created:string;
  public updated:string;
    constructor(o?:any){
        if(o){
            if(o.user && o.userlength>0){
                this.user = {'id':o.user[0], 'name':o.user[1]};
            }
            this.ip = o.ip;
            if(o.product && o.productlength>0){
                this.product = {'id':o.product[0], 'name':o.product[1]};
            }
            this.created = o.created;
            this.updated = o.updated;
      }
  }
}


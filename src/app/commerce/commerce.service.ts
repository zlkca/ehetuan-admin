import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { environment } from '../../environments/environment';
import { Restaurant, Category, Product, Color, ImageDefaultTitle, Subscription } from './commerce';
import 'rxjs/add/observable/fromPromise';

import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

const APP = environment.APP;
const API_URL = environment.API_URL;
const EMPTY_IMAGE = environment.APP_URL + '/media/empty.png';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {    
    let index = request.url.indexOf('maps.google.com/maps/api');

    if(index == -1){
        let token = localStorage.getItem('token-' + APP);
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': 'Bearer ' + btoa(token)
          }
        });
    }else{
        request = request.clone({
          setHeaders: {}
        });
    }
    return next.handle(request);
  }
}

@Injectable()
export class CommerceService {
    
    private API_URL = environment.API_URL;
    private APP = environment.APP;
    MEDIA_URL = environment.APP_URL+'/media/';
    emptyImage = environment.APP_URL + '/media/empty.png';

    constructor(private http:HttpClient){ }

    getLocation(addr:string):Observable<any>{
        let url = 'http://maps.google.com/maps/api/geocode/json?address=' + addr + 'CA&sensor=false'
        return this.http.get(url).map((res:any)=>{
            if(res.results && res.results.length>0){
                let r = res.results[0];
                let postal_code = '', sub_locality = '';
                for(let addr of r.address_components){
                    if(addr.types.indexOf('postal_code')!=-1){
                        postal_code = addr.long_name;
                    }
                    if(addr.types.indexOf('sublocality_level_1')!=-1 || addr.types.indexOf('sublocality')!=-1){
                        sub_locality = addr.long_name;
                    }
                }
                return {...r.geometry.location, ...{'formatted_addr':r.formatted_address, 
                    'sub_locality':sub_locality,
                    'postal_code':postal_code}};//{lat: 43.7825004, lng: -79.3930389}
            }else{
                return null;
            }
        });
    }

    getRestaurantList(query?:string):Observable<Restaurant[]>{
        const url = API_URL + 'restaurants' + (query ? query:'');
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.get(url, {'headers': headers}).map((res:any) => {
            let a:Restaurant[] = [];
            let d = res.data;
            if( d && d.length > 0){
                for(var i=0; i<d.length; i++){
                    a.push(new Restaurant(d[i]));
                }
            }
            return a;
        })
        .catch((err) => {
            return Observable.throw(err.message || err);
        });
    }

    getRestaurant(id:number):Observable<Restaurant>{
        const url = API_URL + 'restaurants/' + id;
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.get(url, {'headers': headers}).map((res:any) => {
            return new Restaurant(res.data); // { name:x, address: {street:x, city:{id:x}, province:{id:x}}}
        })
        .catch((err) => {
            return Observable.throw(err.message || err);
        });
    }

    saveRestaurant(d:Restaurant){
        let token = localStorage.getItem('token-' + this.APP);
        let self = this;

        return Observable.fromPromise(new Promise((resolve, reject)=>{
            let formData = new FormData();
            formData.append('id', d.id? d.id:'');
            formData.append('name', d.name);
            formData.append('description', d.description);
            formData.append('address_id', d.address.id);
            formData.append('street', d.address.street);
            formData.append('sub_locality', d.address.sub_locality);
            formData.append('postal_code', d.address.postal_code);
            formData.append('province_id', d.address.province.id);
            formData.append('city_id', d.address.city.id);
            formData.append('categories', Array.from(d.categories, x => x.id).join(','));
            formData.append('lat', d.address.lat);
            formData.append('lng', d.address.lng);
                 
            let image = d.image;
            if(d.image.data == ''){
                formData.append('image_status', 'removed');
            }else{
                if(d.image.file == ''){
                    formData.append('image_status', 'unchange');
                }else{
                    formData.append('image_status', 'changed');
                    formData.append('image', image.file);
                }
            }

            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function (e) {
              if (xhr.readyState === 4) { // done
                if (xhr.status === 200) { // ok
                    resolve(JSON.parse(xhr.response));
                } else {
                    reject(xhr.response);
                }
              }
            };

            xhr.onerror = function (e) {
                reject(xhr.response);
            };

            xhr.open("POST", API_URL + 'restaurants', true);
            xhr.setRequestHeader("authorization", "Bearer " + btoa(token));
            xhr.send(formData);
        }));
    }


    rmRestaurant(id:number):Observable<Restaurant[]>{
        const url = API_URL + 'restaurants/' + id;
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.delete(url, {'headers': headers}).map((res:any) => {
            let a:Restaurant[] = [];
            let d = res.data;
            if( d && d.length > 0){
                for(var i=0; i<d.length; i++){
                    a.push(new Restaurant(d[i]));
                }
            }
            return a;
        })
        .catch((err) => {
            return Observable.throw(err.message || err);
        });
    }

    getCategoryList(query?:string):Observable<Category[]>{
        const url = this.API_URL + 'categories' + (query ? query:'');
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.get(url, {'headers': headers}).map((res:any) => {
            let a:Category[] = [];
            let d = res.data;
            if( d && d.length > 0){
                for(var i=0; i<d.length; i++){
                    a.push(new Category(d[i]));
                }
            }
            return a;
        })
        .catch((err) => {
            return Observable.throw(err.message || err);
        });
    }

    getCategory(id:number):Observable<Category>{
        const url = this.API_URL + 'categories/' + id;
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.get(url, {'headers': headers}).map((res:any) => {
            return new Category(res.data);
        })
        .catch((err) => {
            return Observable.throw(err.message || err);
        });
    }

    saveCategory(d:Category):Observable<Category>{
        const url = this.API_URL + 'categories';
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        let data = {
          'id': d.id? d.id:'',
          'name': d.name,
          'description': d.description
          // 'status': d.status,
        }
        return this.http.post(url, data, {'headers': headers}).map((res:any) => {
            return new Category(res.data);
        })
        .catch((err) => {
            return Observable.throw(err.message || err);
        });
    }

    rmCategory(id:number):Observable<Category[]>{
        const url = this.API_URL + 'categories/' + id;
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.delete(url, {'headers': headers}).map((res:any) => {
            let a:Category[] = [];
            let d = res.data;
            if( d && d.length > 0){
                for(var i=0; i<d.length; i++){
                    a.push(new Category(d[i]));
                }
            }
            return a;
        })
        .catch((err) => {
            return Observable.throw(err.message || err);
        });
    }
    
    getColorList(query?:string):Observable<Color[]>{
        const url = this.API_URL + 'colors' + (query ? query:'');
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.get(url, {'headers': headers}).map((res:any) => {
            let a:Color[] = [];
            let d = res.data;
            if( d && d.length > 0){
                for(var i=0; i<d.length; i++){
                    a.push(new Color(d[i]));
                }
            }
            return a;
        })
        .catch((err) => {
            return Observable.throw(err.message || err);
        });
    }

    getColor(id:number):Observable<Color>{
        const url = this.API_URL + 'colors/' + id;
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.get(url, {'headers': headers}).map((res:any) => {
            return new Color(res.data);
        })
        .catch((err) => {
            return Observable.throw(err.message || err);
        });
    }

    saveColor(d:Color):Observable<Color>{
        const url = this.API_URL + 'colors';
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        let data = {
          'id': d.id? d.id:'',
          'name': d.name,
          'description': d.description
          // 'status': d.status,
        }
        return this.http.post(url, data, {'headers': headers}).map((res:any) => {
            return new Color(res.data);
        })
        .catch((err) => {
            return Observable.throw(err.message || err);
        });
    }

    rmColor(id:number):Observable<Color[]>{
        const url = this.API_URL + 'colors/' + id;
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.delete(url, {'headers': headers}).map((res:any) => {
            let a:Color[] = [];
            let d = res.data;
            if( d && d.length > 0){
                for(var i=0; i<d.length; i++){
                    a.push(new Color(d[i]));
                }
            }
            return a;
        })
        .catch((err) => {
            return Observable.throw(err.message || err);
        });
    }

    getImageDefaultTitle(id:number):Observable<ImageDefaultTitle>{
        const url = this.API_URL + 'image-default-title/1';
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
            
        return this.http.get(url, {'headers': headers}).map((res:any) => {
            return new ImageDefaultTitle(res.data);
        })
        .catch((err) => {
            return Observable.throw(err.message || err);
        });
    }
    
    saveImageDefaultTitle(d:ImageDefaultTitle):Observable<ImageDefaultTitle>{
        const url = this.API_URL + 'image-default-title';
        let token = localStorage.getItem('token-' + this.APP);
        // let headers = new HttpHeaders().set('Content-Type', 'application/json');
        //         .set("authorization", "Basic " + btoa(token));

        let data = {
          'id': 1,//d.id? d.id:'',
          'name0': d.name0,
          'name1': d.name1,
          'name2': d.name2,
          'name3': d.name3
          //"authorization": "Basic " + btoa(token)
        }

        //headers.append("authorization", "Basic " + btoa(token));
        return this.http.post(url, data).map((res:any) => {
            return new ImageDefaultTitle(res.data);
        })
        .catch((err) => {
            return Observable.throw(err.message || err);
        });
    }
    
    getProductList(query?:string):Observable<Product[]>{
        const url = API_URL + 'products' + (query ? query:'');
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.get(url, {'headers': headers}).map((res:any) => {
            let a:Product[] = [];
            let d = res.data;
            if( d && d.length > 0){
                for(var i=0; i<d.length; i++){
                    a.push(new Product(d[i]));
                }
            }
            return a;
        })
        .catch((err) => {
            return Observable.throw(err.message || err);
        });
    }

    getProduct(id:number):Observable<Product>{
        const url = API_URL + 'product/' + id;
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.get(url, {'headers': headers}).map((res:any) => {
            return new Product(res.data);
        })
        .catch((err) => {
            return Observable.throw(err.message || err);
        });
    }

    getDefaultLogo(item){
        let self = this;
        if(item.qrs[0].image.data){
            return self.MEDIA_URL + item.qrs[0].image.data;
        }else if(item.qrs[1].image.data){
            return self.MEDIA_URL + item.qrs[1].image.data;
        }else if(item.qrs[2].image.data){
            return self.MEDIA_URL + item.qrs[2].image.data;
        }else if(item.qrs[3].image.data){
            return self.MEDIA_URL + item.qrs[3].image.data;
        }else{
            return self.emptyImage;
        }
    }

    getImageUrl(path){
        let self = this;
        if(path == ''){
          return self.emptyImage;
        }else{
          return self.MEDIA_URL + path;
        }
    }

    getImage(image){
        let self = this;
        if(image.data == ''){
          image = {'data':self.emptyImage, 'file':''};
        }else{
          image = {'data':self.MEDIA_URL + image.data, 'file':''};
        }
        return image;
    }

    getProductQRs(qrs, defaultTitles){
      let self = this;
      for( let i=0; i<qrs.length; i++){
          if(!qrs[i].title){
              qrs[i].title = defaultTitles[i];
          }
          qrs[i].image = self.getImage(qrs[i].image);
      }
      return qrs;
    }

    saveProduct(d:Product){
        let token = localStorage.getItem('token-' + this.APP);
        let self = this;

        return Observable.fromPromise(new Promise((resolve, reject)=>{
            let formData = new FormData();
            formData.append('id', d.id? d.id:'');
            formData.append('name', d.name);
            formData.append('description', d.description);
            // formData.append('year', '2015');//d.n_subscription.toString());
            formData.append('status', 'active');
            // formData.append('dimension', d.dimension);//d.rating.toString());
            formData.append('price', d.price? d.price.toString():'');
            formData.append('currency', 'CAD');
            formData.append('categories', Array.from(d.categories, x => x.id).join(','));
            // formData.append('color_id', d.color.id);
            formData.append('restaurant_id', d.restaurant.id);
            
            formData.append('n_pictures', d.pictures.length?d.pictures.length.toString():'0');
            for(let i=0; i<d.pictures.length; i++){
                formData.append('name'+i, d.pictures[i].name);
                let image = d.pictures[i].image;
                if(image.data == ''){
                    formData.append('image_status'+i, 'removed');
                }else{
                    if(image.file == ''){
                        formData.append('image_status'+i, 'unchange');
                    }else{
                        formData.append('image_status'+i, 'changed');
                        formData.append('image'+i, image.file);
                    }
                }
            }

            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function (e) {
              if (xhr.readyState === 4) { // done
                if (xhr.status === 200) { // ok
                    resolve(JSON.parse(xhr.response));
                    //console.log(xhr.responseText);
                } else {
                    reject(xhr.response);
                    //console.error(xhr.statusText);
                }
              }
            };

            xhr.onerror = function (e) {
                reject(xhr.response);
                //console.error(xhr.statusText);
            };

            xhr.open("POST", this.API_URL + 'product', true);
            xhr.setRequestHeader("authorization", "Bearer " + btoa(token));
            xhr.send(formData);
        }));
    }

    rmProduct(id:number):Observable<any>{
        const url = this.API_URL + 'product/' + id;
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.delete(url, {'headers': headers}).map((res:any) => {
            let a:Product[] = [];
            let d = res.data;
            if( d && d.length > 0){
                for(var i=0; i<d.length; i++){
                    a.push(new Product(d[i]));
                }
            }
            return a;
        })
        .catch((err) => {
            return Observable.throw(err.message || err);
        });
    }

    // getWechat(id:number):Observable<Wechat>{
    //     const url = this.API_URL + 'wechat/1';
    //     let headers = new HttpHeaders().set('Content-Type', 'application/json');
    //     return this.http.get(url, {'headers': headers}).map((res:any) => {
    //         return new Wechat(res.data);
    //     })
    //     .catch((err) => {
    //         return Observable.throw(err.message || err);
    //     });
    // }

    // saveWechat(d:Wechat){
    //     let token = localStorage.getItem('token-' + this.APP);
    //     return Observable.fromPromise(new Promise((resolve, reject)=>{
            
    //         let formData = new FormData();
            
    //         formData.append('id', d.id? d.id:'');
    //         formData.append('title', d.title);
    //         formData.append('description', d.description);
    //         formData.append('created', d.created);
    //         formData.append('logo', d.logo);

    //         var xhr = new XMLHttpRequest();

    //         xhr.onreadystatechange = function (e) {
    //           if (xhr.readyState === 4) { // done
    //             if (xhr.status === 200) { // ok
    //                 resolve(JSON.parse(xhr.response));
    //                 //console.log(xhr.responseText);
    //             } else {
    //                 reject(xhr.response);
    //                 //console.error(xhr.statusText);
    //             }
    //           }
    //         };

    //         xhr.onerror = function (e) {
    //             reject(xhr.response);
    //             //console.error(xhr.statusText);
    //         };

    //         xhr.open("POST", this.API_URL + 'wechat', true);
    //         xhr.setRequestHeader("authorization", "Bearer " + btoa(token));
    //         xhr.send(formData);
    //     }));
    // }

    // updateProduct(d:Product){
    //     let token = localStorage.getItem('token-'+this.APP);
    //     let formData = new FormData();
        
    //     formData.append('id', d.id? d.id:'');
    //     formData.append('title', d.title);
    //     formData.append('description', d.description);
    //     formData.append('n_subscription', d.n_subscription.toString());
    //     formData.append('rating', d.rating.toString());
    //     formData.append('user_id', d.user.id);
    //     formData.append('created', d.created);
    //     formData.append('logo', d.logo);

    //     var request = new XMLHttpRequest();
    //     request.open("PATCH", this.API_URL + 'product');
    //     request.send(formData);
    // }

    // getQRList(query?:string):Observable<QR[]>{
    //     const url = this.API_URL + 'qR' + (query ? query:'');
    //     let headers = new HttpHeaders().set('Content-Type', 'application/json');
    //     return this.http.get(url, {'headers': headers}).map((res:any) => {
    //         let a:QR[] = [];
    //         let d = res.data;
    //         if( d && d.length > 0){
    //             for(var i=0; i<d.length; i++){
    //                 a.push(new QR(d[i]));
    //             }
    //         }
    //         return a;
    //     })
    //     .catch((err) => {
    //         return Observable.throw(err.message || err);
    //     });
    // }

    // getQR(id:number):Observable<QR>{
    //     const url = this.API_URL + 'qR/id';
    //     let headers = new HttpHeaders().set('Content-Type', 'application/json');
    //     return this.http.get(url, {'headers': headers}).map((res:any) => {
    //         return new QR(res.data);
    //     })
    //     .catch((err) => {
    //         return Observable.throw(err.message || err);
    //     });
    // }

    // saveQR(d:QR):Observable<QR>{
    //     const url = this.API_URL + 'qR';
    //     let headers = new HttpHeaders().set('Content-Type', 'application/json');
    //     let data = {
    //       'title': d.title,
    //       'image': d.image,
    //       'product_id': d.product_id,
    //     }
    //     return this.http.post(url, data, {'headers': headers}).map((res:any) => {
    //         return new QR(res.data);
    //     })
    //     .catch((err) => {
    //         return Observable.throw(err.message || err);
    //     });
    // }

    // getSubscriptionList(query?:string):Observable<Subscription[]>{
    //     const url = this.API_URL + 'subscription' + (query ? query:'');
    //     let headers = new HttpHeaders().set('Content-Type', 'application/json');
    //     return this.http.get(url, {'headers': headers}).map((res:any) => {
    //         let a:Subscription[] = [];
    //         let d = JSON.parse(res.data);
    //         if( d && d.length > 0){
    //             for(var i=0; i<d.length; i++){
    //                 a.push(new Subscription(d[i].fields));
    //             }
    //         }
    //         return a;
    //     })
    //     .catch((err) => {
    //         return Observable.throw(err.message || err);
    //     });
    // }

    // getSubscription(id:number):Observable<Subscription>{
    //     const url = this.API_URL + 'subscription/id';
    //     let headers = new HttpHeaders().set('Content-Type', 'application/json');
    //     return this.http.get(url, {'headers': headers}).map((res:any) => {
    //         return new Subscription(res.data);
    //     })
    //     .catch((err) => {
    //         return Observable.throw(err.message || err);
    //     });
    // }

    // saveSubscription(d:Subscription):Observable<Subscription>{
    //     const url = this.API_URL + 'subscription';
    //     let headers = new HttpHeaders().set('Content-Type', 'application/json');
    //     let data = {
    //       'user_id': d.user.id,
    //       'ip': d.ip,
    //       'product_id': d.product.id,
    //       'created': d.created,
    //       'updated': d.updated,
    //     }
    //     return this.http.post(url, data, {'headers': headers}).map((res:any) => {
    //         return new Subscription(res.data);
    //     })
    //     .catch((err) => {
    //         return Observable.throw(err.message || err);
    //     });
    // }



  // // w --- width after resizeImage
  // // h --- height after resizeImage
  // resizeCanvas(canvas:any, w:number, h:number){
  //   if(this.FRAME_H<360){
  //     this.FRAME_PADDING_H = (360 - h)/2;
  //   }else{
  //     this.FRAME_PADDING_H = (this.FRAME_H - h)/2;
  //   }

    
  //   this.CANVAS_W = w;
  //   this.CANVAS_H = h;
  //   //canvas.setAttribute("style", "margin-top:" +  this.FRAME_PADDING_H + "px;");
  // }
// scaleImageSize(frame_w:any, frame_h:any, w: any, h: any){
//         var rw = 0;
//         var rh = 0;

//         var h1 = h * frame_w / w;  
//         if( h1 > frame_h ){
//           rh = frame_h;
//           rw = w * frame_h / h;
//         }else{
//           rw = frame_w;
//           rh = h * frame_w / w;
//         }
//         return {'w':rw, 'h':rh};
//     }

    resizeImage(frame_w:number, frame_h:number, w: number, h: number){
        var rw = 0;
        var rh = 0;

        var h1 = h * (frame_w - 2) / w;  
        if( h1 > frame_h ){
          rh = frame_h;
          rw = w * frame_h / h;
        }else{
          rw = frame_w - 2;
          rh = h * (frame_w - 2) / w;
        }
        return {'w':Math.round(rw), 'h':Math.round(rh), 'padding_top': Math.round((frame_h - rh)/2) };
    }

  // resizeImage(canvas:any, img:any, max_w:number, max_h:number){
  //   var w = img.width;
  //   var h = img.height;

  //   var r = this.itemServ.scaleImageSize(max_w, max_h, w, h);
  //   canvas.width = r.w;
  //   canvas.height = r.h;
  //   var ctx = canvas.getContext('2d');
  //   ctx.drawImage(img, 0, 0, r.w, r.h);
  //   return {'ctx':ctx, 'w':r.w, 'h':r.h};
  // }

  // checkFeature(img:any, fname:string, cb:any){
  //     let self = this;
  //     let w = img.width;
  //     let h = img.height;
  //     let pc = document.getElementById('process-canvas') as HTMLCanvasElement;
  //     let sw = (w > h)? 12:9;
  //     let sh = (w > h)? 9:12;
  //     self.resizeImage(pc, img, sw, sh);

  //     pc.toBlob(function(blob){
  //       self.itemServ.checkFeatureV2(blob, fname).subscribe(function(rsp:any){
  //         if(cb)
  //           cb(rsp);
  //       });
  //     });
  //   }

  //   toInt(n:any){ return Math.round(Number(n)); };

  // fileChange(event:any) {
  //     let self = this;
  //     let fileList: FileList = event.target.files;

  //     if(fileList.length > 0) {
  //         let file: File = fileList[0];
  //         if (file) {
  //           let reader = new FileReader();
  //           let image = new Image();
  //           let canvas = document.getElementById('item-canvas') as HTMLCanvasElement;

  //           image.onload = function(){
  //             var r = self.resizeImage(canvas, image, self.FRAME_W, self.FRAME_H);
  //             self.resizeCanvas(canvas, r.w, r.h);
  //             self.product.pixel = self.toInt(r.w) + 'x' + self.toInt(r.h);

  //             self.checkFeature(image, file.name, function(rsp:any){
  //               if(rsp.success){
  //                 self.data = rsp.data;
  //                 self.progress = 100;
  //                 self.ref.detectChanges();
  //                 //self.changeProgress();
  //               }else{
  //                 self.data = null;
  //                 self.showAlert('Alert', 'Photo existed');
  //                 self.progress = 0;
  //               };
  //             });

  //             canvas.toBlob(function(blob){
  //               self.blob = blob;
  //             });
  //           }

  //           reader.onload = function (e:any) {
  //             image.src = e.target.result; // trigger image.onload
  //           }
  //           reader.readAsDataURL(file);
  //           this.file = file;
  //         }   
  //     }
  // }

  //   uploadItem($event:any){
  //     var product = this.product;
  //     product.fpath = this.file? ('/photos/' + product.owner.username + '/' + this.file.name) : 'sample.png';
  //     //item.updated = new Date().toLocaleDateString();
  //     var self = this;

  //     if(self.data){
  //       self.itemServ.uploadProduct(this.file.name, self.blob, self.data, product, 
  //         function(progress:any){
  //           self.progress = progress;
  //         },
  //         function(){
  //           //completed callback
  //           if('market' == product.source){
  //             //self.showAlert('Alert', 'Photo uploaded successfully');
  //             self.navCtrl.push(ProductListPage);
  //           }else{
  //             self.showSellConfirmation(self.data);
  //           }
  //         });
  //     }else{
  //       self.showAlert('Alert', 'Photo existed');
  //     }
  //   }


}


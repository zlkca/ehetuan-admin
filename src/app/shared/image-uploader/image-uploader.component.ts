import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SharedService } from '../shared.service';

const ADD_IMAGE = environment.MEDIA_ROOT + 'add_photo.png';
const FRAME_W = 180;
const FRAME_H = 240;

declare var $;

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {
	@Input() data : any[];
	_data:any;
  currPic:any = {index:1, data:'', file:''};

	MEDIA_ROOT = environment.MEDIA_ROOT;

	// set data(d:any){
	//     this._data = d;
	// }
  constructor(private sharedServ:SharedService) { }

  ngOnInit(){

  }

  ngOnChanges() {
  	let t = this.data;
  	let ret = this.sharedServ.resizeImage(FRAME_W,FRAME_H,100, 200);
    if(!this.data || this.data.length == 0){
      this.currPic = {index:0, data:ADD_IMAGE, file:''};
    }else{
      this.currPic = {index:this.data.length, data:ADD_IMAGE, file:''};
    }
  }

  // ngOnInit() {
    //     let self = this;
        
    //     self.commerceServ.getCategoryList().subscribe(
    //         (r:Category[]) => {
    //             self.categoryList = r;
    //         },
    //         (err:any) => {
    //             self.categoryList = [];
    //         });

    //     self.route.params.subscribe((params:any)=>{
    //         self.id = params.id;

    //         self.commerceServ.getImageDefaultTitle(1).subscribe((r)=>{
    //             self.defaultTitles = [r.name0, r.name1, r.name2, r.name3];

    //             if(params.id){
    //               self.commerceServ.getWechatGroup(params.id).subscribe(
    //                 (r:WechatGroup) => {
    //                     r.qrs = self.commerceServ.getWechatGroupQRs(r.qrs, self.defaultTitles);
    //                     self.wechatgroup = r
    //                 },
    //                 (err:any) => {
    //                     let r = new WechatGroup();
    //                     r.category = {'id':1};
    //                     r.qrs = self.commerceServ.getWechatGroupQRs(r.qrs, self.defaultTitles);
    //                     self.wechatgroup = r;
    //                 });
    //             }else{
    //                 let r = new WechatGroup();
    //                 r.category = {'id':1};
    //                 r.qrs = self.commerceServ.getWechatGroupQRs(r.qrs, self.defaultTitles);
    //                 self.wechatgroup = r;
    //             }

    //         },(err)=>{
              
    //         });


    //     });
    // }

    // save() {
    //     let self = this;
    //     self.wechatgroup.user = {'id':1, 'name':'admin'};
    //     self.wechatgroup.id = self.id;
    //     // self.wechatgroup.images = self.images;
    //     self.commerceServ.saveWechatGroup(self.wechatgroup).subscribe(
    //         (r:any) => {
    //             //self.wechatgroup = new WechatGroup(r.data[0]);
    //             self.router.navigate(["admin/wechatgroups"]);
    //         },
    //         (err:any) => {
    //             //self.wechatgroup = new WechatGroup();
    //             self.router.navigate(["admin/wechatgroups"]);
    //         });
    // }
    getImageSrc(image:any){
      if(image.file){
        return image.data;
      }else{
        return this.MEDIA_ROOT + image.data
      }
    }

    onLoadImage(i:number){
      $('[name="image'+ i +'"]').click();
    }

    onDeleteImage(i:number){
        let pic = this.data[i];
        pic.image.data = '';
        pic.image.file = '';
        this.data[i] = pic;
    }

    onImageChange(event:any, i:number){
        let self = this;
        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
          let file = event.target.files[0];
          reader.readAsDataURL(file);
          reader.onload = () => {
              if(i>=self.data.length){
                self.data.push({index:i, name:"", image:{data: reader.result, file: event.target.files[0]}});
                self.currPic = {index:i+1, data:ADD_IMAGE, file:''};
              }else{
                self.data[i].image = {data: reader.result, file: event.target.files[0]};
              }//.split(',')[1];
              //self.wechatgroup.logo = event.target.files[0];
          //   this.form.get('avatar').setValue({
          //     filename: file.name,
          //     filetype: file.type,
          //     value: reader.result.split(',')[1]
          //   })
          }
        }
    }

}

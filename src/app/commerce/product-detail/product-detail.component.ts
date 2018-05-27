import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommerceService } from '../../commerce/commerce.service';
import { Category, Product } from '../../commerce/commerce';
import { environment } from '../../../environments/environment';

@Component({
    providers:[CommerceService],
    selector: 'product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
    // MEDIA_URL = environment.APP_URL+'/media/';
    // categoryList:Category[] = [];
    // product:Product = new Product();
    // categoryName:string = "";
    // id:any;
    // emptyImage = environment.APP_URL + '/media/empty.png';
    // defaultTitles:any = ['','','',''];

    constructor(private commerceServ:CommerceService, private router: Router, private route: ActivatedRoute){

    }

    ngOnInit() {
        // let self = this;

        // this.commerceServ.getImageDefaultTitle(1).subscribe((r)=>{
        //   self.defaultTitles = [r.name0, r.name1, r.name2, r.name3];
        // },(err)=>{
          
        // });

        // self.commerceServ.getCategoryList().subscribe(
        //     (r:Category[]) => {
        //         self.categoryList = r;
        //     },
        //     (err:any) => {
        //         self.categoryList = [];
        //     });

        // self.route.params.subscribe((params:any)=>{
        //     self.id = params.id;
        //     if(params.id){
        //       self.commerceServ.getProduct(params.id).subscribe(
        //         (r:Product) => {
                    
        //             r.logo = self.commerceServ.getImageUrl(r.logo);
        //             r.qrs = self.commerceServ.getProductQRs(r.qrs, self.defaultTitles);

        //             if(r.category){
        //               self.categoryName = r.category.name;
        //             }
                    
        //             self.product = r;
        //         },
        //         (err:any) => {
        //             self.product = new Product();
        //             self.product.logo = self.commerceServ.getDefaultLogo(self.product);
        //             self.product.qrs = self.commerceServ.getProductQRs(self.product.qrs, self.defaultTitles);
        //         });
        //     }else{
        //       self.product = new Product();
        //       self.product.logo = self.commerceServ.getDefaultLogo(self.product);
        //       self.product.qrs = self.commerceServ.getProductQRs(self.product.qrs, self.defaultTitles);
        //     }
        // });
    }

    // save() {
    //     let self = this;
    //     self.product.user = {'id':1, 'name':'admin'};
    //     self.product.id = self.id;

    //     self.commerceServ.saveProduct(self.product).subscribe(
    //         (r:any) => {
    //             //self.product = new Product(r.data[0]);
    //             self.router.navigate(["products"]);
    //         },
    //         (err:any) => {
    //             //self.product = new Product();
    //             self.router.navigate(["products"]);
    //         });
    // }

    // onFileChange(event) {
    //     let self = this;
    //     let reader = new FileReader();
    //     if(event.target.files && event.target.files.length > 0) {
    //       let file = event.target.files[0];
    //       reader.readAsDataURL(file);
    //       reader.onload = () => {
    //           //self.logo = reader.result;//.split(',')[1];
    //           self.product.logo = event.target.files[0];
    //       //   this.form.get('avatar').setValue({
    //       //     filename: file.name,
    //       //     filetype: file.type,
    //       //     value: reader.result.split(',')[1]
    //       //   })
    //       }
    //     }
    // }
}


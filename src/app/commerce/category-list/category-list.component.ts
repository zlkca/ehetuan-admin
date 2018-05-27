import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../commerce';
import { SharedService } from '../../shared/shared.service';
import { CommerceService } from '../commerce.service';

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
    categoryList:Category[];

    constructor(private sharedServ:SharedService, private commerceServ:CommerceService, private router:Router){ }

    ngOnInit() {
        let self = this;
        this.commerceServ.getCategoryList().subscribe(
            (r:Category[]) => {
                self.categoryList = r;
            },
            (err:any) => {
                self.categoryList = [];
            }
        );
    }

    toPage(url:string){
      this.router.navigate([url]);
    }

    change(r){
        this.router.navigate(["admin/category/" + r.id]);
    }

    add(){
        this.router.navigate(["admin/category"]);
    }

    delete(r){
        let self = this;
        this.commerceServ.rmCategory(r.id).subscribe(
            (r:Category[]) => {
                self.categoryList = r;
                if(r.length){
                    //
                }else{
                    self.router.navigate(["admin/category"]);
                }
            },
            (err)=>{
                
            }
        );
    }
}


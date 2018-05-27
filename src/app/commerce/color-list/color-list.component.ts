import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Color } from '../commerce';
import { SharedService } from '../../shared/shared.service';
import { CommerceService } from '../commerce.service';

@Component({
  selector: 'app-color-list',
  templateUrl: './color-list.component.html',
  styleUrls: ['./color-list.component.scss']
})
export class ColorListComponent implements OnInit {
    colorList:Color[];

    constructor(private sharedServ:SharedService, private commerceServ:CommerceService, private router:Router){ }

    ngOnInit() {
        let self = this;
        this.commerceServ.getColorList().subscribe(
            (r:Color[]) => {
                self.colorList = r;
            },
            (err:any) => {
                self.colorList = [];
            }
        );
    }

    toPage(url:string){
      this.router.navigate([url]);
    }

    change(r){
        this.router.navigate(["admin/color/" + r.id]);
    }

    add(){
        this.router.navigate(["admin/color"]);
    }

    delete(r){
        let self = this;
        this.commerceServ.rmColor(r.id).subscribe(
            (r:Color[]) => {
                self.colorList = r;
                if(r.length){
                    //
                }else{
                    self.router.navigate(["admin/color"]);
                }
            },
            (err)=>{
                
            }
        );
    }
}


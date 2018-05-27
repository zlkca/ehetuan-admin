import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Restaurant } from '../commerce';
import { CommerceService } from '../commerce.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.scss']
})
export class RestaurantListComponent implements OnInit {

	restaurantList:Restaurant[] = [];
    MEDIA_URL = environment.MEDIA_ROOT;

    constructor(private router:Router, private commerceServ:CommerceService){}

    ngOnInit() {
        let self = this;
        this.commerceServ.getRestaurantList().subscribe(
            (r:Restaurant[]) => {
                self.restaurantList = r;
            },
            (err:any) => {
                self.restaurantList = [];
            });
    }

    toPage(url:string){
      this.router.navigate([url]);
    }

    change(r){
        this.router.navigate(["admin/restaurant/" + r.id]);
    }

    add(){
        this.router.navigate(["admin/restaurant"]);
    }

    delete(r){
        let self = this;
        this.commerceServ.rmRestaurant(r.id).subscribe(
            (r:Restaurant[]) => {
                self.restaurantList = r;
                if(r.length){
                    //
                }else{
                    self.router.navigate(["admin/restaurant"]);
                }
            },
            (err)=>{
                
            }
        )
    }
}

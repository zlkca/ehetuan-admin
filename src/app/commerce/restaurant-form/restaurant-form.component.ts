import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { CommerceService } from '../commerce.service';
import { AccountService } from '../../account/account.service';
import { Restaurant, Category, Picture } from '../commerce';
import { City, Province, Address } from '../../account/account';
import { ImageUploaderComponent } from '../../shared/image-uploader/image-uploader.component';

@Component({
  selector: 'app-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss']
})
export class RestaurantFormComponent implements OnInit {
	restaurantForm: FormGroup;
	restaurant:Restaurant;
	id:string = '';
	categoryList:Category[] = [];
	cityList:City[] = [];
	provinceList:Province[] = [new Province({id:'48', name:'Ontario'})];
	pictures:any[] = [];

	@ViewChild(ImageUploaderComponent)
    uploader:any;

	// get name(){
	// 	return this.form.get('name');
	// }

	// get description(){
	// 	return this.form.get('description');
	// }

	// get categories(){
	// 	return this.form.get('categories') as FormArray;
	// }

	// get street(){
	// 	return this.form.get('street');
	// }

	// get province_id(){
	// 	return this.form.get('province_id');
	// }

	// get city_id(){
	// 	return this.form.get('city_id');
	// }

	constructor(private commerceServ:CommerceService, 
		private accountService:AccountService,
		private router:Router, 
		private route:ActivatedRoute, 
		private fb: FormBuilder) {
		this.createForm();
	}

	createForm(){
		this.restaurantForm = this.fb.group({
			name: ['', [Validators.required, Validators.minLength(3)]],
			description: ['', Validators.maxLength(750)],
			address: this.fb.group(new Address()),
			categories: this.fb.array([]),
			delivery_fee: ''
		});
	}

	ngOnInit() {
		let self = this;
        self.route.params.subscribe((params:any)=>{
            self.commerceServ.getRestaurant(params.id).subscribe(
                (r:Restaurant) => {
                	self.restaurant = r;
                	self.id = r.id;
                	self.restaurantForm.patchValue({
                    	name:self.restaurant.name,
                    	description:self.restaurant.description,
                    	delivery_fee:self.restaurant.delivery_fee,
                    	address: self.restaurant.address,
                    	categories: self.restaurant.categories
                	});
                    
                    if(r.image && r.image.data){
                    	self.pictures = [{index:0, name:"", image:r.image}];
                    }else{
                    	self.pictures = [];
                    }
                    
              //       self.commerceServ.getCategoryList().subscribe(catList=>{
		            //     self.categoryList = catList;
		            //     for(let cat of catList){
		            //         let c = r.categories.find(x=> x.id==cat.id );
		            //         if(c){
		            //             self.categories.push(new FormControl(true));
		            //         }else{
		            //             self.categories.push(new FormControl(false));
		            //         } 		                          
		            //     }
		            // })
                },
                (err:any) => {
                });



            // self.commerceServ.getCategoryList().subscribe(catList=>{
            //     self.categoryList = catList;
            //     for(let cat of catList){
            //         let c = p.categories.find(x=> x.id==cat.id );
            //         if(c){
            //             self.categories.push(new FormControl(true));
            //         }else{
            //             self.categories.push(new FormControl(false));
            //         } 
            //         //self.categories.push(new FormControl(s.id));      
            //     }
            // })
        });
        // self.accountService.getCityList().subscribe(cityList=>{
        // 	self.cityList = cityList;
        // })
        //create new
        self.commerceServ.getCategoryList().subscribe(catList=>{
            self.categoryList = catList;
            // for(let cat of catList){
            //     self.categories.push(new FormControl(false));    
            // }
        });

	}
      
	save(){
		let self = this;
		let v = this.restaurantForm.value;
		let picture = self.uploader.data[0]
		let addr = null;
		// hardcode Toronto as default
		if(self.restaurant && self.restaurant.address){
			addr = self.restaurant.address;
		}else{
			addr = new Address({id:'', city:{id:5130}, province:{id:48}, street:v.street});
		}
		let m = new Restaurant(this.restaurantForm.value);
		
		m.image = picture.image;
		m.id = self.id;

		let s = addr.street + ', ' + addr.city.name + ', ' + addr.province.name;
		this.commerceServ.getLocation(s).subscribe(ret=>{
			addr.lat = ret.lat;
			addr.lng = ret.lng;
			addr.postal_code = ret.postal_code;
			m.address = addr;
			self.commerceServ.saveRestaurant(m).subscribe( (r:any) => {
				self.router.navigate(['admin/restaurants']);
			});
		})

	}
}

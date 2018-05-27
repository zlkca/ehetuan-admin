import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { CommerceService } from '../commerce.service';
import { Restaurant, Category } from '../commerce';
import { City, Province, Address } from '../../account/account';

@Component({
  selector: 'app-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss']
})
export class RestaurantFormComponent implements OnInit {

	id:string = '';
	categoryList:Category[] = [];
	cityList:City[] = [new City({id:'5130', name:'Toronto', province:{id:'48'}})];
	provinceList:Province[] = [new Province({id:'48', name:'Ontario'})];

	// addressForm:FormGroup = new FormGroup({
	// 	street: new FormControl(),
	// 	province_id:new FormControl(),
 //        city_id:new FormControl(),
 //        postal_code: new FormControl()
	// })

	form:FormGroup = new FormGroup({
		name: new FormControl('', [Validators.required, Validators.minLength(3)]),
		description: new FormControl('',[Validators.maxLength(750)]),
		categories: new FormArray([]),
		// address: this.addressForm
		street: new FormControl(),
		postal_code: new FormControl()
	});

	get name(){
		return this.form.get('name');
	}

	get description(){
		return this.form.get('description');
	}

	get categories(){
		return this.form.get('categories') as FormArray;
	}

	get street(){
		return this.form.get('street');
	}

	get postal_code(){
		return this.form.get('postal_code');
	}

	get province_id(){
		return this.form.get('province_id');
	}

	get city_id(){
		return this.form.get('city_id');
	}

	constructor(private commerceServ:CommerceService, private router:Router, private route:ActivatedRoute) { }

	ngOnInit() {
		let self = this;
        self.route.params.subscribe((params:any)=>{
            self.commerceServ.getRestaurant(params.id).subscribe(
                (r:Restaurant) => {
                	self.id = r.id;
                    self.form.patchValue(r);

                    self.commerceServ.getCategoryList().subscribe(catList=>{
		                self.categoryList = catList;
		                for(let cat of catList){
		                    let c = r.categories.find(x=> x.id==cat.id );
		                    if(c){
		                        self.categories.push(new FormControl(true));
		                    }else{
		                        self.categories.push(new FormControl(false));
		                    } 
		                    //self.categories.push(new FormControl(s.id));      
		                }
		            })
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

        //create new
        self.commerceServ.getCategoryList().subscribe(catList=>{
            self.categoryList = catList;
            for(let cat of catList){
                self.categories.push(new FormControl(false));    
            }
        });

        self.form.patchValue({province_id:'48', city_id:'5130'});
	}

	save(){
		let self = this;
		let m = new Restaurant(this.form.value);
		m.id = self.id;
		this.commerceServ.saveRestaurant(m).subscribe( (r:any) => {
			self.router.navigate(['admin/restaurants']);
		});
	}
}

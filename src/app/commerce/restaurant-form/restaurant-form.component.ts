import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommerceService } from '../commerce.service';
import { Restaurant } from '../commerce';

@Component({
  selector: 'app-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss']
})
export class RestaurantFormComponent implements OnInit {

	id:string = '';

	form:FormGroup = new FormGroup({
		name: new FormControl('', [Validators.required, Validators.minLength(3)]),
		description: new FormControl('',[Validators.maxLength(750)])
	});

	get name(){
		return this.form.get('name');
	}

	get description(){
		return this.form.get('description');
	}

	constructor(private commerceServ:CommerceService, private router:Router, private route:ActivatedRoute) { }

	ngOnInit() {
		let self = this;
        self.route.params.subscribe((params:any)=>{
            this.commerceServ.getRestaurant(params.id).subscribe(
                (r:Restaurant) => {
                	self.id = r.id;
                    self.form.patchValue(r);
                },
                (err:any) => {
                });
        });
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

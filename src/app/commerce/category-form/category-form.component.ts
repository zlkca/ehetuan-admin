import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CommerceService } from '../commerce.service';
import { Category } from '../commerce';

@Component({
    selector: 'app-category-form',
    templateUrl: './category-form.component.html',
    styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
    category:Category = new Category();
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

    constructor(private commerceServ:CommerceService, private route: ActivatedRoute, private router:Router){}

    ngOnInit() {
        let self = this;
        self.route.params.subscribe((params:any)=>{
            this.commerceServ.getCategory(params.id).subscribe(
                (r:Category) => {
                    self.id = r.id;
                    self.form.patchValue(r);
                },
                (err:any) => {
                    // self.category = new Category();
                });
        });
    }

    save() {
        let self = this;
        let c = new Category(this.form.value);
        c.id = self.id;
        this.commerceServ.saveCategory(c).subscribe( (r:any) => {
            self.router.navigate(['admin/categories']);
        });
    }
}


import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CommerceService } from '../commerce.service';
import { Color } from '../commerce';

@Component({
  selector: 'app-color-form',
  templateUrl: './color-form.component.html',
  styleUrls: ['./color-form.component.scss']
})
export class ColorFormComponent implements OnInit {
    category:Color = new Color();
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
            this.commerceServ.getColor(params.id).subscribe(
                (r:Color) => {
                    self.id = r.id;
                    self.form.patchValue(r);
                },
                (err:any) => {
                    // self.category = new Color();
                });
        });
    }

    save() {
        let self = this;
        let c = new Color(this.form.value);
        c.id = self.id;
        this.commerceServ.saveColor(c).subscribe( (r:any) => {
            self.router.navigate(['admin/colors']);
        });
    }
}


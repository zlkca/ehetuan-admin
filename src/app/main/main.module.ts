import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
// import { RestaurantComponent } from './restaurant/restaurant.component';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { CommerceModule} from '../commerce/commerce.module';

import { RestaurantListComponent } from '../commerce/restaurant-list/restaurant-list.component';
import { RestaurantFormComponent } from '../commerce/restaurant-form/restaurant-form.component';
import { CategoryListComponent } from '../commerce/category-list/category-list.component';
import { CategoryFormComponent } from '../commerce/category-form/category-form.component';
import { ColorListComponent } from '../commerce/color-list/color-list.component';
import { ColorFormComponent } from '../commerce/color-form/color-form.component';

import { ProductListComponent } from '../commerce/product-list/product-list.component';
import { ProductFormComponent } from '../commerce/product-form/product-form.component';
import { LoginComponent } from '../account/login/login.component';

const adminRoutes:Routes = [
  {
    path:'admin', component:LayoutComponent,
    children:[
      { path: 'restaurants', component:RestaurantListComponent },
      { path: 'restaurant/:id', component:RestaurantFormComponent },
      { path: 'restaurant', component:RestaurantFormComponent },
    //   { path: 'users', component:AdminUserListComponent },
    //   { path: 'user/:id', component:AdminUserFormComponent },
      // { path: 'user', component:AdminUserFormComponent },
      { path: 'categories', component:CategoryListComponent },
      { path: 'category/:id', component:CategoryFormComponent },
      { path: 'category', component:CategoryFormComponent },
      { path: 'colors', component:ColorListComponent },
      { path: 'color/:id', component:ColorFormComponent },
      { path: 'color', component:ColorFormComponent },
      { path: 'products', component:ProductListComponent},
      { path: 'product/:id', component:ProductFormComponent },
      { path: 'product', component:ProductFormComponent},
    //   { path: 'posts', component:AdminPostListComponent},
    //   { path: 'post/:id', component:AdminPostFormComponent },
    //   { path: 'post', component:AdminPostFormComponent},
    //   { path: 'comments', component:AdminCommentListComponent},
    //   { path: 'comment/:id', component:AdminCommentFormComponent },
    //   { path: 'comment', component:AdminCommentFormComponent}
    ]
  }
]
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(adminRoutes)
  ],
  //[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [LayoutComponent, HomeComponent, ProductComponent]
})
export class MainModule { }

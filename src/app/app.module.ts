import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';

import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';

import { HomeComponent } from './main/home/home.component';
import { ProductComponent } from './main/product/product.component';
// import { ContactComponent } from './main/contact/contact.component';
// import { LoginComponent } from './users/login/login.component';
// import { SignupComponent } from './users/signup/signup.component';
// import { ForgetPasswordComponent } from './users/forget-password/forget-password.component';
// import { ProfileComponent } from './users/profile/profile.component';
// import { ProfileEditComponent } from './users/profile-edit/profile-edit.component';
// import { ChangePasswordComponent } from './users/change-password/change-password.component';

import { LoginComponent } from './account/login/login.component';
import { SignupComponent } from './account/signup/signup.component';
import { ProductListComponent } from './commerce/product-list/product-list.component';

import { AccountModule } from './account/account.module';
import { MainModule }    from './main/main.module';
import { SharedModule } from './shared/shared.module';
import { CommerceModule } from './commerce/commerce.module';
import { LayoutComponent } from './main/layout/layout.component';


//import { MsgService } from './main/shared/main.service';

const appRoutes: Routes = [
  // { path: 'login', component:LoginComponent },
  // { path: 'signup', component:SignupComponent },
  // { path: 'contact-us', component:ContactComponent },
  // //{ path: 'product-list', component:ProductListComponent },
  // { path: 'product/:id', component:ProductDetailComponent },
  // { path: 'business/:id', component:BusinessDetailComponent },
  // { path: 'shopping-cart', component:ShoppingCartComponent },
  // { path: 'forget-password', component:ForgetPasswordComponent },
  // { path: 'profiles', component:ProfileComponent },
  // { path: 'profile-edit', component:ProfileEditComponent },
  // { path: 'change-password', component:ChangePasswordComponent },
  // { path: 'admin', component:AdminDashboardComponent },
  { path: 'admin/login', component:LoginComponent },
  { path: 'admin/signup', component:SignupComponent },
  //{ path: '', component:LayoutComponent,
      // children:[
      //   { path: 'products', component:ProductListComponent },
      //   { path: 'product/:id', component:ProductComponent },
      //   { path: 'home', component:HomeComponent }
      // ]
  //}
];


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      // { enableTracing: true } // <-- debugging purposes only
    ),
    NgbModule.forRoot(),
    SharedModule,
    CommerceModule,
    AccountModule,
    MainModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  //providers: [MsgService],
  bootstrap: [AppComponent],
  
})
export class AppModule { }

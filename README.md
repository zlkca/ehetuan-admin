# ehetuan-admin

This is a food delivery admin website of angular5 responsive website ( front end only ). The project can be an admin website for your project, to replace for example, django admin.  

Hope this project will help you as well.

## Install

cd to root folder.
run `npm install`

## Run server

run `http://localhost:6004/admin` to start server

You need to provide a standard angular2 environments folder and files before build and run the server, The content should have the following structure.

```javascript
export const environment = {
  production: true,
  API_URL: window.location.origin + "/api/", // depend on your backend api design
  APP_URL: window.location.origin,
  APP:"your app name",
  GOOGLE_MAP:{
  	KEY:'Yor google map key  (can be empty string here)'
  },
  GOOGLE_LOGIN:{
  	CLIENT_ID:'your google login client id (can be empty string here)'
  },
  GOOGLE_ANALYTICS:{
    CLIENT_ID:'your google analytics client id  (can be empty string here)'
  },
  STRIPE:{
    CLIENT_KEY:'your stripe client key (can be empty string here)'
  }
};
```

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

The layout component use to organize layout of the page; shared module used to define the shared component like header, footer, pages folder keep the page that used to navigate in layout; The main module used to define the pages.


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Most of the components, services were covered by unit test.

Run `ng test` to test the project.

## Running end-to-end tests

N/A

## Further help

Write email to support@yocompute.com for free support!

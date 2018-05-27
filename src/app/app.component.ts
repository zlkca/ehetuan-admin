import { Component, OnInit } from '@angular/core';
//declare var $: any;
//declare var device;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent { //implements OnInit {
    constructor(){
      
      window.addEventListener("orientationchange", function() {
          window.location.reload();
      }, false);
    }

	// ngOnInit(){
	// 	document.addEventListener("deviceready", onDeviceReady, false);
	// 	function onDeviceReady(){
	// 		alert(device.platform);
	// 	}
	// }
}

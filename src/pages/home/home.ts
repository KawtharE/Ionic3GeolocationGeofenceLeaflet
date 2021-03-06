import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import leaflet from 'leaflet';


declare var AdvancedGeolocation: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  currentLat: any;
  currentLng: any;

  constructor(public navCtrl: NavController, public platform: Platform) {
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    this.map = leaflet.map("map").fitWorld();
	leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attributions: 'www.tphangout.com',
	    maxZoom: 18
	}).addTo(this.map);
	this.platform.ready().then(() => {
 		if (this.platform.is('android') && !this.platform.is('mobileweb')) {
            AdvancedGeolocation.start((position) => {
              try {
                var jsonObject = JSON.parse(position);
                switch (jsonObject.provider) {
                  case "gps":
                    this.currentLat = jsonObject.latitude;
                    this.currentLng = jsonObject.longitude;
                    break;

                  case "network":
                    this.currentLat = jsonObject.latitude;
                    this.currentLng = jsonObject.longitude;
                    break;

                  case "satellite":
                    //TODO
                    break;

                  case "cell_info":
                    //TODO
                    break;

                  case "cell_location":
                    //TODO
                    break;

                  case "signal_strength":
                    //TODO
                    break;
                }
                this.map.setView([this.currentLat, this.currentLng], 16);
		    	let markerGroup = leaflet.featureGroup();
		    	let marker: any = leaflet.marker([this.currentLat, this.currentLng]);
		    	marker.bindPopup("<b>I'm here!</b><br>").openPopup();
		    	markerGroup.addLayer(marker);
		    	this.map.addLayer(markerGroup);
		    	var circle = leaflet.circle([this.currentLat, this.currentLng], {
		    	    color: 'Green',
				    fillColor: '#81C784',
				    fillOpacity: 0.5,
				    radius: 200
		    	}).addTo(this.map);
		    	circle.bindPopup("My area.");

              } catch (exc) {
                console.log("Error: " + exc);
                alert('Sorry looks like there is an error and cannot detect your current location on your Android device!');
              }
				    
			   
            },
            function (error) {
                console.log("ERROR! " + JSON.stringify(error));
            },
            {
                "minTime": 500,         // Min time interval between updates (ms)
                "minDistance": 100,       // Min distance between updates (meters)
                "noWarn": true,         // Native location provider warnings
                "providers": "all",     // Return GPS, NETWORK and CELL locations
                "useCache": true,       // Return GPS and NETWORK cached locations
                "satelliteData": false, // Return of GPS satellite info
                "buffer": false,        // Buffer location data
                "bufferSize": 0,         // Max elements in buffer
                "signalStrength": false // Return cell signal strength data
            });
    	} else {
			 this.map.locate({
			   setView: true,
			   maxZoom: 10
			 }).on('locationfound', (e) => {
			   this.map.setView([e.latitude, e.longitude], 16);
			   let markerGroup = leaflet.featureGroup();
			   let marker: any = leaflet.marker([e.latitude, e.longitude]);
			   marker.bindPopup("<b>I'm here!</b><br>").openPopup();
			   markerGroup.addLayer(marker);
			   this.map.addLayer(markerGroup);
			   var circle = leaflet.circle([e.latitude, e.longitude], {
			     color: 'Green',
	             fillColor: '#81C784',
		         fillOpacity: 0.5,
		         radius: 200
			    }).addTo(this.map);
			    circle.bindPopup("My area.");
			  }).on('locationerror', (err) => {
			    alert(err.message);
			  });
    	}
    });
   
  }

}

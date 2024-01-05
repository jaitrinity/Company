import { DOCUMENT, DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { LayoutComponent } from '../layout.component';
import { Constant } from 'src/app/services/Contant';
declare var $: any;

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {
  zoom = 10;
  lat = 28.622524;
  lng = 77.3661221;
  public origin: any;
  public destination: any;
  inProgress=false;
  isFullscreen=false;
  todayDate = "";
  filterDate = "";
  filterEmpId = "";
  totalVisit = "";
  distanceTravel = "";
  mapViewList = [];
  employeeList = [];
  loginEmpId = "";
  loginEmpRoleId = "";
  button = "";
  alertFadeoutTime = 0;
  tenentId = "";
  alarmRecall = 0; // in second
  public markerOptions = {
    origin: {
        // icon: './assets/img/ok.png',
        // label: 'MARKER LABEL',
        // draggable: true,
        infoWindow : '<h4>Origin<h4>'
    },
    destination: {
        // icon: './assets/img/notok.png',
        // label: 'MARKER LABEL',
        infoWindow : '<h4>Destination<h4>'
        // opacity: 0.8,
    },
  }
  elem;
  constructor(private sharedService : SharedService, private layoutComponent : LayoutComponent,
    private datePipe : DatePipe, @Inject(DOCUMENT) private document: any) {
    this.loginEmpId = localStorage.getItem("loginEmpId")
    this.loginEmpRoleId = localStorage.getItem("loginEmpRoleId");
    this.button = localStorage.getItem("button")
    this.layoutComponent.setTitle("Map View");
  }

  ngOnInit(): void {
    this.elem = document.documentElement;
    this.todayDate = this.datePipe.transform(new Date(),'yyyy-MM-dd');
    this.getAllList();
  }

  onMapReady(map?: google.maps.Map ){
    if(map)
      map.setOptions({
        streetViewControl: false,
        fullscreenControl: true
      });
  }

  getAllList(){
    let jsonDate = {
      loginEmpId: this.loginEmpId,
      loginEmpRoleId: this.loginEmpRoleId
    }
    this.sharedService.getAllListBySelectType(jsonDate, "empMapView")
    .subscribe((response) =>{
      this.employeeList = response.empList;
      if(this.loginEmpRoleId != "1"){
        this.filterEmpId = this.loginEmpId;
      }
    },
    (error)=>{
      alert(Constant.returnServerErrorMessage("getAllList"));
    });
  }

  viewMap(){
    if(this.filterDate == ''){
      this.totalVisit = ""; 
      this.mapViewList = [];
      return;
    }
    else if(this.filterEmpId == ''){
      this.totalVisit = ""; 
      this.mapViewList = [];
      return;
    }
    this.inProgress = true;
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRoleId : this.loginEmpRoleId,
      filterDate : this.filterDate,
      filterEmpId : this.filterEmpId
    }

    this.sharedService.getAllListBySelectType(jsonData,"mapView")
    .subscribe(
      (result)=>{
        this.mapViewList = result.mapViewList;
        this.totalVisit = result.totalVisit;
        this.distanceTravel = result.distanceTravel;
        if(this.mapViewList.length == 0){
          this.totalVisit = "";
          this.distanceTravel = "";
          this.isFullscreen=false;
          alert("No record data found");
        }
        // console.log(JSON.stringify(this.mapViewList))
        this.inProgress = false;
      },
      (error)=>{
        alert(Constant.returnServerErrorMessage("viewMap"));
        this.inProgress = false;
      }
    )
  }

  previous
  clickedMarker(infowindow,index){
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }

  openedWindow : number = 0; // alternative: array of numbers

  openWindow(id) {
    this.zoom = 13;
    this.openedWindow = id; // alternative: push to array of numbers
  }

  isInfoWindowOpen(id) {
      return this.openedWindow == id; // alternative: check if id is in array
  }

  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
    this.isFullscreen=true;
    $("agm-map").css({'height':"550px"});
  }

  /* Close fullscreen */
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
    this.isFullscreen=false;
    $("agm-map").css({'height':"450px"});
  }

}

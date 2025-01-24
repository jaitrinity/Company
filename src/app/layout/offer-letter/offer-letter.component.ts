import { Component, OnInit } from '@angular/core';
import { Constant } from 'src/app/services/Contant';
import { SharedService } from 'src/app/services/shared.service';
import { OfferLetterTableSettings } from 'src/app/tableSettings/OfferLetterTableSettings';
import { environment } from 'src/environments/environment';
import { LayoutComponent } from '../layout.component';
declare var $: any;

@Component({
  selector: 'app-offer-letter',
  templateUrl: './offer-letter.component.html',
  styleUrls: ['./offer-letter.component.css']
})
export class OfferLetterComponent implements OnInit {

  isInterviewee : boolean = true;
  selectedIntervieweeList = [];
  intervieweeId = "";
  name = "";
  mobile = "";
  emailId = "";
  officeLocation = "";
  addLine1 = "";
  addLine2 = "";
  designation = "";
  doj = "";
  lpa = "";
  todayDate : Date;
  loginEmpId = "";
  loginEmpRoleId = "";
  button = "";
  inProgress : boolean = false;
  inProgress1 : boolean = false;
  tableSettings = OfferLetterTableSettings.settings;
  offerLetterList = [];
  constructor(private sharedService : SharedService,private layoutComponent : LayoutComponent) { 
    this.layoutComponent.setTitle("Offer Letter");
    this.todayDate = new Date();
    this.loginEmpId = localStorage.getItem("loginEmpId")
    this.loginEmpRoleId = localStorage.getItem("loginEmpRoleId");
    this.button = localStorage.getItem("button");
  }

  ngOnInit(): void {
    this.getSelectedIntervieweeList();
    this.getAllOfferLetter();
  }
  getSelectedIntervieweeList(){
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRoleId: this.loginEmpRoleId
    }
    this.sharedService.getAllListBySelectType(jsonData,"selectedInterviewee")
    .subscribe(
      (result)=>{
        this.selectedIntervieweeList = result.selectedIntervieweeList;
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("getSelectedIntervieweeList"),0);
      }
    )
  }

  getInterviewData(){
    let objList = this.selectedIntervieweeList.filter(x => x.id == this.intervieweeId);
    let obj = objList[0];
    this.name = obj.name;
    this.mobile = obj.mobile;
    this.emailId = obj.emailId;
  }
  getAllOfferLetter(){
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRoleId: this.loginEmpRoleId
    }
    this.sharedService.getAllListBySelectType(jsonData,"offerLetter")
    .subscribe(
      (result)=>{
        this.offerLetterList = result.offerLetterList;
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("getAllOfferLetter"),0);
      }
    )
  }

  alertMsg = "";
  validateOfferLetterData() : any{
    if(this.name == ""){
      this.alertMsg = "Please select name";
      return false;
    }
    else if(this.mobile == ""){
      this.alertMsg = "Please enter mobile";
      return false;
    }
    else if(this.emailId == ""){
      this.alertMsg = "Please enter email id";
      return false;
    }
    else if(this.officeLocation == ""){
      this.alertMsg = "Please select location";
      return false;
    }
    else if(this.addLine1 == ""){
      this.alertMsg = "Please enter Address Line 1";
      return false;
    }
    else if(this.addLine2 == ""){
      this.alertMsg = "Please enter address line 2";
      return false;
    }
    else if(this.designation == ""){
      this.alertMsg = "Please enter designation";
      return false;
    }
    else if(this.doj == ""){
      this.alertMsg = "Please select DOJ";
      return false;
    }
    else if(this.lpa == ""){
      this.alertMsg = "Please enter CTC";
      return false;
    }
    return true;
  }

  generateOfferLetter(){
    if(!this.validateOfferLetterData()){
      this.layoutComponent.openSnackBar(this.alertMsg,2);
      return;
    }
    if(this.isInterviewee == false) this.intervieweeId = "0";
    let jsonData = {
      intervieweeId : this.intervieweeId,
      name : this.name,
      mobile : this.mobile,
      emailId : this.emailId,
      officeLocation: this.officeLocation,
      addLine1 : this.addLine1,
      addLine2 : this.addLine2,
      designation : this.designation,
      doj : this.doj,
      lpa : this.lpa
    }
    this.inProgress1 = true;
    this.sharedService.insertDataByInsertType(jsonData,"offerLetter")
    .subscribe(
      (result)=>{
        if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          //
          this.sendOfferLetter();
          //
          // this.layoutComponent.openSnackBar(result.responseDesc);
          // let updatedIntervieweeList = this.selectedIntervieweeList.filter(x => x.id != this.intervieweeId);
          // this.selectedIntervieweeList = updatedIntervieweeList;
          // this.getAllOfferLetter();
          // this.makeAsDefault();
          
        }
        else{
          this.layoutComponent.openSnackBar(result.responseDesc,2);
        }
        // this.inProgress1 = false;
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("generateOfferLetter"),0);
      }

    )
  }

  sendOfferLetter(){
    // this.inProgress1 = true;
    let jsonData = {
      mobile : this.mobile
    }
    this.sharedService.sendOfferLetterToMail(jsonData)
    .subscribe(
      (result)=>{
        if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.layoutComponent.openSnackBar(result.responseDesc,1);
          let updatedIntervieweeList = this.selectedIntervieweeList.filter(x => x.id != this.intervieweeId);
          this.selectedIntervieweeList = updatedIntervieweeList;
          this.getAllOfferLetter();
          this.makeAsDefault();
        }
        else{
          this.layoutComponent.openSnackBar(result.responseDesc,2);
        }
        this.inProgress1 = false;
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("sendOfferLetter"),0);
      }
    )
  }

  changeSelected(e){
    this.openAnyModal("offerLetterModal");
  }

  makeAsDefault(){
    this.isInterviewee = true;
    this.name = "";
    this.mobile = "";
    this.emailId = "";
    this.officeLocation = "";
    this.addLine1 = "";
    this.addLine2 = "";
    this.designation = "";
    this.doj = "";
    this.lpa = "";
  }

  onCustomAction(event){
    switch ( event.action) {
        case 'viewOffer':
          this.viewOffer(event);
          break;
       case 'resendOffer':
          this.resendOffer(event);
          break;
    }
  }

  viewOffer(e){
    this.mobile = e.data.mobile;
    let url = environment.appUrl+"viewOfferLetter.php?mobile="+this.mobile;
    window.open(url);
  }
  resendOffer(e){
    this.mobile = e.data.mobile;
    this.inProgress = true;
    let jsonData = {
      mobile : this.mobile
    }
    this.sharedService.resendOfferLetterToMail(jsonData)
    .subscribe(
      (result)=>{
        if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.layoutComponent.openSnackBar(result.responseDesc,1);
        }
        else{
          this.layoutComponent.openSnackBar(result.responseDesc,2);
        }
        this.inProgress = false;
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("resendOffer"),0);
      }
    )
  }


  openAnyModal(modalName){
    $("#"+modalName).modal({
      backdrop : 'static',
      keyboard : false
    });
  }

  closeAnyModal(modalName){
    $("#"+modalName).modal("hide");
  }
}

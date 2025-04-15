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
  id="";
  name = "";
  mobile = "";
  emailId = "";
  officeLocation = "";
  addLine1 = "";
  addLine2 = "";
  designation = "";
  doj = "";
  lpa = "";
  earningsY = "";
  earningsM = "";
  basicY = "";
  basicM = "";
  hraY = "";
  hraM = "";
  conveyanceY = "";
  conveyanceM = "";
  laptopY = "";
  laptopM = "";
  tdsY = "";
  tdsM = "";
  netSalaryY = "";
  netSalaryM = "";
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
    else if(this.earningsY == "" && this.earningsM == ""){
      this.alertMsg = "Please enter both Earning value";
      return false;
    }
    else if(this.basicY == "" && this.basicM == ""){
      this.alertMsg = "Please enter both Basic value";
      return false;
    }
    else if(this.tdsY == "" && this.tdsM == ""){
      this.alertMsg = "Please enter both TDS value";
      return false;
    }
    else if(this.netSalaryY == "" && this.netSalaryM == ""){
      this.alertMsg = "Please enter both Net Salary value";
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
      lpa : this.lpa,
      earningsY : this.earningsY,
      basicY : this.basicY,
      hraY : this.hraY == "" ? "0" : this.hraY,
      conveyanceY : this.conveyanceY == "" ? "0" : this.conveyanceY,
      laptopY : this.laptopY == "" ? "0" : this.laptopY,
      tdsY : this.tdsY,
      netSalaryY : this.netSalaryY,
      earningsM : this.earningsM,
      basicM : this.basicM,
      hraM : this.hraM == "" ? "0" : this.hraM,
      conveyanceM : this.conveyanceM == "" ? "0" : this.conveyanceM,
      laptopM : this.laptopM == "" ? "0" : this.laptopM,
      tdsM : this.tdsM,
      netSalaryM : this.netSalaryM
    }
    this.inProgress1 = true;
    this.sharedService.insertDataByInsertType(jsonData,"offerLetterNew")
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
          this.inProgress1 = false;
        }
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("generateOfferLetter"),0);
      }

    )
  }

  editOfferLetter(){
    let jsonData = {
      id : this.id,
      name : this.name,
      mobile : this.mobile,
      emailId : this.emailId,
      officeLocation: this.officeLocation,
      addLine1 : this.addLine1,
      addLine2 : this.addLine2,
      designation : this.designation,
      doj : this.doj,
      lpa: this.lpa,
      earningsY : this.earningsY,
      basicY : this.basicY,
      hraY : this.hraY,
      conveyanceY : this.conveyanceY,
      laptopY : this.laptopY,
      tdsY : this.tdsY,
      netSalaryY : this.netSalaryY,
      earningsM : this.earningsM,
      basicM : this.basicM,
      hraM : this.hraM,
      conveyanceM : this.conveyanceM,
      laptopM : this.laptopM,
      tdsM : this.tdsM,
      netSalaryM : this.netSalaryM
    }
    this.inProgress1 = true;
    this.sharedService.updateDataByUpdateType(jsonData,"offerLetter")
    .subscribe(
      (result)=>{
        if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.layoutComponent.openSnackBar(result.responseDesc,1);
          this.getAllOfferLetter();
          this.closeAnyModal("editOfferLetterModal");
        }
        else{
          this.layoutComponent.openSnackBar(result.responseDesc,2);
        }
        this.inProgress1 = false;
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
    this.id="";
    this.name = "";
    this.mobile = "";
    this.emailId = "";
    this.officeLocation = "";
    this.addLine1 = "";
    this.addLine2 = "";
    this.designation = "";
    this.doj = "";
    this.lpa = "";
    this.earningsY = "";
    this.earningsM = "";
    this.basicY = "";
    this.basicM = "";
    this.hraY = "";
    this.hraM = "";
    this.conveyanceY = "";
    this.conveyanceM = "";
    this.laptopY = "";
    this.laptopM = "";
    this.tdsY = "";
    this.tdsM = "";
    this.netSalaryY = "";
    this.netSalaryM = "";
  }

  onCustomAction(event){
    switch ( event.action) {
      case 'editOffer':
          this.editOffer(event);
          break;
      case 'viewOffer':
          this.viewOffer(event);
          break;
      case 'resendOffer':
          this.resendOffer(event);
          break;
    }
  }

  editOffer(e){
    this.id = e.data.id;
    this.name = e.data.name;
    this.mobile = e.data.mobile;
    this.emailId = e.data.emailId;
    this.officeLocation = e.data.officeLocation;
    this.addLine1 = e.data.addLine1;
    this.addLine2 = e.data.addLine2;
    this.designation = e.data.designation;
    this.doj = e.data.doj;
    this.lpa = e.data.lpaOrg;
    this.earningsY = e.data.earningsY;
    this.basicY = e.data.basicY;
    this.hraY = e.data.hraY;
    this.conveyanceY = e.data.conveyanceY;
    this.laptopY = e.data.laptopY;
    this.tdsY = e.data.tdsY;
    this.netSalaryY = e.data.netSalaryY;
    this.earningsM = e.data.earningsM;
    this.basicM = e.data.basicM;
    this.hraM = e.data.hraM;
    this.conveyanceM = e.data.conveyanceM;
    this.laptopM = e.data.laptopM;
    this.tdsM = e.data.tdsM;
    this.netSalaryM = e.data.netSalaryM;
    this.openAnyModal("editOfferLetterModal");
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
    this.sharedService.sendOfferLetterToMail(jsonData)
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
    this.makeAsDefault();
  }
}

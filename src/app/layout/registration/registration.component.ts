import { Component, OnInit } from '@angular/core';
import { Constant } from 'src/app/services/Contant';
import { SharedService } from 'src/app/services/shared.service';
import { LayoutComponent } from '../layout.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  isInterviewee : boolean = false;
  inProgress : boolean = false;
  offerApprovedList = [];
  rmId = "";
  rmEmpList = []
  offerId = "";
  name = "";
  fatherHusbandName = "";
  mobile = "";
  emailId = "";
  designation = "";
  dob = "";
  doj = "";
  address = "";
  pan = "";
  aadhar = "";
  basic = "";
  retentionBonus = "";
  hsr = "";
  conveyanceAllowance = "";
  medicalAllowance = "";
  telephoneAllowance = "";
  specialAllowance = "";
  otherAllowance = "";
  loginEmpId = "";
  loginEmpRoleId = "";
  button = "";
  todayDate : Date;
  dobMinDate : Date;
  dobMaxDate : Date;
  constructor(private sharedService : SharedService, private layoutComponent : LayoutComponent) { 
    this.layoutComponent.setTitle("Registration");
    this.loginEmpId = localStorage.getItem("loginEmpId")
    this.loginEmpRoleId = localStorage.getItem("loginEmpRoleId");
    this.button = localStorage.getItem("button");
    this.todayDate = new Date();
    const currentYear = new Date().getFullYear();
    this.dobMinDate = new Date(1960, 0, 1);
    this.dobMaxDate = new Date(currentYear-10, 11, 31);
  }

  ngOnInit(): void {
    this.getOfferApprovedEmp();
    this.getAllRmEmp();
  }

  getAllRmEmp(){
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRoleId: this.loginEmpRoleId
    }
    this.sharedService.getAllListBySelectType(jsonData,"allRmEmp")
    .subscribe(
      (result)=>{
        this.rmEmpList = result.rmEmpList;
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("allRmEmp"),0);
      }
    )
  }

  getOfferApprovedEmp(){
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRoleId: this.loginEmpRoleId
    }
    this.sharedService.getAllListBySelectType(jsonData,"offerApproved")
    .subscribe(
      (result)=>{
        this.offerApprovedList = result.offerApprovedList;
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("getOfferApprovedEmp"),0);
      }
    )
  }

  getOfferData(){
    let objList = this.offerApprovedList.filter(x => x.id == this.offerId);
    let obj = objList[0];
    this.name = obj.name;
    this.mobile = obj.mobile;
    this.emailId = obj.emailId;
    this.designation = obj.designation;
    this.doj = obj.doj;
  }

 
  changeListener(event: any, i): void {
    this.readThis(event.target, i);
  }

  panFileName: any = "";
  panStr : any = "";
  aadharFileName: any = "";
  aadharStr : any = "";

  readThis(inputValue: any, optionNumber): void {
    var file: File = inputValue.files[0];
    let wrongFile = false;
    let fileName = file.name;
    if(!(fileName.indexOf(".jpg") > -1 || fileName.indexOf(".jpeg") > -1 || 
    fileName.indexOf(".png") > -1 || fileName.indexOf(".pdf") > -1)){
      this.layoutComponent.openSnackBar("only .jpg, .jpeg, .png, .pdf format accepted, please choose right file.",2);
      wrongFile = true;
    }
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      let image = myReader.result;
      if (optionNumber == 1) {
        this.panFileName = fileName;
        this.panStr = image;
        if(wrongFile){
          this.panFileName = "";
          this.panStr = "";
        }
      }
      else if (optionNumber == 2) {
        this.aadharFileName = fileName;
        this.aadharStr = image;
        if(wrongFile){
          this.aadharFileName = "";
          this.aadharStr = "";
        }
      }
    }
    myReader.readAsDataURL(file);
  }

  validateEmailid(){
    var email=this.emailId;
    var atpos=email.indexOf("@");
    var dotpos=email.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length)
    {		
        return false;
    }
    else
    {
        return true;
    }
  }

  alertMsg = "";
  validateData() : any{
    if(this.name == ""){
      this.alertMsg = "Please enter name";
      return false;
    }
    else if(this.fatherHusbandName == ""){
      this.alertMsg = "Please enter Father/Husband name";
      return false;
    }
    else if(this.mobile == ""){
      this.alertMsg = "Please enter mobile value";
      return false;
    }
    else if(this.mobile.length != 10){
      this.alertMsg = "Mobile number length must be equal to 10 digit";
      return false;
    }
    else if(this.emailId == ""){
      this.alertMsg = "Please enter email id";
      return false;
    }
    else if(!this.validateEmailid()){
      this.alertMsg = "Please enter valid email id";
      return false;
    }
    else if(this.dob == ""){
      this.alertMsg = "Please enter Date of Birth";
      return false;
    }
    else if(this.doj == ""){
      this.alertMsg = "Please enter Date of Joining";
      return false;
    }
    else if(this.address == ""){
      this.alertMsg = "Please enter Address";
      return false;
    }
    else if(this.pan == ""){
      this.alertMsg = "Please enter PAN";
      return false;
    }
    else if(this.pan.length != 10){
      this.alertMsg = "Please enter valid PAN";
      return false;
    }
    else if(this.panStr == ""){
      this.alertMsg = "Please attach PAN attachment";
      return false;
    }
    else if(this.aadhar == ""){
      this.alertMsg = "Please enter Aadhar number";
      return false;
    }
    else if(this.aadhar.length != 12){
      this.alertMsg = "Please enter valid Aadhar number";
      return false;
    }
    else if(this.aadharStr == ""){
      this.alertMsg = "Please attach Aadhar attachment";
      return false;
    }
    else if(this.rmId == ""){
      this.alertMsg = "Please select a RM name";
      return false;
    }
    else if(this.designation == ""){
      this.alertMsg = "Please enter designation";
      return false;
    }
    else if(this.basic == ""){
      this.alertMsg = "Please enter Basic value";
      return false;
    }
    else if(this.retentionBonus == ""){
      this.alertMsg = "Please enter Retention Bonus value";
      return false;
    }
    this.hsr = this.hsr == "" ? "0" : this.hsr;
    this.conveyanceAllowance = this.conveyanceAllowance == "" ? "0" : this.conveyanceAllowance;
    this.medicalAllowance = this.medicalAllowance == "" ? "0" : this.medicalAllowance;
    this.telephoneAllowance = this.telephoneAllowance == "" ? "0" : this.telephoneAllowance;
    this.specialAllowance = this.specialAllowance == "" ? "0" : this.specialAllowance;
    this.otherAllowance = this.otherAllowance == "" ? "0" : this.otherAllowance;
    // else if(this.hsr == ""){
    //   this.alertMsg = "Please enter HSR value";
    //   return false;
    // }
    // else if(this.conveyanceAllowance == ""){
    //   this.alertMsg = "Please enter Conveyance Allowance";
    //   return false;
    // }
    // else if(this.medicalAllowance == ""){
    //   this.alertMsg = "Please enter Medical allowance";
    //   return false;

    // }
    // else if(this.telephoneAllowance == ""){
    //   this.alertMsg = "Please enter Telephone Allowance";
    //   return false;
    // }
    // else if(this.specialAllowance == ""){
    //   this.alertMsg = "Please enter Special Allowance";
    //   return false;
    // }
    // else if(this.otherAllowance == ""){
    //   this.alertMsg = "Please enter Other Allowance";
    //   return false;
    // }
      
    return true;
  }

  submitRegData(){
    if(!this.validateData()){
      this.layoutComponent.openSnackBar(this.alertMsg,2);
      return;
    }
    this.inProgress = true;
    let jsonData = {
      offerId : this.offerId,
      name : this.name,
      fatherHusbandName : this.fatherHusbandName,
      mobile : this.mobile,
      password : window.btoa(this.mobile),
      emailId : this.emailId,
      designation: this.designation,
      dob : this.dob,
      doj : this.doj,
      address : this.address,
      pan : this.pan,
      panStr : this.panStr,
      aadhar : this.aadhar,
      aadharStr : this.aadharStr,
      rmId: this.rmId,
      basic : this.basic,
      retentionBonus : this.retentionBonus,
      hsr : this.hsr,
      conveyanceAllowance : this.conveyanceAllowance,
      medicalAllowance : this.medicalAllowance,
      telephoneAllowance : this.telephoneAllowance,
      specialAllowance : this.specialAllowance,
      otherAllowance : this.otherAllowance
    }
    this.sharedService.insertDataByInsertType(jsonData,"employee")
    .subscribe(
      (result) => {
        if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          // let employeeId = result.employeeId;
          // this.sendJoiningLetterToMail(employeeId);
          this.layoutComponent.openSnackBar(result.responseDesc,1);
          let updatedOfferList = this.offerApprovedList.filter(x => x.id != this.offerId);
          this.offerApprovedList = updatedOfferList;
          this.makeAsDefault();
        }
        else{
          this.layoutComponent.openSnackBar(result.responseDesc,2);
        }
        this.inProgress = false;
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("submitRegData"),0);
        this.inProgress = false;
      }
    )
  }

  sendJoiningLetterToMail(employeeId){
    this.inProgress = true;
    let jsonData = {
      employeeId : employeeId
    }
    this.sharedService.sendJoiningLetterToMail(jsonData)
    .subscribe(
      (result)=>{
        if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.layoutComponent.openSnackBar(result.responseDesc,1);
          let updatedOfferList = this.offerApprovedList.filter(x => x.id != this.offerId);
          this.offerApprovedList = updatedOfferList;
          this.makeAsDefault();
        }
        else{
          this.layoutComponent.openSnackBar(result.responseDesc,2);
        }
        this.inProgress = false;
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("sendJoiningLetterToMail"),0);
        this.inProgress = false;
      }
    )
  }

  makeAsDefault(){
    this.name = "";
    this.fatherHusbandName = "";
    this.mobile = "";
    this.emailId = "";
    this.address = "";
    this.dob = "";
    this.doj = "";
    this.pan = "";
    this.panStr = "";
    this.panFileName = "";
    this.aadhar = "";
    this.aadharStr = "";
    this.aadharFileName = "";
    this.basic = "";
    this.retentionBonus = "";
    this.hsr = "";
    this.conveyanceAllowance = "";
    this.medicalAllowance = "";
    this.telephoneAllowance = "";
    this.specialAllowance = "";
    this.otherAllowance = "";
  }

}

import { Component, OnInit } from '@angular/core';
import { Constant } from 'src/app/services/Contant';
import { SharedService } from 'src/app/services/shared.service';
import { IntervieweeTableSetting } from 'src/app/tableSettings/IntervieweeTableSettings';
import { LayoutComponent } from '../layout.component';
declare var $: any;

@Component({
  selector: 'app-interviewee',
  templateUrl: './interviewee.component.html',
  styleUrls: ['./interviewee.component.css']
})
export class IntervieweeComponent implements OnInit {

  inProgress : boolean = false;
  name = "";
  mobile = "";
  emailId = "";
  companyName = "";
  ctc = "";
  noticePeriod = "";
  remark = "";
  tableSettings = IntervieweeTableSetting.setting;
  intevieweeList = [];
  loginEmpId = "";
  loginEmpRoleId = "";
  button = "";
  constructor(private sharedService : SharedService,private layoutComponent : LayoutComponent) { 
    this.layoutComponent.setTitle("Interviewee");
    this.loginEmpId = localStorage.getItem("loginEmpId")
    this.loginEmpRoleId = localStorage.getItem("loginEmpRoleId");
    this.button = localStorage.getItem("button");
  }

  ngOnInit(): void {
    this.getIntervieweeList();
  }

  getIntervieweeList(){
    let jsonData = {
      loginEmpId: this.loginEmpId,
      loginEmpRoleId: this.loginEmpRoleId
    }
    this.sharedService.getAllListBySelectType(jsonData, "interviewee")
    .subscribe(
      (result)=>{
        this.intevieweeList = result.intervieweeList;
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("getIntervieweeList"),0);
      }
    )
  }

  changeSelected(e){
    this.openAnyModal("intervieweeModal");
  }

  alertMsg = "";
  validateData() : any{
    if(this.name == ""){
      this.alertMsg = "Please enter Name";
      return false;
    }
    else if(this.mobile == ""){
      this.alertMsg = "Please enter Mobile";
      return false;
    }
    else if(this.emailId == ""){
      this.alertMsg = "Please enter Email Id";
      return false;
    }
    else if(this.companyName == ""){
      this.alertMsg = "Please enter Company Name";
      return false;
    }
    else if(this.ctc == ""){
      this.alertMsg = "Please enter CTC";
      return false;
    }
    else if(this.noticePeriod == ""){
      this.alertMsg = "Please enter Notice Period";
      return false;
    }
    else if(this.cvStr == ""){
      this.alertMsg = "Please upload CV";
      return false;
    }
    return true;
  }

  submitInteviewee(){
    if(!this.validateData()){
      this.layoutComponent.openSnackBar(this.alertMsg,2);
      return;
    }
    let jsonData = {
      name : this.name,
      mobile : this.mobile,
      emailId : this.emailId,
      companyName :this.companyName,
      ctc : this.ctc,
      noticePeriod:this.noticePeriod,
      cvStr : this.cvStr
    }
    this.sharedService.insertDataByInsertType(jsonData,"interviewee")
    .subscribe(
      (result)=>{
        if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.layoutComponent.openSnackBar(result.responseDesc,1);
          this.getIntervieweeList();
          this.makeAsDefault();
        }
        else{
          this.layoutComponent.openSnackBar(result.responseDesc,2)
        }
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("submitInteviewee"),0);
      }
    )
  }

  onCustomAction(event){
    switch ( event.action) {
      //   case 'activerecord':
      //     this.actionOnEmployee(event,1);
      //     break;
      //  case 'deactiverecord':
      //     this.actionOnEmployee(event,0);
      //     break;
        case 'viewRecord':
          this.viewInterviewee(event);
          break;
    }
  }

  viewId = "";
  viewStatus = "";
  viewInterviewee(evt){
    this.viewId = evt.data.id;
    this.viewStatus = evt.data.status;
    this.companyName = evt.data.companyName;
    this.ctc = evt.data.ctc;
    this.noticePeriod = evt.data.noticePeriod;
    this.openAnyModal("viewIntervieweeModal");
  }

  changeIntervieweeStatus(applyStatus : any){
    if(this.remark == ""){
      this.layoutComponent.openSnackBar("Please enter remark",2);
      return;
    }
    let sta = "";
    if(applyStatus == 1) sta = "Selected";
    else if(applyStatus == 2) sta = "Rejected";
    let isConfirm = confirm("Sure,You want to "+sta+" this.");
    if(isConfirm){
      this.inProgress = true;
      let jsonData = {
        intervieweeId : this.viewId,
        remark : this.remark,
        status : applyStatus
      }
      this.sharedService.updateDataByUpdateType(jsonData,"interviewee")
      .subscribe(
        (result)=>{
          if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
            this.inProgress = false;
            this.layoutComponent.openSnackBar(result.responseDesc,1);
            this.getIntervieweeList();
            this.closeAnyModal("viewIntervieweeModal");
          }
          else{
            this.inProgress = false;
            this.layoutComponent.openSnackBar(result.responseDesc,2)
          }
        },
        (error)=>{
          this.inProgress = false;
          this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("changeIntervieweeStatus"),0);
        }
      )
    }
  }

  changeListener(event: any, i): void {
    this.readThis(event.target, i);
  }

  cvFileName: any = "";
  cvStr : any = "";

  readThis(inputValue: any, optionNumber): void {
    var file: File = inputValue.files[0];
    let wrongFile = false;
    let fileName = file.name;
    if(!(fileName.indexOf(".docx") > -1 || fileName.indexOf(".doc") > -1 || 
    fileName.indexOf(".pdf") > -1)){
      this.layoutComponent.openSnackBar("only .docx, .doc, .pdf format accepted, please choose right file.",2);
      wrongFile = true;
    }
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      let image = myReader.result;
      if (optionNumber == 1) {
        this.cvFileName = fileName;
        this.cvStr = image;
        if(wrongFile){
          this.cvFileName = "";
          this.cvStr = "";
        }
      }
    }
    myReader.readAsDataURL(file);
  }

  makeAsDefault(){
    this.name = "";
    this.mobile = "";
    this.emailId = "";
    this.companyName = "";
    this.ctc = "";
    this.noticePeriod = "";
    this.cvStr = "";
  }

  openAnyModal(modalName){
    $("#"+modalName).modal({
      backdrop : 'static',
      keyboard : false
    });
  }

  closeAnyModal(modalName){
    this.makeAsDefault();
    $("#"+modalName).modal("hide");
  }

}

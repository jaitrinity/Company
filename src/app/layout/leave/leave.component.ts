import { Component, OnInit } from '@angular/core';
import { Constant } from 'src/app/services/Contant';
import { SharedService } from 'src/app/services/shared.service';
import { LeaveTableSettings } from 'src/app/tableSettings/LeaveTableSettings';
import { LayoutComponent } from '../layout.component';
declare var $: any;

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css']
})
export class LeaveComponent implements OnInit {
  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };
  inProgress : boolean = false;
  empId = "";
  fromDate = "";
  toDate = "";
  reason = "";
  button = "";
  empList = [];
  leaveList = [];
  leaveBalance = "";
  tableSettings = LeaveTableSettings.settings
  todayDate : Date;
  isAdmin : boolean = false;
  loginEmpId = "";
  loginEmpRoleId = "";
  constructor(private sharedService : SharedService,private layoutComponent : LayoutComponent) { 
    this.todayDate = new Date();
    this.layoutComponent.setTitle("Leave");
    this.button = localStorage.getItem("button");
    this.loginEmpId = localStorage.getItem("loginEmpId");
    this.loginEmpRoleId = localStorage.getItem("loginEmpRoleId");
    if(this.loginEmpRoleId == '1') this.isAdmin = true;
    else{
      this.empId = this.loginEmpId;
    }
  }

  ngOnInit(): void {
    this.getAllLeaves();
    this.getEmpForLeave();
  }

  getEmpForLeave(){
    let jsonData = {
      loginEmpId: this.loginEmpId,
      loginEmpRoleId: this.loginEmpRoleId
    }
    this.sharedService.getAllListBySelectType(jsonData,"leaveEmp")
    .subscribe(
      (result)=>{
        this.empList = result.empList;
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("getEmpForLeave"),0);
      }
    )
  }

  getAllLeaves(){
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRoleId : this.loginEmpRoleId
    }
    this.sharedService.getAllListBySelectType(jsonData,"leaves")
    .subscribe(
      (result)=>{
        this.leaveList = result.leaveList;
        this.leaveBalance = result.leaveBalance;
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("getAllLeaves"),0);
      }
    )
  }

  alertMsg = "";
  validateData() : any{
    if(this.empId == ""){
      this.alertMsg = "Please select employee";
      return false;
    }
    else if(this.fromDate == ""){
      this.alertMsg = "Please select From Date";
      return false;
    }
    else if(this.toDate == ""){
      this.alertMsg = "Please select To Date";
      return false;
    }
    else if(this.reason == ""){
      this.alertMsg = "Please enter Reason";
      return false;
    }
    return true;
  }

  submitLeave(){
    if(!this.validateData()){
      this.layoutComponent.openSnackBar(this.alertMsg,2);
      return ;
    }

    let objList = this.empList.filter(x => x.empId == this.empId);
    let jsonData = {
      empId : this.empId,
      empName : objList[0].name,
      fromDate : this.fromDate,
      toDate : this.toDate,
      reason : this.reason
    }
    // console.log(JSON.stringify(jsonData));
    this.inProgress = true;
    this.sharedService.insertDataByInsertType(jsonData,"saveLeave")
    .subscribe(
      (result)=>{
        if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.layoutComponent.openSnackBar(result.responseDesc,1);
          this.makeAsDefault();
          this.getAllLeaves();
        }
        else{
          this.layoutComponent.openSnackBar(result.responseDesc,2);
        }
        this.inProgress = false;
        
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("submitLeave"),0);
      }
    )
  }

  makeAsDefault(){
    this.empId = "";
    this.fromDate = "";
    this.toDate = "";
    this.reason = "";
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
        this.viewLeave(event);
        break;
    }
  }

  viewLeaveId = "";
  viewEmpId = "";
  viewFromDate = "";
  viewToDate = "";
  viewReason = "";
  viewLeaveStatus = "";
  viewActivityId = "";
  viewLeave(evt){
    this.viewLeaveId = evt.data.id;
    this.viewEmpId = evt.data.empId;
    this.viewFromDate = evt.data.fromDate;
    this.viewToDate = evt.data.toDate;
    this.viewReason = evt.data.reason;
    this.viewLeaveStatus = evt.data.status;
    this.viewActivityId = evt.data.activityId;
    this.openAnyModal("viewLeaveModal");
  }

  changeLeaveStatus(statusType : any){
    let st = "";
    if(statusType == 1){
      st = "Approve";
    }
    else{
      st = "Reject";
    }
    let isConfirm = confirm("Sure, You want to "+st+" this leave?");
    if(isConfirm){
      this.inProgress = true;
      let jsonData = {
        leaveId : this.viewLeaveId,
        status : statusType
      }
      // this.sharedService.updateDataByUpdateType(jsonData,"leaveStatus")
      this.sharedService.updateLeaveStatus(jsonData)
      .subscribe(
        (result)=>{
          if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
            this.layoutComponent.openSnackBar(result.responseDesc,1);
            this.getAllLeaves();
            this.closeAnyModal("viewLeaveModal");
          }
          else{
            this.layoutComponent.openSnackBar(result.responseDesc,2);
          }
          
          this.inProgress = false;
        },
        (error)=>{
          this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("changeLeaveStatus"),0);
        }
      )
    }
  }

  changeLeaveData(){
    let jsonData = {
      leaveId: this.viewLeaveId,
      empId: this.viewEmpId,
      fromDate: this.viewFromDate,
      toDate: this.viewToDate,
      reason: this.viewReason,
      activityId: this.viewActivityId
    }
    // console.log(JSON.stringify(jsonData));
    this.inProgress = true;
    this.sharedService.insertDataByInsertType(jsonData,"updateLeave")
    .subscribe(
      (result)=>{
        if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.layoutComponent.openSnackBar(result.responseDesc,1);
          this.closeAnyModal("viewLeaveModal");
          this.makeAsDefault();
          this.getAllLeaves();
        }
        else{
          this.layoutComponent.openSnackBar(result.responseDesc,2);
        }
        this.inProgress = false;
        
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("submitLeave"),0);
      }
    )
  }

  changeSelected(e){
    this.openAnyModal("leaveApplyModal")
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

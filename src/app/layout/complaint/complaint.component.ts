import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../layout.component';
import { SharedService } from 'src/app/services/shared.service';
import { ComplaintTableSettings } from 'src/app/tableSettings/ComplaintTableSettings';
import { Constant } from 'src/app/services/Contant';
import { CommonFunction } from 'src/app/services/CommonFunction';
declare var $: any;

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.css']
})
export class ComplaintComponent implements OnInit {
  inProgress = false;
  complaintList = [];
  tableSettings = ComplaintTableSettings.settings;
  isAdmin : boolean = false;
  button = "";
  loginEmpId = "";
  loginEmpRoleId = "";
  constructor(private sharedService : SharedService,private layoutComponent : LayoutComponent) {
    this.layoutComponent.setTitle("Complaint");
    this.button = localStorage.getItem("button");
    this.loginEmpId = localStorage.getItem("loginEmpId");
    this.loginEmpRoleId = localStorage.getItem("loginEmpRoleId");
    if(this.loginEmpRoleId == '1') this.isAdmin = true;
  }

  ngOnInit(): void {
    this.getAllComplaint();
  }

  getAllComplaint(){
    this.inProgress = true;
    this.complaintList = [];
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRoleId : this.loginEmpRoleId
    }
    this.sharedService.getAllListBySelectType(jsonData,"complaint")
    .subscribe(
      (result)=>{
        this.complaintList = result.complaintList;
        this.inProgress = false;
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("getAllComplaint"),0);
        this.inProgress = false;
      }
    )
  }

  exportData(){
    if(this.complaintList.length != 0 ){
      let columnKeyArr = ["id","empName","complaintType","raiseDate","closeDate","statusTxt"];
      let columnTitleArr = ["Id","Name","Complaint Type","Raise Date","Close Date","Status"];
      CommonFunction.downloadFile(this.complaintList,
        'Complaint_Report.csv', 
        columnKeyArr, 
        columnTitleArr)
    }
    else{
      alert("No data for export");
    }
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
          this.viewComplaint(event);
          break;
    }
  }

  viewId = "";
  viewStatus = "";
  description = "";
  closeDescription = "";
  picList: any = [];
  viewComplaint(evt){
    this.viewId = evt.data.id;
    this.viewStatus = evt.data.status;
    this.description = evt.data.description;
    this.closeDescription = evt.data.closeDescription;
    this.picList = evt.data.picList;
    this.openAnyModal("complaintModal");
  }

  changeComplaintStatus(statusType:any){
    if(this.closeDescription == ""){
      this.layoutComponent.openSnackBar("Enter `Close Description`",2);
      return;
    }
    let st = "";
    if(statusType == 1){
      st = "Close";
    }
    else{
      st = "In Progress";
    }
    let isConfirm = confirm("Sure, You want to "+st+" this complaint?");
    if(isConfirm){
      let jsonData = {
        id : this.viewId,
        closeDescription: this.closeDescription,
        status : statusType
      }
      this.sharedService.updateDataByUpdateType(jsonData,"complaintStatus")
      .subscribe(
        (result)=>{
          if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
            this.layoutComponent.openSnackBar(result.responseDesc,1);
            this.getAllComplaint();
            this.closeAnyModal("complaintModal");
          }
          else{
            this.layoutComponent.openSnackBar(result.responseDesc,2);
          }
        },
        (error)=>{
          this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("changeLeaveStatus"),0);
        }
      )
    }
  }

  bigImage(imgUrl:any){
    window.open(imgUrl);
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

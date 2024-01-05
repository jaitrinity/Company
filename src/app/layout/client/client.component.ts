import { Component, OnInit } from '@angular/core';
import { Constant } from 'src/app/services/Contant';
import { SharedService } from 'src/app/services/shared.service';
import { ClientTableSettings } from 'src/app/tableSettings/ClientTableSettings';
import { LayoutComponent } from '../layout.component';
declare var $: any;

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  corporateId = "";
  corporateNameList = [];
  clientName = "";
  contactPerson = "";
  addLine1 = "";
  addLine2 = "";
  state = "";
  gstNo = "";
  tableSettings = ClientTableSettings.settings;
  clientNameList = []
  loginEmpId = "";
  loginEmpRoleId = "";
  button = "";
  constructor(private sharedService : SharedService, private layoutComponent : LayoutComponent) { 
    this.layoutComponent.setTitle("Client");
    this.loginEmpId = localStorage.getItem("loginEmpId")
    this.loginEmpRoleId = localStorage.getItem("loginEmpRoleId");
    this.button = localStorage.getItem("button")
  }

  ngOnInit(): void {
    this.getCorporateAndClientList();
    this.allClient();
  }

  allClient(){
    let jsonData = {
      loginEmpId: this.loginEmpId,
      loginEmpRoleId: this.loginEmpRoleId
    }
    this.sharedService.getAllListBySelectType(jsonData, "client")
    .subscribe(
      (result)=>{
        this.clientNameList = result.clientNameList;
      },
      (error)=>{

      }
    )
  }

  getCorporateAndClientList(){
    let jsonData = {
      loginEmpId: this.loginEmpId,
      loginEmpRoleId: this.loginEmpRoleId
    }
    this.sharedService.getAllListBySelectType(jsonData,"corporateAndClient")
    .subscribe(
      (result)=>{
        this.corporateNameList = result.corporateNameList;
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("getCorporateAndClientList"),0);
      }
    )
  }

  alertMsg = "";
  validateData(): any{
    if(this.corporateId == ""){
      this.alertMsg = "Please select a corporate";
      return false;
    }
    else if(this.clientName == ""){
      this.alertMsg = "Please enter client name";
      return false;
    }
    else if(this.contactPerson == ""){
      this.alertMsg = "Please enter contact person";
      return false;
    }
    else if(this.addLine1 == ""){
      this.alertMsg = "Please enter address line 1";
      return false;
    }
    else if(this.addLine2 == ""){
      this.alertMsg = "Please enter address line 2";
      return false;
    }
    else if(this.gstNo == ""){
      this.alertMsg = "Please enter GST No";
      return false;
    }
    return true;
  }
  submitClientData(){
    if(!this.validateData()){
      this.layoutComponent.openSnackBar(this.alertMsg,2);
    }
    let jsonData = {
      corporateId : this.corporateId,
      clientName : this.clientName,
      contactPerson : this.contactPerson,
      addLine1 : this.addLine1,
      addLine2 : this.addLine2,
      state : this.state,
      gstNo : this.gstNo
    }
    this.sharedService.insertDataByInsertType(jsonData, "client")
    .subscribe(
      (result)=>{
        if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.layoutComponent.openSnackBar(result.responseDesc,1);
          this.makeAsDefault();
        }
        else{
          this.layoutComponent.openSnackBar(result.responseDesc,2);
        }
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("submitClientData"),0);
      }
    )
  }

  makeAsDefault(){
    this.corporateId = "";
    this.clientName = "";
    this.contactPerson = "";
    this.addLine1 = "";
    this.addLine2 = "";
    this.state = "";
    this.gstNo = "";
  }

  openAnyModal(modalId){
    $("#"+modalId).modal({
      backdrop : 'static',
      keyboard : false
    });
  }

  closeAnyModal(modalName){
    $("#"+modalName).modal("hide");
  }

}

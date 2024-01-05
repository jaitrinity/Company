import { Component, OnInit } from '@angular/core';
import { Constant } from 'src/app/services/Contant';
import { SharedService } from 'src/app/services/shared.service';
import { PoTableSettings } from 'src/app/tableSettings/PoTableSettings';
import { LayoutComponent } from '../layout.component';
declare var $: any;

@Component({
  selector: 'app-po',
  templateUrl: './po.component.html',
  styleUrls: ['./po.component.css']
})
export class PoComponent implements OnInit {

  clientId = "";
  poDate = "";
  clientNameList = [];
  tableSettings = PoTableSettings.settings;
  poList = [];
  loginEmpId = "";
  loginEmpRoleId = "";
  button = "";
  constructor(private sharedService : SharedService, private layoutComponent : LayoutComponent) { 
    this.layoutComponent.setTitle("PO");
    this.loginEmpId = localStorage.getItem("loginEmpId")
    this.loginEmpRoleId = localStorage.getItem("loginEmpRoleId");
    this.button = localStorage.getItem("button")
  }

  ngOnInit(): void {
    this.getAllPo();
    this.getCorporateAndClientList();
  }

  getAllPo(){
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRoleId: this.loginEmpRoleId
    }
    this.sharedService.getAllListBySelectType(jsonData,"POData")
    .subscribe(
      (result)=>{
        this.poList = result.poList;
      },
      (error)=>{

      }
    )
  }

  getCorporateAndClientList(){
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRoleId: this.loginEmpRoleId
    }
    this.sharedService.getAllListBySelectType(jsonData,"corporateAndClient")
    .subscribe(
      (result)=>{
        this.clientNameList = result.clientNameList;
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("getCorporateAndClientList"),0);
      }
    )
  }

  alertMsg = "";
  validateData() : any{
    if(this.clientId == ""){
      this.alertMsg = "Select a client";
      return false;
    }
    else if(this.poDate == ""){
      this.alertMsg = "Please select PO date";
      return false;
    }
    else if(this.poFileName == ""){
      this.alertMsg = "Please attach PO";
      return false;
    }
    return true;
  }
  submitPoData(){
    if(!this.validateData()){
      this.layoutComponent.openSnackBar(this.alertMsg,2)
      return;
    }
    let jsonData = {
      clientId : this.clientId,
      poDate: this.poDate,
      poStr : this.poStr,
    }
    this.sharedService.insertDataByInsertType(jsonData, "poUpload")
    .subscribe(
      (result)=>{
        if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.layoutComponent.openSnackBar(result.responseDesc,1);
          this.getAllPo();
          this.makeAsDefault();
          // this.morePo();
        }
        else{
          this.layoutComponent.openSnackBar(result.responseDesc,2);
        }
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("submitPoData"),0);
      }
    )
  }

  morePo(){
    let isConfirm = confirm("You want to upload more PO?");
    if(isConfirm){

    }
    else{
      this.closeAnyModal("poUploadModal");
    }
  }

  onCustomAction(event){
    switch ( event.action) {
        case 'viewPO':
          this.viewPO(event);
          break;
    }
  }

  viewPoId = "";
  viewPO(e){
    this.viewPoId = e.data.poId;
    let poAttachment = e.data.poAttachment;
    window.open(poAttachment);
  }

  makeAsDefault(){
    this.clientId = "";
    this.poDate = "";
    this.poFileName = "";
    this.poStr = "";
  }

  changeListener(event: any, i): void {
    this.readThis(event.target, i);
  }

  poFileName: any = "";
  poStr : any = "";

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
        this.poFileName = fileName;
        this.poStr = image;
        if(wrongFile){
          this.poFileName = "";
          this.poStr = "";
        }
      }
      // else if (optionNumber == 2) {
      //   this.aadharFileName = fileName;
      //   this.aadharStr = image;
      //   if(wrongFile){
      //     this.aadharFileName = "";
      //     this.aadharStr = "";
      //   }
      // }
    }
    myReader.readAsDataURL(file);
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

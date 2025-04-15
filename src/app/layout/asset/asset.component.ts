import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { LayoutComponent } from '../layout.component';
import { Constant } from 'src/app/services/Contant';
import { AssetTableSettings } from 'src/app/tableSettings/AssetTableSettings';
import { CommonFunction } from 'src/app/services/CommonFunction';
declare var $: any;

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.css']
})
export class AssetComponent implements OnInit {
  inProgress = false;
  inProgress1 = false;
  empId="";
  assetCategory="";
  deviceName="";
  serialNo="";
  dateOfIssue = "";
  remark = "";
  empList = [];
  assetCategoryList = ["Laptop","Mobile Phone","Mouse","Other"];
  assetList = [];
  tableSettings = AssetTableSettings.settings;
  isAdmin : boolean = false;
  button = "";
  loginEmpId = "";
  loginEmpRoleId = "";
  constructor(private sharedService : SharedService,private layoutComponent : LayoutComponent) { 
    this.layoutComponent.setTitle("Asset");
    this.button = localStorage.getItem("button");
    this.loginEmpId = localStorage.getItem("loginEmpId");
    this.loginEmpRoleId = localStorage.getItem("loginEmpRoleId");
    if(this.loginEmpRoleId == '1') this.isAdmin = true;
  }

  ngOnInit(): void {
    if(!this.isAdmin){
      this.empId = this.loginEmpId;
    }
    this.getAllEmpList();
    this.getAssetAllocation();
  }

  getAllEmpList(){
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

  getAssetAllocation(){
    this.inProgress = true;
    this.assetList = [];
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRoleId : this.loginEmpRoleId
    }
    this.sharedService.getAllListBySelectType(jsonData,"asset")
    .subscribe(
      (result)=>{
        this.assetList = result.assetList;
        this.inProgress = false;
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("getAssetAllocation"),0);
        this.inProgress = false;
      }
    )
  }

  changeListener(event: any, i): void {
    this.readThis(event.target, i);
  }

  @ViewChild('attFile') attFileVariable: ElementRef;
  attachmentName: any = "";
  attachmentStr : any = "";
  // aadharFileName: any = "";
  // aadharStr : any = "";

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
        this.attachmentName = fileName;
        this.attachmentStr = image;
        if(wrongFile){
          this.attachmentName = "";
          this.attachmentStr = "";
          this.attFileVariable.nativeElement.value = "";
        }
      }
      else if (optionNumber == 2) {
        // this.aadharFileName = fileName;
        // this.aadharStr = image;
        if(wrongFile){
          // this.aadharFileName = "";
          // this.aadharStr = "";
        }
      }
    }
    myReader.readAsDataURL(file);
  }


  alertMsg="";
  validateAsset():any{
    if(this.empId == ""){
      this.alertMsg = "Please select an employee";
      return false;
    }
    else if(this.assetCategory == ""){
      this.alertMsg = "Please select an asset category";
      return false;
    }
    else if(this.deviceName == ""){
      this.alertMsg = "Please enter device name";
      return false;
    }
    else if(this.serialNo == ""){
      this.alertMsg = "Please enter serial no";
      return false;
    }
    else if(this.dateOfIssue == ""){
      this.alertMsg = "Please select date of issue";
      return false;
    }
    else if(this.attachmentName == ""){
      this.alertMsg = "Please select an device configuration attachment";
      return false;
    }
    return true;
  }
  submitAsset(){
    if(!this.validateAsset()){
      this.layoutComponent.openSnackBar(this.alertMsg,2);
      return ;
    }
    let jsonData = {
      loginEmpId: this.loginEmpId,
      loginEmpRoleId: this.loginEmpRoleId,
      empId: this.empId,
      assetCategory: this.assetCategory,
      deviceName: this.deviceName,
      serialNo: this.serialNo,
      dateOfIssue: this.dateOfIssue,
      attachmentStr: this.attachmentStr,
      remark: this.remark
    }
    this.inProgress1 = true;
    this.sharedService.insertDataByInsertType(jsonData,"asset")
    .subscribe(
      (result)=>{
        if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.layoutComponent.openSnackBar(result.responseDesc,1);
          this.makeAsDefault();
          this.getAssetAllocation();
        }
        else{
          this.layoutComponent.openSnackBar(result.responseDesc,2);
        }
        this.inProgress1 = false;
        
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("submitAsset"),0);
      }
    )
  }

  makeAsDefault(){
    // this.empId="";
    this.assetCategory="";
    this.deviceName="";
    this.serialNo="";
    this.dateOfIssue="";
    this.attachmentName="";
    this.attachmentStr="";
    this.attFileVariable.nativeElement.value = "";
    this.remark="";
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
          this.viewAsset(event);
          break;
    }
  }

  viewAssetId = "";
  viewStatus = "";
  viewRemark = "";
  picList: any = [];
  viewAsset(evt){
    this.viewAssetId = evt.data.id;
    this.viewStatus = evt.data.status;
    this.viewRemark = evt.data.remark;
    this.picList = evt.data.picList;
    this.openAnyModal("assetModal");
  }

  changeAssetStatus(statusType:any){
    let st = "";
    if(statusType == 1){
      st = "Approve";
    }
    else{
      st = "Return";
    }
    let isConfirm = confirm("Sure, You want to "+st+" this asset?");
    if(isConfirm){
      let jsonData = {
        assetId : this.viewAssetId,
        status : statusType
      }
      this.sharedService.updateDataByUpdateType(jsonData,"assetStatus")
      .subscribe(
        (result)=>{
          if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
            this.layoutComponent.openSnackBar(result.responseDesc,1);
            this.getAssetAllocation();
            this.closeAnyModal("assetModal");
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

  exportData(){
    if(this.assetList.length != 0 ){
      let columnKeyArr = ["id","name","assetCategory","deviceName","serialNumber","issueDate","returnDate","statusTxt"];
      let columnTitleArr = ["Id","Name","Asset Category","Device Name","Serial Number","Issue Date","Return Date","Status"];
      CommonFunction.downloadFile(this.assetList,
        'Asset_Report.csv', 
        columnKeyArr, 
        columnTitleArr)
    }
    else{
      alert("No data for export");
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

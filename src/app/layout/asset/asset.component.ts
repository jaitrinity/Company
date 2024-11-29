import { Component, OnInit } from '@angular/core';
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
    this.getAssetAllocation();
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

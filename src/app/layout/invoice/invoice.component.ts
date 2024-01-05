import { Component, OnInit } from '@angular/core';
import { Constant } from 'src/app/services/Contant';
import { SharedService } from 'src/app/services/shared.service';
import { InvoiceTableSettings } from 'src/app/tableSettings/InvoiceTableSettings';
import { environment } from 'src/environments/environment';
import { LayoutComponent } from '../layout.component';
declare var $: any;

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  poNumber = "";
  corporateName = "";
  corporateNameList = [];
  clientName = "";
  allClientNameList = [];
  clientNameList = [];
  workDescription = "";
  quantity = "";
  unitPrice = "";
  tableSettings = InvoiceTableSettings.settings;
  invoiceList = [];
  loginEmpId = "";
  loginEmpRoleId = "";
  button = "";
  constructor(private sharedService : SharedService, private layoutComponent : LayoutComponent) { 
    this.layoutComponent.setTitle("Invoice");
    this.loginEmpId = localStorage.getItem("loginEmpId")
    this.loginEmpRoleId = localStorage.getItem("loginEmpRoleId");
    this.button = localStorage.getItem("button")
  }

  ngOnInit(): void {
    this.getAllInvoices();
    this.getCorporateAndClientList();
  }
  getAllInvoices(){
    let jsonData = {
      loginEmpId: this.loginEmpId,
      loginEmpRoleId: this.loginEmpRoleId
    }
    this.sharedService.getAllListBySelectType(jsonData,"invoices")
    .subscribe(
      (result)=>{
        this.invoiceList = result.invoiceList;
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("getAllInvoices"),0);
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
        this.allClientNameList = result.clientNameList;
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("getCorporateAndClientList"),0);
      }
    )
  }

  workList = []
  alertMsg = "";
  validateData() : any{
    if(this.poNumber == ""){
      this.alertMsg = "Please enter PO Number";
      return false;
    }
    else if(this.corporateName == ""){
      this.alertMsg = "Please select Corporate Name";
      return false;
    }
    else if(this.clientName == ""){
      this.alertMsg = "Please select Client Name";
      return false;
    }

    this.workList = [];
    for(let i=1;i<=this.addMoreList.length;i++){
      if($("#workDesciption_"+i).val() == ""){
        this.alertMsg = "Please enter "+i+" Work description";
        return false;
      }
      else if($("#quantity_"+i).val() == ""){
        this.alertMsg = "Please enter "+i+" Quantity";
        return false;
      }
      else if($("#unitPrice_"+i).val() == ""){
        this.alertMsg = "Please enter "+i+" Unit Price";
        return false;
      }
      else{
        let qua = $("#quantity_"+i).val();
        let uni = $("#unitPrice_"+i).val()
        let json = {
          workDescription : $("#workDesciption_"+i).val(),
          quantity : qua,
          unitPrice : uni,
          subTotal : qua*uni
        }
        this.workList.push(json);
      }
    }
    return true;
  }
  submitInvoice(){
    if(!this.validateData()){
      this.layoutComponent.openSnackBar(this.alertMsg,2);
      return;
    }
    let corpObj = this.corporateNameList.filter(x => x.id == this.corporateName)[0];
    let clientObj = this.clientNameList.filter(x => x.id == this.clientName)[0];
    let isStateEqual = corpObj.state == clientObj.state ? 1 : 0;
    let jsonData = {
      poNumber : this.poNumber,
      corporateName : this.corporateName,
      clientName : this.clientName,
      workList : this.workList,
      isStateEqual : isStateEqual
    }
    
    this.sharedService.insertDataByInsertType(jsonData,"submitInvoice")
    .subscribe(
      (result)=>{
        if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.layoutComponent.openSnackBar(result.responseDesc,1);
          let invoiceId = result.invoiceId;
          this.generateInvoice(invoiceId)
          this.getAllInvoices()
          this.makeAsDefault();
        }
        else{
          this.layoutComponent.openSnackBar(result.responseDesc,2);
        }
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("submitInvoice"),0);
      }
    )
  }

  generateInvoice(invId){
    let jsonData = {
      invoiceId : invId
    }
    this.sharedService.generateInvoice(jsonData)
    .subscribe(
      (result)=>{

      },
      (error)=>{
        //this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("generateInvoice"));
      }
    )
  }

  onCustomAction(event){
    switch ( event.action) {
        case 'viewRecord':
          this.viewInvoice(event);
          break;
    }
  }

  viewInvId = "";
  invStatus = "";
  viewInvoice(evt){
    this.viewInvId = evt.data.invoiceId;
    this.invStatus = evt.data.status;
    this.openAnyModal("viewInvoiceModal");
  }

  downloadInvoice(){
    let url = environment.appUrl+"viewInvoice.php?invoiceId="+this.viewInvId+"&invStatus="+this.invStatus;
    window.open(url);
  }

  changeListener(event: any, i): void {
    this.readThis(event.target, i);
  }

  invoiceFileName: any = "";
  invoiceStr : any = "";

  readThis(inputValue: any, optionNumber): void {
    var file: File = inputValue.files[0];
    let wrongFile = false;
    let fileName = file.name;
    if(!(fileName.indexOf(".pdf") > -1)){
      this.layoutComponent.openSnackBar("only .pdf format accepted, please choose right file.",2);
      wrongFile = true;
    }
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      let image = myReader.result;
      if (optionNumber == 1) {
        this.invoiceFileName = fileName;
        this.invoiceStr = image;
        if(wrongFile){
          this.invoiceFileName = "";
          this.invoiceStr = "";
        }
      }
    }
    myReader.readAsDataURL(file);
  }

  submitSignInvoice(){
    let jsonData = {
      invoiceId : this.viewInvId,
      invoiceStr : this.invoiceStr
    }
    this.sharedService.updateDataByUpdateType(jsonData,"updateInvoice")
    .subscribe(
      (result)=>{
        if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.layoutComponent.openSnackBar(result.responseDesc,1);
          this.closeAnyModal("viewInvoiceModal");
          this.makeAsDefault();
          this.getAllInvoices();
        }
        else{
          this.layoutComponent.openSnackBar(result.responseDesc,2);
        }
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("submitSignInvoice"),0);
      }
    )
  }
  addMoreList = [
    {
      class : 'col-md-6',
      label:'Work Description *',
      class1 : 'col-md-3',
      label1:'Quanlity *',
      class2 : 'col-md-3',
      label2:'Unit Price (Rs)*'
    }
  ]
  addRemoveDescription(actionType){
    if(actionType == 'add'){
      let addJson = 
      {
        class : 'col-md-6',
        label :'Work Description *',
        class1 : 'col-md-3',
        label1 :'Quanlity *',
        class2 : 'col-md-3',
        label2 :'Unit Price (Rs)*'
      }
      this.addMoreList.push(addJson);
    }
    else{
      this.addMoreList.pop();
    }
  }

  getClientName(){
    this.clientNameList = this.allClientNameList.filter(x => x.corporateId == this.corporateName);
  }

  makeAsDefault(){
    this.poNumber = "";
    this.corporateName = "";
    this.clientName = "";
    this.clientNameList = [];
    this.workDescription = "";
    this.quantity = "";
    this.unitPrice = "";
    this.invoiceFileName = "";
    this.invoiceStr = "";
    this.addMoreList = [
      {
        class : 'col-md-6',
        label:'Work Description *',
        class1 : 'col-md-3',
        label1:'Quanlity *',
        class2 : 'col-md-3',
        label2:'Unit Price (Rs)*'
      }
    ]
    this.workList = [];
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

import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Constant } from 'src/app/services/Contant';
import { SharedService } from 'src/app/services/shared.service';
import { EmployeeTableSetting } from 'src/app/tableSettings/EmployeeTableSettings';
import { environment } from 'src/environments/environment';
import { LayoutComponent } from '../layout.component';
import * as XLSX from 'xlsx';
declare var $: any;

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  inProgress : boolean = false;
  name = "";
  fatherHusbandName = "";
  mobile = "";
  emailId = "";
  dob = "";
  doj = "";
  leaveBalance = "";
  basic = "";
  hra = "";
  conveyanceAllowance = "";
  medicalAllowance = "";
  telephoneAllowance = "";
  specialAllowance = "";
  otherAllowance = "";
  employeeList = [];
  employeeTableSettings = EmployeeTableSetting.setting;
  month = "";
  dedMonth = "";
  monthList = [];
  paidDays = 0;
  retentionBonus = "";
  professionTax = "";
  lossOfPay = "";
  otherDeductions = "";
  incomeTax = "";
  otherTax = "";
  reimbursements = "";
  loginEmpId = "";
  loginEmpRoleId = "";
  button = "";
  constructor(private sharedService : SharedService, private layoutComponent : LayoutComponent,
    private datePipe : DatePipe) { 
    this.loginEmpId = localStorage.getItem("loginEmpId")
    this.loginEmpRoleId = localStorage.getItem("loginEmpRoleId");
    this.button = localStorage.getItem("button")
    this.layoutComponent.setTitle("Employee");
  }

  ngOnInit(): void {
    this.getEmployeeList();
    this.getMonthList();
    // let currentMonth = this.datePipe.transform(new Date(),'MMM');
    // let currentYear = this.datePipe.transform(new Date(),'yyyy');
    // let previousYear = parseInt(currentYear) - 1;
    // let nextYear = parseInt(currentYear) + 1;
    // if(currentMonth == 'Jan' || currentMonth == 'Feb' || currentMonth == 'Mar'){
    //   this.monthList = [
    //     "Apr-"+previousYear,"May-"+previousYear,"Jun-"+previousYear,"Jul-"+previousYear,
    //     "Aug-"+previousYear,"Sep-"+previousYear,"Oct-"+previousYear,"Nov-"+previousYear,
    //     "Dec-"+previousYear,"Jan-"+currentYear,"Feb-"+currentYear,"Mar-"+currentYear
    //   ]
    // }
    // else{
    //   this.monthList = [
    //     "Apr-"+currentYear,"May-"+currentYear,"Jun-"+currentYear,"Jul-"+currentYear,
    //     "Aug-"+currentYear,"Sep-"+currentYear,"Oct-"+currentYear,"Nov-"+currentYear,
    //     "Dec-"+currentYear,"Jan-"+nextYear,"Feb-"+nextYear,"Mar-"+nextYear
    //   ]
    // }
  }

  getMonthList(){
    for (var i = 0; i < 12; i++) {
      var d = new Date();
      d.setMonth(d.getMonth() - i);
      var month = d.toLocaleString("default", { month: "short" });
      var year = d.getFullYear();
      this.monthList.push(month+"-"+year);
    }
  }

  getMonthNumber(monthName : string) : number{
    let monthNumber = 0;
    switch (monthName) {
      case "Jan":
        monthNumber = 1;
        break;
      case "Feb":
        monthNumber = 2;
        break;
      case "Mar":
        monthNumber = 3;
        break;
      case "Apr":
        monthNumber = 4;
        break;
      case "May":
        monthNumber = 5;
        break;
      case "Jun":
        monthNumber = 6;
        break;
      case "Jul":
        monthNumber = 7;
        break;
      case "Aug":
        monthNumber = 8;
        break;
      case "Sep":
        monthNumber = 9;
        break;
      case "Oct":
        monthNumber = 10;
        break;
      case "Nov":
        monthNumber = 11;
        break;
      case "Dec":
        monthNumber = 12;
        break;
      default:
        break;
    }
    return monthNumber;
  }

  getEmployeeList(){
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRoleId : this.loginEmpRoleId
    }
    this.sharedService.getAllListBySelectType(jsonData,"employee")
    .subscribe(
      (result)=>{
        this.employeeList = result.employeeList;
        this.dedMonth = result.lastMonthYear;
        this.month = result.lastMonthYear;
        this.getPaidDays();
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("getEmployeeList"),0);
      }
    )

  }
  onCustomAction(event){
    switch ( event.action) {
        case 'editRecord':
          this.editEmployee(event);
          break;
      //  case 'deactiverecord':
      //     this.actionOnEmployee(event,0);
      //     break;
        case 'viewRecord':
          this.viewEmployee(event);
          break;
    }
  }

  editEmployee(event){
    let editId = event.data.id;
    let editEmpObj = this.employeeList.filter(x => x.id === editId)[0];
    this.viewEmpId = editEmpObj.empId;
    this.name = editEmpObj.empName;
    this.fatherHusbandName = editEmpObj.fatherHusbandName;
    this.mobile = editEmpObj.mobile;
    this.emailId = editEmpObj.emailId;
    this.dob = editEmpObj.dob;
    this.doj = editEmpObj.doj;
    this.leaveBalance = editEmpObj.leaveBalance;
    this.basic = editEmpObj.basic;
    this.hra = editEmpObj.hra;
    this.conveyanceAllowance = editEmpObj.conveyanceAllowance;
    this.medicalAllowance = editEmpObj.medicalAllowance;
    this.telephoneAllowance = editEmpObj.telephoneAllowance;
    this.specialAllowance = editEmpObj.specialAllowance;
    this.otherAllowance = editEmpObj.otherAllowance;
    this.openAnyModal("editEmployeeModal");
  }

  saveRegData(){
    this.hra = this.hra == "" ? "0" : this.hra;
    this.conveyanceAllowance = this.conveyanceAllowance == "" ? "0" : this.conveyanceAllowance;
    this.medicalAllowance = this.medicalAllowance == "" ? "0" : this.medicalAllowance;
    this.telephoneAllowance = this.telephoneAllowance == "" ? "0" : this.telephoneAllowance;
    this.specialAllowance = this.specialAllowance == "" ? "0" : this.specialAllowance;
    this.otherAllowance = this.otherAllowance == "" ? "0" : this.otherAllowance;

    let jsonData = {
      viewEmpId : this.viewEmpId,
      name : this.name,
      fatherHusbandName : this.fatherHusbandName,
      mobile : this.mobile,
      emailId : this.emailId,
      dob : this.dob,
      doj : this.doj,
      leaveBalance : this.leaveBalance,
      basic : this.basic,
      hra : this.hra,
      conveyanceAllowance : this.conveyanceAllowance,
      medicalAllowance : this.medicalAllowance,
      telephoneAllowance : this.telephoneAllowance,
      specialAllowance : this.specialAllowance,
      otherAllowance : this.otherAllowance
    }
    this.sharedService.updateDataByUpdateType(jsonData,"updateEmployee")
    .subscribe(
      (result)=>{
        if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.layoutComponent.openSnackBar(result.responseDesc,1);
          this.closeAnyModal("editEmployeeModal");
          this.getEmployeeList();
        }
        else{
          this.layoutComponent.openSnackBar(result.responseDesc,2);
        }
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("saveRegData"),0);
      }
    )
  }
  actionOnEmp(ee){
    let ac = 1;
    let a = "Active";
    if(ee.isActive == 1){
      a = "Deactive";
      ac = 0;
    }
    let isConfirm = confirm("Do you want "+a+"?");
    if(isConfirm){
      let jsonData = {
        id : ee.id,
        actionType : ac
      }

      this.sharedService.updateDataByUpdateType(jsonData,"actionOnEmp")
      .subscribe(
        (result)=>{
          if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
            this.layoutComponent.openSnackBar(result.responseDesc,1);
            this.getEmployeeList();
          }
          else{
            this.layoutComponent.openSnackBar(result.responseDesc,2);
          }
        },
        (error)=>{
          this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("actionOnEmp"),0);
        }
      )
    }
  }

  viewId = "";
  viewEmpId = "";
  viewEmpName = "";
  viewEmpEmailId = "";
  viewMobile = "";
  employeeObj : any = {}
  viewEmployee(event){
    this.viewId = event.data.id;
    this.employeeObj = this.employeeList.filter(x => x.id === this.viewId)[0];
    this.viewEmpId = this.employeeObj.empId;
    this.viewEmpName = this.employeeObj.empName;
    this.viewEmpEmailId = this.employeeObj.emailId;
    this.viewMobile = this.employeeObj.mobile;
    // this.month = this.employeeObj.lastMonthYear;
    this.month = this.dedMonth;
    this.getDeduction();
    this.openAnyModal("viewEmployeeModal");
  }

  alertMsg = "";
  validateDeductionData() : any{
    if(this.month == ""){
      this.alertMsg = "Please select Month";
      return false;
    }
    // else if(this.paidDays == 0){
    //   this.alertMsg = "Please enter Paid Days"; 
    //   return false;
    // }
    // else if(this.retentionBonus == ""){
    //   this.alertMsg = "Please enter Retention Bonus";
    //   return false;
    // }
    // else if(this.professionTax == ""){
    //   this.alertMsg = "Please enter Profession Tax";
    //   return false;
    // }
    // else if(this.lossOfPay == ""){
    //   this.alertMsg = "Please enter Loss of Pay(Leave)";
    //   return false;
    // }
    if(this.otherDeductions == ""){
      this.alertMsg = "Please enter TDS";
      return false;
    }
    // else if(this.incomeTax == ""){
    //   this.alertMsg = "Please enter Income Tax";
    //   return false;
    // }
    // else if(this.otherTax == ""){
    //   this.alertMsg = "Please enter Other Tax";
    //   return false;
    // }
    // else if(this.reimbursements == ""){
    //   this.alertMsg = "Please enter Reimbursements";
    //   return false;
    // }
    return true;
  }

  submitDeductionData(){
    if(!this.validateDeductionData()){
      this.layoutComponent.openSnackBar(this.alertMsg,2);
      return;
    }
    this.retentionBonus = this.retentionBonus == "" ? "0" : this.retentionBonus;
    this.professionTax = this.professionTax == "" ? "0" : this.professionTax;
    this.lossOfPay = this.lossOfPay == "" ? "0" : this.lossOfPay;
    this.otherDeductions = this.otherDeductions == "" ? "0" : this.otherDeductions;
    this.incomeTax = this.incomeTax == "" ? "0" : this.incomeTax;
    this.otherTax = this.otherTax == "" ? "0" : this.otherTax;
    this.reimbursements = this.reimbursements == "" ? "0" : this.reimbursements;
    let jsonData = {
      empId : this.viewEmpId,
      basic : this.employeeObj.basic,
      grossSalary : this.employeeObj.grossSalary,
      month : this.month,
      paidDays : this.paidDays,
      retentionBonus : this.retentionBonus,
      professionTax : this.professionTax,
      lossOfPay : this.lossOfPay,
      otherDeductions : this.otherDeductions,
      incomeTax : this.incomeTax,
      otherTax : this.otherTax,
      reimbursements : this.reimbursements
    }
    this.sharedService.insertDataByInsertType(jsonData,"deduction")
    .subscribe(
      (result) => {
        if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.layoutComponent.openSnackBar(result.responseDesc,1);
          // this.sendSalarySlipToMail();
          this.makeAsDefault();
          this.closeAnyModal("viewEmployeeModal");
          this.getEmployeeList();
        }
        else{
          this.layoutComponent.openSnackBar(result.responseDesc,2);
        }
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("submitDeductionData"),0);
      }
    )
  }

  resendSalarySlipToMail(){
    let salarySlipName = this.deductionObj.salarySlipName;
    let jsonData = {
      empId: this.viewEmpId,
      name: this.viewEmpName,
      emailId: this.viewEmpEmailId,
      monthYear: this.month,
      salarySlipName: salarySlipName
    }
    this.sharedService.resendSalarySlipToMail(jsonData)
    .subscribe(
      (result)=>{
        if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.layoutComponent.openSnackBar(result.responseDesc,1);
        }
        else{
          this.layoutComponent.openSnackBar(result.responseDesc,2);
        }
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("resendSalarySlipToMail"),0);
      }
    )
  }

  // sendSalarySlipToMail(){
  //   let jsonData = {
  //     empId: this.viewEmpId,
  //     monthYear: this.month
  //   }
  //   this.sharedService.sendSalarySlipToMail(jsonData)
  //   .subscribe(
  //     (result)=>{
  //       if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
  //         this.layoutComponent.openSnackBar(result.responseDesc,1);
  //       }
  //       else{
  //         this.layoutComponent.openSnackBar(result.responseDesc,2);
  //       }
  //     },
  //     (error)=>{
  //       this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("sendSalarySlipToMail"),0);
  //     }
  //   )
  // }

  makeAsDefault(){
    this.employeeObj = {}
    this.deductionObj = {};
    this.month = "";
    this.paidDays = 0;
    this.retentionBonus = "";
    this.professionTax = "";
    this.lossOfPay = "";
    this.otherDeductions = "";
    this.incomeTax = "";
    this.otherTax = "";
    this.reimbursements = "";
    this.uploadFileName = "";
    this.uploadFileVariable.nativeElement.value = "";
    this.previewDedunctionList = [];
  }

  downloadSalarySlip(){
    let salarySlipName = this.deductionObj.salarySlipName;
    let url = environment.appUrl+"files/SalarySlip_"+this.month+"/"+salarySlipName+".pdf";
    window.open(url);

  }

  deductionObj : any = {};
  getDeduction(){
    this.deductionObj = {};
    let monthName = this.month.split("-")[0];
    let monthNumber = this.getMonthNumber(monthName);
    let year = parseInt(this.month.split("-")[1]);
    let daysInMonth = new Date(year, monthNumber, 0).getDate();
    this.paidDays = daysInMonth;

    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRoleId: this.loginEmpRoleId,
      empId : this.viewEmpId,
      month : this.month
    }
    this.sharedService.getAllListBySelectType(jsonData,"deduction")
    .subscribe(
      (result)=>{
        if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.deductionObj = result.deductionList[0];
          this.otherDeductions = this.deductionObj.otherDeductions;
          this.lossOfPay = this.deductionObj.lossOfPay;
          this.reimbursements = this.deductionObj.reimbursements;
          this.retentionBonus = this.deductionObj.retentionBonus;
          this.professionTax = this.deductionObj.professionTax;
          this.incomeTax = this.deductionObj.incomeTax;
          this.otherTax = this.deductionObj.otherTax;
        }
        else{
          this.deductionObj = {};
          this.otherDeductions = '';
          this.lossOfPay = '';
          this.reimbursements = '';
          this.retentionBonus = '';
          this.professionTax = '';
          this.incomeTax = '';
          this.otherTax = '';
        }
        
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("getDeduction"),0);
      }
    )
  }

  downloadReport(reportType : any){
    let jsonData = {
      loginEmpId : this.loginEmpId,
      reportType : reportType
    }
    let url = environment.appUrl+"downloadReport.php?jsonData="+JSON.stringify(jsonData);
    window.open(url);
  }

  getPaidDays(){
    let monthName = this.dedMonth.split("-")[0];
    let monthNumber = this.getMonthNumber(monthName);
    let year = parseInt(this.dedMonth.split("-")[1]);
    let daysInMonth = new Date(year, monthNumber, 0).getDate();
    this.paidDays = daysInMonth;
    this.previewData()
  }

  @ViewChild('uploadFile') uploadFileVariable: ElementRef;
  uploadFileName = "";
  arrayBuffer:any;
  importData = [];
  addfile(event)     
  {    
    let file = event.target.files[0];
    this.uploadFileName = file.name;     
    let fileReader = new FileReader();    
    fileReader.readAsArrayBuffer(file);     
    fileReader.onload = (e) => {    
        this.arrayBuffer = fileReader.result;    
        var data = new Uint8Array(this.arrayBuffer);    
        var arr = new Array();    
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);    
        var bstr = arr.join("");    
        var workbook = XLSX.read(bstr, {type:"binary"});    
        var first_sheet_name = workbook.SheetNames[0];    
        var worksheet = workbook.Sheets[first_sheet_name];
        this.importData = XLSX.utils.sheet_to_json(worksheet,{raw:false,dateNF: "yyyy-MM-dd"});

        // this.previewData();
        this.getPaidDays();
    }    
  } 

  previewDedunctionList = [];
  previewData(){
    this.previewDedunctionList = [];
    for(let i=0;i<this.importData.length;i++){
      let empId = this.importData[i].EmpId;
      let localObj = this.employeeList.filter(x => x.empId === empId)[0];
      let json = {
        loginEmpId : this.loginEmpId,
        basic : localObj.basic,
        grossSalary : localObj.grossSalary,
        month : this.dedMonth,
        paidDays : this.paidDays,
        empId : this.importData[i].EmpId,
        name : this.importData[i].Name,
        tds : this.importData[i].TDS == null ? 0 : this.importData[i].TDS,
        lossOfPay : this.importData[i].LossOfPay == null ? 0 : this.importData[i].LossOfPay,
        reimbursements : this.importData[i].Reimbursements == null ? 0 : this.importData[i].Reimbursements,
        retentionBonus : this.importData[i].RetentionBonus == null ? 0 : this.importData[i].RetentionBonus,
        professionTax : this.importData[i].ProfessionTax == null ? 0 : this.importData[i].ProfessionTax,
        incomeTax : this.importData[i].IncomeTax == null ? 0 : this.importData[i].IncomeTax,
        otherTax : this.importData[i].OtherTax == null ? 0 : this.importData[i].OtherTax
      }
      this.previewDedunctionList.push(json);
    }
  }

  uploadDeduction(){
    if(this.dedMonth == ""){
      this.layoutComponent.openSnackBar("Please select month",0);
      return;
    }
    else if(this.previewDedunctionList.length == 0){
      this.layoutComponent.openSnackBar("Please select a file",0);
      return;
    }

    this.inProgress = true;
    let uploadDedunctionList = this.previewDedunctionList;
    this.sharedService.insertDataByInsertType(uploadDedunctionList,"uploadDeduction")
    .subscribe(
      (result)=>{
        if(result.responseCode == Constant.SUCCESSFUL_STATUS_CODE){
          this.layoutComponent.openSnackBar(result.responseDesc,1);
          this.previewDedunctionList = [];
          this.uploadFileName = "";
          this.uploadFileVariable.nativeElement.value = "";
        }
        else{
          this.layoutComponent.openSnackBar(result.responseDesc,2);
        }
        this.inProgress = false;
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("uploadDeduction"),0);
        this.inProgress = false;
      }
    )
  }

  changeSelected(e){
    this.openAnyModal("deductionModal");
  }

  openAnyModal(modalId){
    $("#"+modalId).modal({
      backdrop : 'static',
      keyboard : false
    });
  }

  closeAnyModal(modalName){
    this.makeAsDefault();
    $("#"+modalName).modal("hide");
  }

}

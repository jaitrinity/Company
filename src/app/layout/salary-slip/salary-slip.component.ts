import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { SlipTableSettings } from 'src/app/tableSettings/SlipTableSettings';
import { LayoutComponent } from '../layout.component';
import { Constant } from 'src/app/services/Contant';
import { environment } from 'src/environments/environment';
import { CommonFunction } from 'src/app/services/CommonFunction';

@Component({
  selector: 'app-salary-slip',
  templateUrl: './salary-slip.component.html',
  styleUrls: ['./salary-slip.component.css']
})
export class SalarySlipComponent implements OnInit {
  inProgress = false;
  slipList:any = [];
  tableSettings = SlipTableSettings.settings;
  isAdmin : boolean = false;
  button = "";
  loginEmpId = "";
  loginEmpRoleId = "";

  constructor(private sharedService : SharedService,private layoutComponent : LayoutComponent) {
    this.layoutComponent.setTitle("Salary Slip");
    this.button = localStorage.getItem("button");
    this.loginEmpId = localStorage.getItem("loginEmpId");
    this.loginEmpRoleId = localStorage.getItem("loginEmpRoleId");
  }

  ngOnInit(): void {
    this.getSlipList();
  }

  getSlipList(){
    this.inProgress = true;
    this.slipList = [];
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRoleId : this.loginEmpRoleId
    }
    this.sharedService.getAllListBySelectType(jsonData,"salarySlip")
    .subscribe(
      (result)=>{
        this.slipList = result.salarySlipList;
        this.inProgress = false;
      },
      (error)=>{
        this.layoutComponent.openSnackBar(Constant.returnServerErrorMessage("getSlipList"),0);
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
          this.viewSlip(event);
          break;
    }
  }

  viewSlip(evt){
    let monthYear = evt.data.monthYear;
    let salarySlipName = evt.data.salarySlipName;
    // let url = environment.appUrl+"files/SalarySlip_"+monthYear+"/"+salarySlipName+".pdf";
    let url = environment.appUrl+"downloadAnyPdf.php?monthYear="+monthYear+"&pdfFileName="+salarySlipName;
    window.open(url);
  }

  exportData(){
      if(this.slipList.length != 0 ){
        let columnKeyArr = ["name","basic","monthYear","paidDays","lossOfPay","tds","reimbursements","netSalary"];
        let columnTitleArr = ["Name","Basic","Month Year","Paid Days","Loss Of Pay","TDS","Reimbursements","Net Salary"];
        CommonFunction.downloadFile(this.slipList,
          'Salary_Data.csv', 
          columnKeyArr, 
          columnTitleArr)
      }
      else{
        alert("No data for export");
      }
    }

}

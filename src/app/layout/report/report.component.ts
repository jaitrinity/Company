import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LayoutComponent } from '../layout.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  filterStartDate = "";
  filterEndDate = "";

  loginEmpId = "";
  loginEmpRoleId = "";
  button = "";
  constructor(private layoutComponent : LayoutComponent) { 
    this.loginEmpId = localStorage.getItem("loginEmpId")
    this.loginEmpRoleId = localStorage.getItem("loginEmpRoleId");
    this.button = localStorage.getItem("button")
    this.layoutComponent.setTitle("Report");
  }

  ngOnInit(): void {
  }

  downloadReport(reportType : any){
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRoleId: this.loginEmpRoleId,
      fromDate: this.filterStartDate,
      toDate: this.filterEndDate,
      reportType : reportType
    }
    let url = environment.appUrl+"downloadReport.php?jsonData="+JSON.stringify(jsonData);
    window.open(url);
  }

}

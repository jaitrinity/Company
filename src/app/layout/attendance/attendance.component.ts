import { Component, OnInit } from '@angular/core';
import { CommonFunction } from 'src/app/services/CommonFunction';
import { Constant } from 'src/app/services/Contant';
import { SharedService } from 'src/app/services/shared.service';
import { AttendanceTableSetting } from 'src/app/tableSettings/AttendanceTableSetting';
import { LayoutComponent } from '../layout.component';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  inProgress = false;
  filterStartDate = "";
  filterEndDate = "";
  attandanceList = [];
  attendanceTableSettings = AttendanceTableSetting.setting;
  loginEmpId = "";
  loginEmpRole = "";
  loginEmpRoleId = "";
  button = "";

  constructor(private sharedService : SharedService, private layoutComponent : LayoutComponent) {
      this.loginEmpId = localStorage.getItem("loginEmpId");
      this.loginEmpRole = localStorage.getItem("loginEmpRole");
      this.loginEmpRoleId = localStorage.getItem("loginEmpRoleId");
      this.button = localStorage.getItem("button");
      this.layoutComponent.setTitle("Attendance");
  }

  ngOnInit(): void {
    this.getAttendanceList();
  }

  getAttendanceList(){
    this.inProgress = true;
    this.attandanceList = [];
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRoleId : this.loginEmpRoleId,
      filterStartDate : this.filterStartDate,
      filterEndDate : this.filterEndDate
    }
    this.sharedService.getAllListBySelectType(jsonData,'attendance')
    .subscribe((response) =>{
      //console.log(response);
      this.attandanceList = response.attendanceList;
      this.inProgress = false;
    },
    (error)=>{
      alert(Constant.returnServerErrorMessage("getAttendanceList"));
    });
  }

  exportData(){
    if(this.attandanceList.length != 0 ){
      let columnKeyArr = ["name","attendanceDate","inDateTime","outDateTime","workingHours"];
      let columnTitleArr = ["Name","Date","In Date Time","Out Date Time","Working Hours"];
      CommonFunction.downloadFile(this.attandanceList,
        'Attendance_Report.csv', 
        columnKeyArr, 
        columnTitleArr)
    }
    else{
      alert("No data for export");
    }
  }

}

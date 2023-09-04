import { DatePipe } from "@angular/common";
import { ActiveComponent } from "../layout/employee/active.component";

export class EmployeeTableSetting{
    public static setting = {
        mode: 'external',
        hideSubHeader: false,
        actions: {
          position: 'right',
          add: false,
          edit : false,
          delete : false,
          custom: [
            { name: 'editRecord', title: 'Edit' },
            { name: 'viewRecord', title: 'View'},
            // { name: 'activerecord', title: 'Activate' },
            // { name: 'deactiverecord', title: 'Deactivate' },
          ],
        },
        pager :{
          perPage : 10
        },
        columns: {
          empName: {
            title: 'Emp name'
          },
          // roleName : {
          //   title : "Role"
          // },
          mobile: {
            title: 'Mobile'
          },
          emailId: {
            title: 'Email Id'
          },
          dob: {
            title: 'DOB',
            valuePrepareFunction : (value)=>{
              return new DatePipe('en-EN').transform(value, 'dd-MM-yyyy');
            }
          },
          doj: {
            title: 'DOJ',
            valuePrepareFunction : (value)=>{
              return new DatePipe('en-EN').transform(value, 'dd-MM-yyyy');
            }
          },
          aadharNumber : {
            title: 'Aadhar Number',
            type: 'html',
            valuePrepareFunction: (cell, row) =>{
              return "<a href='"+row.aadharAttachment+"' target='_blank'>"+row.aadharNumber+"</a>";
            }
          },
          
          pan: {
            title: 'PAN',
            type: 'html',
            valuePrepareFunction: (cell, row) =>{
              return "<a href='"+row.panAttachment+"' target='_blank'>"+row.pan+"</a>";
            }
          },
          
          // basic : {
          //   title: 'Basic',
          // },
          // hra : {
          //   title : "HRA"
          // },
          // conveyanceAllowance : {
          //   title : "Conveyance Allowance"
          // },
          // medicalAllowance : {
          //   title : "Medical Allowance"
          // },
          // telephoneAllowance : {
          //   title : "Telephone Allowance"
          // },
          // specialAllowance : {
          //   title : "Special Allowance"
          // },
          // otherAllowance : {
          //   title : "Other Allowance"
          // }
          salaryStatus:{
            title : "Salary Status"
          },
          activeStatus:{
            title : "Active Status"
          },
          isActive:{
            title: 'Status',
            type: 'custom',
            filter: false,
            renderComponent: ActiveComponent,
            onComponentInitFunction(instance) {
              instance.save.subscribe(row => row);
            }
          }
        }
    }
}
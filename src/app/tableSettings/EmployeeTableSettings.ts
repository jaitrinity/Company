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
            { name: 'editRecord', title: '<i class="fas fa-pencil" title="Edit"></i>' },
            { name: 'viewRecord', title: '<i class="fas fa-eye" title="View"></i>'},
            // { name: 'activerecord', title: 'Activate' },
            // { name: 'deactiverecord', title: 'Deactivate' },
          ],
        },
        pager :{
          perPage : 10
        },
        columns: {
          empName: {
            title: 'Emp name',
            width:'120px'
          },
          // roleName : {
          //   title : "Role"
          // },
          mobile: {
            title: 'Mobile',
            width:'100px'
          },
          emailId: {
            title: 'Email Id',
            width:'120px'
          },
          dob: {
            title: 'DOB',
            width:'100px',
            valuePrepareFunction : (value)=>{
              return new DatePipe('en-EN').transform(value, 'dd-MM-yyyy');
            }
          },
          doj: {
            title: 'DOJ',
            width:'100px',
            valuePrepareFunction : (value)=>{
              return new DatePipe('en-EN').transform(value, 'dd-MM-yyyy');
            }
          },
          aadharNumber : {
            title: 'Aadhar Number',
            type: 'html',
            width:'120px',
            valuePrepareFunction: (cell, row) =>{
              return "<a href='"+row.aadharAttachment+"' target='_blank'>"+row.aadharNumber+"</a>";
            }
          },
          
          pan: {
            title: 'PAN',
            type: 'html',
            width:'120px',
            valuePrepareFunction: (cell, row) =>{
              return "<a href='"+row.panAttachment+"' target='_blank'>"+row.pan+"</a>";
            }
          },
          rmName: {
            title: 'RM Name'
          },
          leaveBalance:{
            title: 'Leave Bal',
            width:'70px',
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
          // salaryStatus:{
          //   title : "Salary Status"
          // },
          // activeStatus:{
          //   title : "Active Status",
          //   width:'100px'
          // },
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
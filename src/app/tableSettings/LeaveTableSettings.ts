import { DatePipe } from "@angular/common";

export class LeaveTableSettings{
    public static settings = {
        mode: 'external',
        hideSubHeader: false,
        actions: {
          position: 'right',
          add: false,
          edit : false,
          delete : false,
          custom: [
            { name: 'viewRecord', title: 'View'},
            // { name: 'activerecord', title: 'Activate' },
            // { name: 'deactiverecord', title: 'Deactivate' },
          ],
        },
        pager :{
          perPage : 10
        },
        columns: {
        id :{
            title : "Leave Id",
            width : '70px'
        },
          name: {
            title: 'Emp name'
          },
          fromDate : {
            title : "From Date",
            width : '100px',
            valuePrepareFunction : (value)=>{
              return new DatePipe('en-EN').transform(value, 'dd-MM-yyyy');
            }
          },
          toDate: {
            title: 'To Date',
            width : '100px',
            valuePrepareFunction : (value)=>{
              return new DatePipe('en-EN').transform(value, 'dd-MM-yyyy');
            }
          },
        //   reason: {
        //     title: 'Reason'
        //   },
          leaveStatus: {
            title: 'Status',
            width : '100px'
          }
        }
    }
}
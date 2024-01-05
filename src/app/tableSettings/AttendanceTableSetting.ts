export class AttendanceTableSetting{
    public static setting = {
        mode: 'external',
        hideSubHeader: false,
        actions: {
          position: 'right',
          add: false,
          edit : false,
          delete : false,
        },
        pager :{
          perPage : 10
        },
        columns: {
          name: {
            title: 'Name',
            width : '150px'
          },
          attendanceDate: {
            title: 'Date',
          },
          inDateTime: {
            title: 'In Date Time',
            type: 'html',
            valuePrepareFunction : (cell, row) =>{
              return `<a href="https://www.google.co.in/maps/search/${row.inLatlong}" target='blank'>${row.inDateTime}</a>`;
            }
          },
          outDateTime: {
            title: 'Out Date Time',
            type: 'html',
            valuePrepareFunction : (cell, row) =>{
              return `<a href="https://www.google.co.in/maps/search/${row.outLatlong}" target='blank'>${row.outDateTime}</a>`;
            }
          },
          workingHours: {
            title: 'Working Hours',
          }
        }
    }
}
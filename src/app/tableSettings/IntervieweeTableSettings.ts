export class IntervieweeTableSetting{
    public static setting = {
        mode: 'external',
        hideSubHeader: false,
        actions: {
          position: 'right',
          add: false,
          edit : false,
          delete : false,
          custom: [
            { name: 'viewRecord', title: '<i class="fas fa-eye" title="View"></i>'},
            // { name: 'activerecord', title: 'Activate' },
            // { name: 'deactiverecord', title: 'Deactivate' },
          ],
        },
        pager :{
          perPage : 10
        },
        columns: {
          name: {
            title: 'Emp name'
          },
          mobile: {
            title: 'Mobile'
          },
          emailId: {
            title: 'EmailId'
          },
          statusType : {
            title : 'Status'
          },
          cvURL : {
            title : 'CV',
            type: 'html',
            width: '100px',
            valuePrepareFunction: (value) =>{
              if(value == '')
              return '';
              else
              return "<a href='"+value+"' target='_blank'>View CV</a>";
            }
          }
          
        }
    }
}
export class ComplaintTableSettings {
    public static settings = 
        {
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
            id: {
                title: 'Id',
                width : '100px'
            },
            empName : {
                title : "Name"
            },
            complaintType: {
                title: 'Complaint Type'
            },
            raiseDate: {
                title: 'Raise Date'
            },
            closeDate: {
                title: 'Close Date',
            },
            statusTxt: {
                title: 'Status',
            }
        }
    }
}
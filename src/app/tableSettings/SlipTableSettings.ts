export class SlipTableSettings {
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
                { name: 'viewRecord', title: '<i class="fas fa-download" title="Download Slip"></i>'},
                // { name: 'activerecord', title: 'Activate' },
                // { name: 'deactiverecord', title: 'Deactivate' },
              ],
            },
            pager :{
              perPage : 10
            },
            columns: {
            // id: {
            //     title: 'Id',
            //     width : '100px'
            // },
            name : {
                title : "Name"
            },
            // basic: {
            //     title: 'Basic',
            //     width : '100px'
            // },
            monthYear: {
                title: 'Month Year',
                width : '100px'
            },
            paidDays: {
                title: 'Paid Days',
                width : '100px'
            },
            // lossOfPay: {
            //     title: 'Loss Of Pay',
            //     width : '100px'
            // },
            // tds:{
            //     title: 'TDS',
            //     width : '100px'
            // },
            // reimbursements: {
            //     title: 'Reimbursements',
            //     width : '100px'
            // },
            // netSalary: {
            //     title: 'Net Salary',
            //     width : '100px'
            // }
        }
    }
}
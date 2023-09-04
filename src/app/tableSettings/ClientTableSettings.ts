export class ClientTableSettings {
    public static settings = 
        {
            mode: 'external',
            hideSubHeader: false,
            actions: {
              position: 'right',
              add: false,
              edit : false,
              delete : false,
            //   custom: [
            //     { name: 'viewRecord', title: 'View'},
            //     // { name: 'activerecord', title: 'Activate' },
            //     // { name: 'deactiverecord', title: 'Deactivate' },
            //   ],
            },
            pager :{
              perPage : 10
            },
            columns: {
            corporateName: {
                title: 'Corporate Name'
            },
            clientName : {
                title : "Client Name"
            },
            contactPerson: {
                title: 'Contact Person'
            },
            address: {
                title: 'Address'
            },
            state: {
                title: 'State',
            },
            gstNo: {
                title: 'GST No',
            }
        }
    }
}
import { title } from "process";

export class AssetTableSettings {
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
                title: 'Id'
            },
            name : {
                title : "Name"
            },
            assetCategory: {
                title: 'Asset Category'
            },
            deviceName: {
                title: 'Device Name'
            },
            serialNumber: {
                title: 'Serial Number',
            },
            issueDate: {
                title: 'Issue Date',
            },
            returnDate:{
                title: 'Return Date'
            },
            statusTxt: {
                title: 'Status',
            }
        }
    }
}
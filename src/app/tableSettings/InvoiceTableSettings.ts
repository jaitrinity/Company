import { DatePipe } from "@angular/common";

export class InvoiceTableSettings{
    public static settings = {
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
          
          invoiceId: {
            title: 'Invoice Id'
          },
          poNumber : {
            title : 'PO Number'
          },
          corporateName : {
            title : "Corporate Name"
          },
          clientName: {
            title: 'Client Name'
          },
          statusView : {
            title : 'Status'
          },
          poDate : {
            title : 'PO Date',
            valuePrepareFunction : (value)=>{
              return new DatePipe('en-EN').transform(value, 'dd-MM-yyyy');
            }
          },
        }
    }
}
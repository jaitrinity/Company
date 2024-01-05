import { DatePipe } from "@angular/common";

export class PoTableSettings {
    public static settings = {
            mode: 'external',
            hideSubHeader: false,
            actions: {
              position: 'right',
              add: false,
              edit : false,
              delete : false,
              custom: [
                { name: 'viewPO', title: '<i class="fas fa-eye" title="View"></i>'},
              ],
            },
            pager :{
              perPage : 10
            },
            columns: {
            clientName : {
                title : "Client Name"
            },
            poDate: {
                title: 'PO Date',
                valuePrepareFunction : (value)=>{
                  return new DatePipe('en-EN').transform(value, 'dd-MM-yyyy');
                }
            }
        }
    }
}
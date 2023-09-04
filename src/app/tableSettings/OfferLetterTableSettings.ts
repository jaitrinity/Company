import { DatePipe } from "@angular/common";

export class OfferLetterTableSettings{
    public static settings = {
        mode: 'external',
        hideSubHeader: false,
        actions: {
          position: 'right',
          add: false,
          edit : false,
          delete : false,
          custom: [
            { name: 'viewOffer', title: 'View Offer'},
            { name: 'resendOffer', title: 'Re-send Offer'}
          ],
        },
        pager :{
          perPage : 10
        },
        columns: {
          name: {
            title: 'Emp name',
            width : '120px'
          },
          emailId : {
            title : "Email Id"
          },
          mobile: {
            title: 'Mobile',
            width : '75px'
          },
          // addLine1: {
          //   title: 'Address Line 1'
          // },
          // addLine2: {
          //   title: 'Address Line 2',
          // },
          address : {
            title : 'Address',
            width : '300px'
          },
          designation: {
            title: 'Designation',
            width : '100px'
          },
          doj: {
            title: 'DOJ',
            width : '80px',
            valuePrepareFunction : (value)=>{
              return new DatePipe('en-EN').transform(value, 'dd-MM-yyyy');
            }
          },
          lpa: {
            title: 'CTC',
            width : '75px'
          },
          status:{
            title : "Status",
            width : '80px'
          },
          offerDate : {
            title : "Offer Date",
            width : '75px',
            valuePrepareFunction : (value)=>{
              return new DatePipe('en-EN').transform(value, 'dd-MM-yyyy');
            }
          }
        }
    }
}
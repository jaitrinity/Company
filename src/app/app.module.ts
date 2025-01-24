import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { RegistrationComponent } from './layout/registration/registration.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { OnlyNumber } from './validation/OnlyNumber';
import { EmployeeComponent } from './layout/employee/employee.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {MatSelectModule} from '@angular/material/select';
import { DatePipe } from '@angular/common';
import {MatChipsModule} from '@angular/material/chips';
import { OfferLetterComponent } from './layout/offer-letter/offer-letter.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { LeaveComponent } from './layout/leave/leave.component';
import { IntervieweeComponent } from './layout/interviewee/interviewee.component';
import { InvoiceComponent } from './layout/invoice/invoice.component';
import { ClientComponent } from './layout/client/client.component';
import { PoComponent } from './layout/po/po.component';
import { ActiveComponent } from './layout/employee/active.component';
import { MapViewComponent } from './layout/map-view/map-view.component';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { WorkInProgressComponent } from './work-in-progress/work-in-progress.component';
import { AttendanceComponent } from './layout/attendance/attendance.component';
import { ReportComponent } from './layout/report/report.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { AssetComponent } from './layout/asset/asset.component';
import { ComplaintComponent } from './layout/complaint/complaint.component';
import { SalarySlipComponent } from './layout/salary-slip/salary-slip.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    RegistrationComponent,
    OnlyNumber,
    EmployeeComponent,
    OfferLetterComponent,
    LeaveComponent,
    IntervieweeComponent,
    InvoiceComponent,
    ClientComponent,
    PoComponent,
    ActiveComponent,
    MapViewComponent,
    WorkInProgressComponent,
    AttendanceComponent,
    ReportComponent,
    AssetComponent,
    ComplaintComponent,
    SalarySlipComponent
  ],
  entryComponents: [ActiveComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    Ng2SmartTableModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressBarModule,
    MatExpansionModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCBRHoDj-z_mh59rKgkXo6_P9eU2KOGoeM' 
    }),
    AgmDirectionModule
  ],
  providers: [AuthGuard,MatDatepickerModule, DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientComponent } from './layout/client/client.component';
import { EmployeeComponent } from './layout/employee/employee.component';
import { IntervieweeComponent } from './layout/interviewee/interviewee.component';
import { InvoiceComponent } from './layout/invoice/invoice.component';
import { LayoutComponent } from './layout/layout.component';
import { LeaveComponent } from './layout/leave/leave.component';
import { OfferLetterComponent } from './layout/offer-letter/offer-letter.component';
import { PoComponent } from './layout/po/po.component';
import { RegistrationComponent } from './layout/registration/registration.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth.guard';


const routes: Routes = [
  {path : '' ,  redirectTo: '/login', pathMatch: 'full'},
  {path : 'login', component :LoginComponent},
  {path : 'layout', component :LayoutComponent,  canActivate: [AuthGuard],
  children : [
    // { path: '', redirectTo: 'registration', pathMatch: 'full'},
    { path: 'registration', component: RegistrationComponent },
    { path: 'employee', component: EmployeeComponent },
    { path: 'offer-letter', component: OfferLetterComponent },
    { path: 'leave', component: LeaveComponent },
    { path: 'interviewee', component: IntervieweeComponent },
    { path: 'invoice', component: InvoiceComponent },
    { path: 'client', component: ClientComponent },
    { path: 'po', component: PoComponent },
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

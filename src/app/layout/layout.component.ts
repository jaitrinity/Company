import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  loginEmpId = "";
  loginEmpName = "";
  loginEmpRoleId = "";
  isAdmin : boolean = false;
  isEmployee : boolean = false;
  isFinance : boolean = false;
  constructor(private router : Router,private _snackBar: MatSnackBar, private title : Title) { 
    this.loginEmpId = localStorage.getItem("loginEmpId");
    this.loginEmpName = localStorage.getItem("loginEmpName");
    let loginEmpRoleId = localStorage.getItem("loginEmpRoleId");
    if(loginEmpRoleId == '2'){
      this.isEmployee = true;
      this.router.navigate(['/layout/leave']);
    }
    else if(loginEmpRoleId == '3'){
      this.isFinance = true;
      this.router.navigate(['/layout/invoice']);
    }
    else{
      this.isAdmin = true;
      this.router.navigate(['/layout/registration']);
    }
  }

  ngOnInit(): void {
  }

  setTitle(pageTitle){
    this.title.setTitle("Trinity - "+pageTitle)
  }

  
  openSnackBar(message: string, status : number) {
    let panalClassArr = ['text-white'];
    // Error
    if(status == 0){
      panalClassArr.push('bg-danger');
    }
    // Success
    else if(status == 1){
      panalClassArr.push('bg-success');
    }
    // Warning
    else if(status == 2){
      panalClassArr.push('bg-warning');
    }
    this._snackBar.open(message, "Close", {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration : 2000,
      panelClass: panalClassArr
    });
  }

  logout() {
    let isConfirm = confirm("Do you want to logout ?");
    if(isConfirm){
      this.router.navigate(['/login']);
    }
  }

}

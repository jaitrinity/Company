import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  menuList = [];
  loginEmpId = "";
  loginEmpName = "";
  loginEmpRoleId = "";
  isAdmin : boolean = false;
  isEmployee : boolean = false;
  isFinance : boolean = false;
  constructor(private sharedService : SharedService, private router : Router,private _snackBar: MatSnackBar, private title : Title) { 
    this.loginEmpId = localStorage.getItem("loginEmpId");
    this.loginEmpName = localStorage.getItem("loginEmpName");
    this.loginEmpRoleId = localStorage.getItem("loginEmpRoleId");
    if(this.loginEmpRoleId == "1"){
      this.isAdmin = true;
      this.router.navigate(['/layout/registration']);
    }
    else if(this.loginEmpRoleId == '3'){
      this.isFinance = true;
      this.router.navigate(['/layout/invoice']);
    }
    else{
      this.isEmployee = true;
      this.router.navigate(['/layout/leave']);
    }
  }

  ngOnInit(): void {
    this.getHeaderMenuList();
  }

  getHeaderMenuList(){
    let jsonData = {
      loginEmpId:this.loginEmpId,
      loginEmpRoleId:this.loginEmpRoleId
    }
    this.sharedService.getAllListBySelectType(jsonData, "headerMenu")
    .subscribe(
      (result)=>{
        this.menuList = result;
      },
      (error)=>{

      }
    )
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

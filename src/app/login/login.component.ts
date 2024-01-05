import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Constant } from '../services/Contant';
import { SharedService } from '../services/shared.service';
import { AuthenticateModel } from './model/AuthenticateModel';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  isOTP_Validate : boolean = false;
  mobileNumber = "";
  otpNumber = "";
  validOTPNumber = "";
  newPassword = "";
  confirmPassword = "";
  hide : boolean = true;
  showPassword : boolean = true;
  public loginModel : AuthenticateModel;
  loginEmpId = "";
  loginEmpRoleId = "";
  button = "#a649e9";
  constructor(private titleService : Title, private sharedService : SharedService,
    private router:Router, private _snackBar: MatSnackBar) { 
      localStorage.clear();
      this.loginModel = new AuthenticateModel();
      this.titleService.setTitle("Trinity - Login")
  }

  ngOnInit(): void {
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "Close", {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration : 2000,
      panelClass: ["text-white","bg-warning"]
    });
  }

  onSubmitting(){
    let jsonData = {
      username : this.loginModel.mobile,
      password : window.btoa(this.loginModel.password)
    }
    this.sharedService.autherization(jsonData)
    .subscribe(
      (result)=>{
        if(result.responseCode === Constant.SUCCESSFUL_STATUS_CODE){
          let wrappedObj = result.wrappedList[0];
          localStorage.setItem("loginEmpId",wrappedObj.empId);
          localStorage.setItem("loginEmpName",wrappedObj.empName);
          localStorage.setItem("loginEmpRoleId",wrappedObj.empRoleId);
          localStorage.setItem("loginEmpRole",wrappedObj.empRole);
          localStorage.setItem(btoa("isValidToken"),btoa(Constant.TRINITY_PRIVATE_KEY));
          localStorage.setItem("button",this.button);
          this.loginEmpId = wrappedObj.empId;
          this.loginEmpRoleId = wrappedObj.empRoleId;
          this.router.navigate(['/layout']);
        }
        else if(result.responseCode === Constant.NO_RECORDS_FOUND_CODE){
          this.openSnackBar(result.responseDesc);
        }
        else{

        }
      },
      (error)=>{
        this.openSnackBar(Constant.returnServerErrorMessage("authenticate"));
      }
    )
  }

  openForgetModal(){
    if(this.loginModel.mobile == ""){
      this.openSnackBar("Enter valid mobile no");
      return;
    }
    let jsonData = {
      loginEmpId : this.loginEmpId,
      loginEmpRoleId: this.loginEmpRoleId,
      mobile : this.loginModel.mobile
    }
    this.sharedService.getAllListBySelectType(jsonData,"validateMobile")
    .subscribe(
      (result)=>{
        if(result.responseCode === Constant.SUCCESSFUL_STATUS_CODE){
          this.openAnyModal('forgetPasswordModal');
          this.mobileNumber = this.loginModel.mobile;
        }
        else{
          this.openSnackBar(result.responseDesc);
        }
      },
      (error)=>{
        this.openSnackBar(Constant.returnServerErrorMessage("sendOTP"));
      }
    )

    
  }

  sendOTP(){
    this.isOTP_Validate = false;
    if(this.mobileNumber.trim().length<10){
      this.openSnackBar("Please enter valid mobile number");
      return;
    }
    let jsonData = {
      mobileNumber : this.mobileNumber
    }
    this.sharedService.sendOTP(jsonData)
    .subscribe(
      (result)=>{
        // console.log(result);
        if(result.responseCode === Constant.SUCCESSFUL_STATUS_CODE){
          this.openSnackBar("OTP is sent to "+this.mobileNumber+" number.");
          this.validOTPNumber = result.wrappedList[0];
        }
        else{
          this.openSnackBar(result.responseDesc);
        }
      },
      (error)=>{
        this.openSnackBar(Constant.returnServerErrorMessage("sendOTP"));
      }
    )
  }

  VerifyOTP(){
    this.isOTP_Validate = false;
    if(this.otpNumber != this.validOTPNumber){
      alert("enter enter valid otp");
      return;
    }
    this.isOTP_Validate = true;
  }

  changePassword(){
    if(this.newPassword == ""){
      alert("Enter new password");
      return ;
    }
    else if(this.confirmPassword != this.newPassword){
      alert("Password does not match, please re-enter.");
      return;
    }
    let jsonData = {
      mobileNumber : this.mobileNumber,
      newPassword : window.btoa(this.newPassword)
    }
    this.sharedService.changePassword(jsonData)
    .subscribe(
      (result)=>{
        if(result.responseCode === Constant.SUCCESSFUL_STATUS_CODE){
          this.openSnackBar(result.responseDesc);
          this.closeAnyModal("forgetPasswordModal");
          this.otpNumber = "";
          this.mobileNumber = "";
          this.newPassword = "";
          this.confirmPassword = "";
          this.isOTP_Validate = false;
        }
        else{
          this.openSnackBar(result.responseDesc);
        }
      },
      (error)=>{
        this.openSnackBar(Constant.returnServerErrorMessage("changePassword"));
      }
    )
  }

  openAnyModal(modalName){
    $("#"+modalName).modal({
      backdrop : 'static',
      keyboard : false
    });
  }

  closeAnyModal(modalName){
    this.mobileNumber = "";
    this.otpNumber = "";
    this.newPassword = "";
    this.confirmPassword = "";
    this.isOTP_Validate = false;
    this.showPassword = true;
    $("#"+modalName).modal("hide");
  }

}

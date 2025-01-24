import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private appUrl = environment.appUrl;
  constructor(private http : HttpClient) { }

  public autherization(jsonData : any) : Observable<any>{
    return this.http.post<any>(this.appUrl+"authenticate.php",jsonData);
  }

  public insertDataByInsertType(jsonData : any, insertType : string) : Observable<any>{
    return this.http.post<any>(this.appUrl+"insertInTable.php?insertType="+insertType,jsonData);
  }

  public getAllListBySelectType(jsonData : any, selectType : string) : Observable<any>{
    return this.http.post<any>(this.appUrl+"getAllList.php?selectType="+selectType,jsonData);
  }

  public sendOfferLetterToMail(jsonData : any) : Observable<any>{
    return this.http.post<any>(this.appUrl+"sendOfferLetterToMail.php",jsonData);
  }

  public resendOfferLetterToMail(jsonData : any) : Observable<any>{
    return this.http.post<any>(this.appUrl+"resendOfferLetter.php",jsonData);
  }

  public updateDataByUpdateType(jsonData : any, updateType : string) : Observable<any>{
    return this.http.post<any>(this.appUrl+"updateInTable.php?updateType="+updateType,jsonData);
  }

  public updateLeaveStatus(jsonData : any) : Observable<any>{
    return this.http.post<any>(this.appUrl+"updateLeaveStatus.php",jsonData);
  }

  public generateInvoice(jsonData : any) : Observable<any>{
    return this.http.post<any>(this.appUrl+"generateInvoice.php",jsonData);
  }

  public sendOTP(jsonData : any) : Observable<any>{
    return this.http.post<any>(this.appUrl+"sendOTPtoMobile.php",jsonData);
  }
  public changePassword(jsonData : any) : Observable<any>{
    return this.http.post<any>(this.appUrl+"changePassword.php",jsonData);
  }

  public sendJoiningLetterToMail(jsonData){
    return this.http.post<any>(this.appUrl+"sendJoiningLetterToMail.php",jsonData);
  }

  public sendSalarySlipToMail(jsonData : any) : Observable<any>{
    return this.http.post<any>(this.appUrl+"sendSalarySlipToMail.php",jsonData);
  }

  
}

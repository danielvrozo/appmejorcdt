import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import { Observable, throwError  } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { LoginPhoneI, LoginCodeI } from '../../modelos/login.interfaces';
import { ResponseI} from '../../modelos/response.interface';
import { ListUserI } from '../../modelos/listaUsuario.interface';
import { codeVerificationI, codeVerificationSMSI } from '../../modelos/codeVerification.interface';
import { decevalI } from '../../modelos/devecal.interface';


@Injectable({
  providedIn: 'root'
})
export class LoginService {


  Login:string =       "https://treltgconk.execute-api.us-east-1.amazonaws.com/dev-nicolas/auth/";
  infoUser:string =    "https://treltgconk.execute-api.us-east-1.amazonaws.com/dev-nicolas/get-user-info";
  CodeKey:string =     "https://treltgconk.execute-api.us-east-1.amazonaws.com/dev-nicolas/create-dynamic-key";
  decevalUser:string = "https://treltgconk.execute-api.us-east-1.amazonaws.com/dev-nicolas/user-module/get-deceval-url";



  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }) 
  }

  IdTokenUser2 = localStorage.getItem("IdToken");
  httpOptionsAut: any; 

  constructor(private http:HttpClient) { }



  loginByPhone(data: any): Observable<LoginPhoneI> {
    return this.http.post<LoginPhoneI>(this.Login + 'sign_up', JSON.stringify(data), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  } 

  loginByCode(data: any): Observable<LoginCodeI> {
    return this.http.post<LoginCodeI>(this.Login + 'sign_in', JSON.stringify(data), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  } 


  getUserInfo(data: any, IdTokenUser: any ): Observable<ListUserI> {
    return this.http.post<ListUserI>(this. infoUser, JSON.stringify(data), this.httpOptionsAut = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': IdTokenUser || 'eyJraWQiOiI4cG5tUW9XaG5PUTRwbk51d2JLbWZRdmlIQzBKbnMrbk5vajRYeGhLc2U4PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIxYTBlYjk4NC1jNTE0LTRhNTktOTk4ZC05MGZiZmJkZmZlNjUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9yWFdtckNESGoiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiIxYTBlYjk4NC1jNTE0LTRhNTktOTk4ZC05MGZiZmJkZmZlNjUiLCJvcmlnaW5fanRpIjoiMmMyNWNlODUtZGQyMS00YWM5LThkZGQtYjAyNzMwNmRjYjU0IiwiYXVkIjoiMm9wZmJjbjY0cDIxMWJiOGRvbWZqa2ducmUiLCJldmVudF9pZCI6IjAzZDcxNDZiLTFmMDktNGU1Ni04NzUxLWZhNTJmMzYxOGI4NSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjM2Njg1NDI3LCJwaG9uZV9udW1iZXIiOiIrNTczMDA2MzA2OTIyIiwiZXhwIjoxNjM2Njg5MDI3LCJpYXQiOjE2MzY2ODU0MjcsImp0aSI6ImYwZDE1N2ZiLTRmNGItNDUzNC05NWExLTY2N2EwZGUzMWQ1MyJ9.QUqPmA3x1o5liKaRXuGmDIvfYN7riKcNfGJrJIvD0p2DAAecILZNUSvozBOsC2txip2omkaxsXe4ESgp_kh-m0Fe0MEQpTUmhTGQje7M6l4TssOAtPcdfFSrzCye-rt7dlIkVkHVbbYFY4Xo8TmZllSeu229sYJ8s-ion6oJvD5ijKEg453yLmDdZ6oL26HwmnGOlrbyeOjaDEklBIkAmo5ErJz5O48G6TDCz3PhLDsPPWPkqJ2Ly3o7Kgzx2hN23WRAF001XboCjjEqsHF3nxcthsbE3-3xWEm5WqrdJ5qTY3ie3h_562jfc3y4wV-Dk8vf6IK6x6IJTW84RUEkeg'
      })
    })
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  DecevalAPI(data: any, IdTokenUser: any ): Observable<decevalI> {
    return this.http.post<decevalI>(this.decevalUser, JSON.stringify(data), this.httpOptionsAut = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': IdTokenUser || 'eyJraWQiOiI4cG5tUW9XaG5PUTRwbk51d2JLbWZRdmlIQzBKbnMrbk5vajRYeGhLc2U4PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIxYTBlYjk4NC1jNTE0LTRhNTktOTk4ZC05MGZiZmJkZmZlNjUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9yWFdtckNESGoiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiIxYTBlYjk4NC1jNTE0LTRhNTktOTk4ZC05MGZiZmJkZmZlNjUiLCJvcmlnaW5fanRpIjoiMmMyNWNlODUtZGQyMS00YWM5LThkZGQtYjAyNzMwNmRjYjU0IiwiYXVkIjoiMm9wZmJjbjY0cDIxMWJiOGRvbWZqa2ducmUiLCJldmVudF9pZCI6IjAzZDcxNDZiLTFmMDktNGU1Ni04NzUxLWZhNTJmMzYxOGI4NSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjM2Njg1NDI3LCJwaG9uZV9udW1iZXIiOiIrNTczMDA2MzA2OTIyIiwiZXhwIjoxNjM2Njg5MDI3LCJpYXQiOjE2MzY2ODU0MjcsImp0aSI6ImYwZDE1N2ZiLTRmNGItNDUzNC05NWExLTY2N2EwZGUzMWQ1MyJ9.QUqPmA3x1o5liKaRXuGmDIvfYN7riKcNfGJrJIvD0p2DAAecILZNUSvozBOsC2txip2omkaxsXe4ESgp_kh-m0Fe0MEQpTUmhTGQje7M6l4TssOAtPcdfFSrzCye-rt7dlIkVkHVbbYFY4Xo8TmZllSeu229sYJ8s-ion6oJvD5ijKEg453yLmDdZ6oL26HwmnGOlrbyeOjaDEklBIkAmo5ErJz5O48G6TDCz3PhLDsPPWPkqJ2Ly3o7Kgzx2hN23WRAF001XboCjjEqsHF3nxcthsbE3-3xWEm5WqrdJ5qTY3ie3h_562jfc3y4wV-Dk8vf6IK6x6IJTW84RUEkeg'
      })
    })
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }


  formVerificationCode(data: any, IdTokenUser: any ): Observable<codeVerificationI> {
    return this.http.post<codeVerificationI>(this.CodeKey, JSON.stringify(data), this.httpOptionsAut = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': IdTokenUser || 'eyJraWQiOiI4cG5tUW9XaG5PUTRwbk51d2JLbWZRdmlIQzBKbnMrbk5vajRYeGhLc2U4PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIxYTBlYjk4NC1jNTE0LTRhNTktOTk4ZC05MGZiZmJkZmZlNjUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9yWFdtckNESGoiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiIxYTBlYjk4NC1jNTE0LTRhNTktOTk4ZC05MGZiZmJkZmZlNjUiLCJvcmlnaW5fanRpIjoiMmMyNWNlODUtZGQyMS00YWM5LThkZGQtYjAyNzMwNmRjYjU0IiwiYXVkIjoiMm9wZmJjbjY0cDIxMWJiOGRvbWZqa2ducmUiLCJldmVudF9pZCI6IjAzZDcxNDZiLTFmMDktNGU1Ni04NzUxLWZhNTJmMzYxOGI4NSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjM2Njg1NDI3LCJwaG9uZV9udW1iZXIiOiIrNTczMDA2MzA2OTIyIiwiZXhwIjoxNjM2Njg5MDI3LCJpYXQiOjE2MzY2ODU0MjcsImp0aSI6ImYwZDE1N2ZiLTRmNGItNDUzNC05NWExLTY2N2EwZGUzMWQ1MyJ9.QUqPmA3x1o5liKaRXuGmDIvfYN7riKcNfGJrJIvD0p2DAAecILZNUSvozBOsC2txip2omkaxsXe4ESgp_kh-m0Fe0MEQpTUmhTGQje7M6l4TssOAtPcdfFSrzCye-rt7dlIkVkHVbbYFY4Xo8TmZllSeu229sYJ8s-ion6oJvD5ijKEg453yLmDdZ6oL26HwmnGOlrbyeOjaDEklBIkAmo5ErJz5O48G6TDCz3PhLDsPPWPkqJ2Ly3o7Kgzx2hN23WRAF001XboCjjEqsHF3nxcthsbE3-3xWEm5WqrdJ5qTY3ie3h_562jfc3y4wV-Dk8vf6IK6x6IJTW84RUEkeg'
      })
    })
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  } 


  formVerificationCodeSMS(data: any, IdTokenUser: any ): Observable<codeVerificationSMSI> {
    return this.http.post<codeVerificationSMSI>(this.infoUser, JSON.stringify(data), this.httpOptionsAut = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': IdTokenUser || 'eyJraWQiOiI4cG5tUW9XaG5PUTRwbk51d2JLbWZRdmlIQzBKbnMrbk5vajRYeGhLc2U4PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIxYTBlYjk4NC1jNTE0LTRhNTktOTk4ZC05MGZiZmJkZmZlNjUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9yWFdtckNESGoiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiIxYTBlYjk4NC1jNTE0LTRhNTktOTk4ZC05MGZiZmJkZmZlNjUiLCJvcmlnaW5fanRpIjoiMmMyNWNlODUtZGQyMS00YWM5LThkZGQtYjAyNzMwNmRjYjU0IiwiYXVkIjoiMm9wZmJjbjY0cDIxMWJiOGRvbWZqa2ducmUiLCJldmVudF9pZCI6IjAzZDcxNDZiLTFmMDktNGU1Ni04NzUxLWZhNTJmMzYxOGI4NSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjM2Njg1NDI3LCJwaG9uZV9udW1iZXIiOiIrNTczMDA2MzA2OTIyIiwiZXhwIjoxNjM2Njg5MDI3LCJpYXQiOjE2MzY2ODU0MjcsImp0aSI6ImYwZDE1N2ZiLTRmNGItNDUzNC05NWExLTY2N2EwZGUzMWQ1MyJ9.QUqPmA3x1o5liKaRXuGmDIvfYN7riKcNfGJrJIvD0p2DAAecILZNUSvozBOsC2txip2omkaxsXe4ESgp_kh-m0Fe0MEQpTUmhTGQje7M6l4TssOAtPcdfFSrzCye-rt7dlIkVkHVbbYFY4Xo8TmZllSeu229sYJ8s-ion6oJvD5ijKEg453yLmDdZ6oL26HwmnGOlrbyeOjaDEklBIkAmo5ErJz5O48G6TDCz3PhLDsPPWPkqJ2Ly3o7Kgzx2hN23WRAF001XboCjjEqsHF3nxcthsbE3-3xWEm5WqrdJ5qTY3ie3h_562jfc3y4wV-Dk8vf6IK6x6IJTW84RUEkeg'
      })
    })
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  } 


  handleError(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error

      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

     if(error.status == "0" || error.status == "401"  || error.status == 0  || error.status == 401 ) {
        window.onbeforeunload = function() {
          localStorage.clear();
          return '';
        }; 
      }  
    }
    console.log(errorMessage);
    return throwError(errorMessage);
 }
}

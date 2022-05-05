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


  signUpPhone(data: any): Observable<LoginPhoneI> {
    return this.http.post<LoginPhoneI>(this.Login + 'sign_up', JSON.stringify(data), this.httpOptions)
  } 

  signUpCode(data: any): Observable<LoginCodeI> {
    return this.http.post<LoginCodeI>(this.Login + 'sign_in', JSON.stringify(data), this.httpOptions)
  } 


  getUserInfo(data: any, IdTokenUser: any ): Observable<ListUserI> {
    return this.http.post<ListUserI>(this. infoUser, JSON.stringify(data), this.httpOptionsAut = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': IdTokenUser 
      })
    })
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  SegundoPlanoCodigoVerificado(data: any, IdTokenUser: any ): Observable<codeVerificationI> {
    return this.http.post<codeVerificationI>(this.CodeKey, JSON.stringify(data), this.httpOptionsAut = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': IdTokenUser 
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
        'Authorization': IdTokenUser 
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
        'Authorization': IdTokenUser
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

     if(error.status == "undefined" || error.status == "0" || error.status == "401"  || error.status == 0  || error.status == 401 ) {
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

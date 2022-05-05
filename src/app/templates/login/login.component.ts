import { Title } from '@angular/platform-browser';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { LoginService } from '../../services/api/login.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { NgOtpInputComponent, NgOtpInputConfig } from 'ng-otp-input';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', './css/font-family-openSans.css', './css/login.component.responsive.css']
})
export class LoginComponent implements OnInit {
  Formulario_Celular_Codigo: FormGroup;
  otp?: string;
  MensajeError: any = "";
  showOtpComponent = true;
  Campo_Celular = true;
  Campo_Codigo = false;
  AlertaMensaje = false;
  GifLoadingAPI = false;
  @ViewChild(NgOtpInputComponent, { static: false }) ngOtpInput?: NgOtpInputComponent;


  constructor(
    private router: Router,
    public fb: FormBuilder,
    public api: LoginService,
    public breakpointObserver:BreakpointObserver,
    private title: Title
  ) {
    this.Formulario_Celular_Codigo = this.fb.group({
      numero_celular: new FormControl(undefined, [Validators.required]),
      key_app: ['portal_cdt']
    });
  }

  ngOnInit(): void {
    this.title.setTitle('Iniciar sesión | MejorCDT');
    this.breakpointObserver
      .observe(['(min-width: 480px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
        } else {
        }
      });

    if (localStorage.getItem('IdToken')) {
      this.router.navigate(['dashboard']);
    }
  }

  CodigoFinal(otp: string) {
    this.otp = otp;
  }

  TiempoOcultarErrores(time:any){
    setTimeout(() => {
      this.AlertaMensaje = false;
    }, time*1000);
  }

  EnviarCodigo() {

    let isValidPhone = this.Formulario_Celular_Codigo.controls['numero_celular'].invalid;
    let CelularVacio = this.Formulario_Celular_Codigo.value.numero_celular;

    if (isValidPhone == false) {
      const celularNacional = this.Formulario_Celular_Codigo.value.numero_celular.e164Number;
      const DATA_API_SIGNUP = {
        "phone_number": celularNacional,
        "device_key": "Ingreso al Modulo de Usuario"
      };

      this.GifLoadingAPI = true;
      this.AlertaMensaje = false;
      this.Campo_Celular = false;


      return this.api.signUpPhone(DATA_API_SIGNUP).subscribe((data: any) => {

        if (data.ResponseMetadata.HTTPStatusCode == 200) {
          this.GifLoadingAPI = false;
          this.Campo_Codigo = true;
          this.MensajeError = "";
          localStorage.setItem("sesion", data.Session);
          localStorage.setItem("name", data.ChallengeParameters.USERNAME);
        }
      },
        (error) => {
          setTimeout(() => {
            this.GifLoadingAPI = false;
            this.AlertaMensaje = true;
            this.Campo_Celular = true;
            this.MensajeError = "Ha sucedido un error: Verifica tu número de celular";
          }, 900);
        } 
      );
    }
    else if (CelularVacio == "null" || CelularVacio == null) {
      this.AlertaMensaje = true;
      this.MensajeError = "Tu número de celular está vacio"
      this.TiempoOcultarErrores(10);
    }
    else {
      this.AlertaMensaje = true;
      this.MensajeError = "Tu número de celular es invalido"
      this.TiempoOcultarErrores(10);
    }
    return;
  }

  EnviarIngresarCodigo() {
    const lengthCelular = this.otp?.length;
    if (lengthCelular == 6) {
      this.Campo_Codigo = false;
      this.GifLoadingAPI = true;
      this.AlertaMensaje = false;
      const DATA_API_SIGNIN = {
        "username": localStorage.getItem('name'),
        "answer": String(this.otp),
        "session": localStorage.getItem('sesion')
      }
      return this.api.signUpCode(DATA_API_SIGNIN).subscribe((data: any) => {
        if (data.ResponseMetadata.HTTPStatusCode == 200) {
          this.MensajeError = "";
          localStorage.setItem("token", data.AuthenticationResult.AccessToken);
          localStorage.setItem("IdToken", data.AuthenticationResult.IdToken);

          setTimeout(() => {
            this.GifLoadingAPI = false;
            this.router.navigate(['dashboard']);
          }, 1000);
        }
      },
        (error) => {
          setTimeout(() => {
            this.GifLoadingAPI = false;
            this.AlertaMensaje = true;
            this.Campo_Codigo = true;
            this.MensajeError = "Ha sucedido un error: Verifica el código";
            this.TiempoOcultarErrores(10);
          }, 900);
        });

    } else {
      this.AlertaMensaje = true;
      this.MensajeError = "El código esta incompleto, revisalo";
      this.TiempoOcultarErrores(10);
    }

    return;
  }

  /* Configuración de Codigo de 6 digitos */
  config: NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputClass: 'sms_digit fw-bold'
  };

  /* Configuración de ngx-intl-tel-input*/
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Colombia];
  onlyCounstries: CountryISO[] = [CountryISO.Ecuador, CountryISO.Mexico, CountryISO.UnitedStates, CountryISO.Colombia,];
}

import { Title } from '@angular/platform-browser';
import { Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { LoginService } from '../../services/api/login.service';
import { LoginPhoneI, LoginCodeI} from '../../modelos/login.interfaces';
import {  BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import { Router} from '@angular/router';
import { SearchCountryField } from 'ngx-intl-tel-input';
import { CountryISO } from 'ngx-intl-tel-input';
import { PhoneNumberFormat } from 'ngx-intl-tel-input';
import { NgOtpInputComponent, NgOtpInputConfig } from 'ng-otp-input';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html', 
  styleUrls: ['./login.component.css', './css/font-family-openSans.css', './css/login.component.responsive.css'] 
})
export class LoginComponent implements OnInit {
  Formulario_Celular_Codigo:FormGroup;
  otp?: string;
  mensaje_ayuda:any = "Enviaremos un código de verificación a tú celu para iniciar sesión.";
  showOtpComponent = true;
  Campo_Celular = true;
  Campo_Codigo = false;
  MensajeError:any = ""; 
  AlertaMensaje = false;
  @ViewChild(NgOtpInputComponent, { static: false}) ngOtpInput?:NgOtpInputComponent;

 
  constructor( 
    private router:Router, 
    public fb: FormBuilder, 
    public api: LoginService, 
    public breakpointObserver: 
    BreakpointObserver,
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
  }

  CodigoFinal(otp: string) {
    this.otp = otp;
  }

  EnviarCodigo(){
    let isValidPhone = this.Formulario_Celular_Codigo.controls['numero_celular'].invalid;
    let CelularVacio = this.Formulario_Celular_Codigo.value.numero_celular;
    const celularNacional = this.Formulario_Celular_Codigo.value.numero_celular.e164Number;
    if(isValidPhone == false){
      localStorage.setItem("phone", celularNacional);
      
      this.AlertaMensaje = false;
      this.Campo_Celular = false;
      this.Campo_Codigo = true;
      this.mensaje_ayuda = "";
    } 
    else if(CelularVacio == "null" || CelularVacio == null){
      this.AlertaMensaje = true;
      this.MensajeError = "Tu número de celular está vacido"
    } 
    
    else {
      this.AlertaMensaje = true;
      this.MensajeError = "Tu número de celular es invalido, corrigelo"
    }
    
  }

  EnviarIngresarCodigo(){
    const lengthCelular = this.otp?.length;
    if(lengthCelular == 6){
      this.AlertaMensaje = false;
      localStorage.setItem("codigo", String(this.otp));
      
    } else{
      this.AlertaMensaje = true;
      this.MensajeError = "El código esta incompleto, revisalo"
    }
  }

  

  /* Configuración de Codigo de 6 digitos */
  config :NgOtpInputConfig = {
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

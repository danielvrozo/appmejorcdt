/* 

mejorCDT - Propiedad intelectual de Luable.app y mejorcdt.com
Project: Interfaz para usuarios - Inicios de Sesión
Sección: Panel administrativo
Varsión: 1.0.0

Lenguaje: Javascript - Ts
Framework: Angular 12.2.5
Boostrap: 5

*/

import { Title } from '@angular/platform-browser';
import { Component, OnInit, Input, ViewChild, ElementRef, ViewChildren} from '@angular/core';
import { LoginService } from '../../services/api/login.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { codeVerificationI, codeVerificationSMSI } from '../../modelos/codeVerification.interface'
import { Router} from '@angular/router';
import { ListUserI } from '../../modelos/listaUsuario.interface';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient} from '@angular/common/http';

import {  BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css', './css/font-family-openSans.css', './css/dashboard.compoenent.responsive.css' ],
  animations: [
    trigger('widthGrow', [
      state(
        'open',
        style({
          opacity: ""
        })
      ),
      state(
        'closed',
        style({
          opacity: "0",
          marginTop: "-8%"
        })
      ),
      transition('* => *', animate(580))
    ])
  ]
}) 


export class DashboardComponent implements OnInit {

 

  // Inicio de declaracion de variables   
  load!: boolean;
  user!: ListUserI;
  codeVerifI!: codeVerificationI;
  codeVerifiSMS!: codeVerificationSMSI;
  codeVerForm!: FormGroup;
  
  allCdtUser = 0
  cdtSumAmount: number = 0; 
  cdtSumIf:boolean = false;
  valueHiddenAmount: any = "********";
  moment: any = moment; 
  fechaActual = moment();

  fullname: any = "";
  scoreUser: any;
  avatarUser: any;
  phoneUser:any;
  levelUser:any;
  cdts!: any;
 


  MgsStatus:boolean = false;
  MsgText:any = "";
  classMsg: any = "";

  valueInputSesion: any = "";
  
  VersionDesktop: any; // Versión de Desktop declaradas como Any (Cualquier tipo de dato)
  VersionMobile: any; // Versión de Mobile

  errorStatus:boolean = false; //Si hay muchos intentos mostrar alert
  succStatus:boolean = false; //Si la verificación es exitosa 
  warnigMsg:any = ""; // Mensaje muchos intentos
  succMsg:any = ""; // Mensaje exitoso
  msgCodeVerification:boolean = true; // Div que contiene el mensaje.
  estadoAmountVisible:boolean = false;

  nameCDTid!: any;
  avalID!:any;
  dateOpenID!:any;
  dateExpirationnID!:any;
  amountID!:any;
  roiGananciaID!:any;
  plazoID!:any;
  rateID!:any;
  AmountControlVisible:boolean = false;
  amountVisibileTotal:number = 0;
  DatosAmountvisibles!:any;

  montosVisibles!:any;
  infoUserVisible!:any;
  controllerFor:boolean = false;
  DatosGetInfo!:any;
  deceval!:any;
  id_CDT_Responsive:any;
  

  constructor( 
    private router:Router, 
    private modal:NgbModal,  
    public fb: FormBuilder, 
    private http: HttpClient, 
    public api: LoginService, 
    public breakpointObserver: BreakpointObserver,
    private title: Title
    ) { 
      this.codeVerForm = this.fb.group({
        cognito_id: [localStorage.getItem('name')],
        sns_code: ["", [Validators.required]],
      });

      this.createForm();

  }

  idCDTDeceval:any = "null";

  alert_mensaje:any;
  mensajeTextAlert:any;
  ValidatorFormCode:any;

  @Input() sns_code!: string;
  @ViewChild('alert_mensaje') VC_Alerta_Mensaje?: ElementRef;
  @ViewChild('titulo_celular_sms', {static: false} ) VC_Titulo_Celular?: ElementRef;
  @ViewChild('input_sms', {static: false} ) VC_Input_Celular?: ElementRef;

  //Inicializador
  ngOnInit(): void {  

    localStorage.setItem("vista", "dashboard");
    this.title.setTitle('Panel administrativo');
    this.checkLoginToken();


    this.breakpointObserver
      .observe(['(min-width: 480px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {

          //Entonces si el width es superior a 480px, será la versión Desktop mostrando su propio diseño
          this.VersionDesktop = true;
          this.VersionMobile = false;

          console.log("Desktop")
        } else {

          //Entonces si el width es inferio a 480px, será la versión Mobile mostrando su propio diseño
          this.VersionDesktop = false;
          this.VersionMobile = true;

          console.log("mobile")
        }
      });


    if(localStorage.getItem('IdToken')){
 
      this.onPostUser();
      if(localStorage.getItem('verification') == 'exit'){
        
      } 
      console.log("Cargada idToken");
    } else {
      console.log("No cargada id Token")
    }
 
    //Llamamos las funciones para inicializar 
    this.checkIfVerifiactionLS(); 
  }


  cambioColoorErrorFroms(id: any, viewChildTituloForm: any, viewChildTInputForm: any){

    if(id == 1)
      setTimeout(() => { 
        console.log("a ver ", viewChildTituloForm);
        viewChildTituloForm?.nativeElement.setAttribute('style', 'color: #e90707'); 
        viewChildTInputForm?.nativeElement.setAttribute('style', 'border: 2px solid #e90707' ); 
      }, 10);
    else 
      setTimeout(() => { 
        viewChildTituloForm?.nativeElement.setAttribute('style', ''); 
        viewChildTInputForm?.nativeElement.setAttribute('style', '' ); 
      }, 10);
  }

  createForm() {

    this.codeVerForm.controls["sns_code"].valueChanges.subscribe(data => {
      if(data == '' || data == null || data == "") {
        this.cambioColoorErrorFroms(1, this.VC_Titulo_Celular, this.VC_Input_Celular);
        
      } else{
        this.alert_mensaje = false;
        this.cambioColoorErrorFroms(0, this.VC_Titulo_Celular, this.VC_Input_Celular);
      }
    });
    
  }

  controlAlerta(nameClassRemove: any, nameClassAdd: any){
    document.querySelector("#alert_info_cdt")?.classList.remove(nameClassRemove);
    document.querySelector("#alert_info_cdt")?.classList.add(nameClassAdd);
  }

  close_mensaje(){
    this.controlAlerta('animation_slideIN', 'margin-left-alert');    
  }

  mensajeAlerta(textoMensaje: any, bgColor: any){
    this.alert_mensaje = true;
    this.mensajeTextAlert = textoMensaje;
    setTimeout(() => {
      this.VC_Alerta_Mensaje?.nativeElement.setAttribute(
        'style',
        'background-color: ' + bgColor + ''
      ); 
    }, 100);

    this.controlAlerta('margin-left-alert', 'animation_slideIN'); 

  }
  
  onPostUser(){ 
   
    const jsonValueUser = { "cognito_id": localStorage.getItem('name') };
    const idTokenUser = localStorage.getItem('IdToken');

    return this.api.getUserInfo(jsonValueUser, idTokenUser).subscribe((data: any) => {
      this.user = data;

      if (data) { 
       
        localStorage.setItem("dataGetInfo", JSON.stringify(data));
        this.infoUserVisible =  JSON.parse(localStorage.getItem('dataGetInfo') || 'null');

        if(localStorage.getItem('verification') == 'exit'){
        

          var DatosAmountvisible = JSON.parse(localStorage.getItem('dataAmountVisibles') || 'null');
          this.infoUserVisible =  JSON.parse(localStorage.getItem('dataAmountVisibles') || 'null');
          
          this.AmountControlVisible = true;
          let cdtsTest = DatosAmountvisible.cdts;
 
          for (let i = 0; i < cdtsTest.length; i++) { 
            this.amountVisibileTotal += DatosAmountvisible.cdts[i].amount;
            
          } 
          
        }
        
        this.user = data;

        let cdtsAmountAll = this.user.cdts;
        this.fullname = this.user.fullname;
        this.scoreUser = this.user.score;
        this.avatarUser = this.user.avatar;
        this.phoneUser = this.user.phone;
        this.levelUser = this.user.level
       

        if(this.avatarUser == "No registrado") {
          this.avatarUser = "http://mejorcdt.com/templates/images/item-animals/sifaka-svg.svg";
        } else {
          this.avatarUser = this.avatarUser;
        }
        

        for (let i = 0; i < cdtsAmountAll.length; i++) { 

          //Si la verificación de código es exitosa, entonces cargara información a la variable, 
          if(localStorage.getItem('verification') == "exit"){
            this.cdtSumAmount += this.user.cdts[i].amount;
            
            //cdtSumIf tipo boleean, nos ayudará para mostrar los ***** por si no hay verificación
            //False = No hay verificación
            //True = Hay verificación
            this.cdtSumIf = true;
          } else { 
            //Si no hay verificación, la variable retorna a 0
            this.cdtSumAmount;
          }
        
        }
        //Mapeamos el arreglo de CDT dentro del JSON para buscar cuantos "cdt's" hay
        this.user.cdts.map((dato) => {
          if(dato.bank){
            this.allCdtUser += 1     

          }
        })

        this.createForm();
        
      } else {
        this.classMsg = "danger";
        this.MsgText = "Se ha producido un error. Vuelve a intentarlo";
      }
     
    });

  };

    
  //Entonces una vez enviado el código de verificación y la api nos manda estado 200, lo que hara
  //es guardar una variable en el Local Storage dónde la verificacion será exitosa
  //Luego despues de 2.5segundos se recargará la página y mostrara los valores (amount)

  onVerification(){ 

    this.ValidatorFormCode = false;
    const jsonValueUser = { "cognito_id": localStorage.getItem('name') };
    const idTokenUser = localStorage.getItem('IdToken');
    return this.api.formVerificationCode(jsonValueUser, idTokenUser).subscribe((data: any) => {
      this.codeVerifI = data;

      if(this.codeVerifI.Mensaje) {
        //localStorage.setItem("verification", "exit");
        this.succStatus = true;
        this.succMsg = this.codeVerifI.Mensaje;
    
      } else {
          this.errorStatus = true;
          this.warnigMsg = this.codeVerifI.Mensaje;
      }
      
    });
  };

  sendDecevalApi(id_cdt: any){ 

    const jsonValueUser = { "id_cdt": id_cdt };
    const idTokenUser = localStorage.getItem('IdToken');
    return this.api.DecevalAPI(jsonValueUser, idTokenUser).subscribe((data: any) => {
      this.deceval = data;
    
      if(data) {
        window.open(this.deceval?.DECEVAL_URL, '_blank', 'location=yes,height=870,width=820,scrollbars=yes,status=yes'); 
        
      }
     
    });

  };


 
  onCodeVerification(){
    
    this.createForm();
    if (this.codeVerForm.valid) {
      this.ValidatorFormCode = false;
      const formDataValue = this.codeVerForm.value;
      const idTokenUser = localStorage.getItem('IdToken');

      return this.api.formVerificationCodeSMS(formDataValue, idTokenUser).subscribe((data: any) => {
        this.codeVerifiSMS = data;
        
        if(data){

          localStorage.setItem("verification", "exit");
          localStorage.setItem('dataAmountVisibles', JSON.stringify(data));
          this.succStatus = true;
          this.succMsg = this.codeVerifiSMS.message;  
          
          setTimeout(()=>{                         
            window.location.reload();
          }, 3000);  
        } else {
          this.errorStatus = true;
          this.warnigMsg = this.codeVerifiSMS.message;
        }
      
      });

    } else{
      console.log(this.VC_Titulo_Celular);
      this.cambioColoorErrorFroms(1, this.VC_Titulo_Celular, this.VC_Input_Celular);
      /*   this.ValidatorFormCode = true; */ //Cuando dan enviar, si es true, habilita el alert de top, pero ahora deshabilitado
      this.mensajeAlerta('Error: Lo sentimos, debes ingresar el código de verificación que llego a tu celular', '#e90707');
    }
    return;
  }


  //Si existe la verificacion en LS, el mensaje que nos indica el porque ocultamos los montos desaparecera
  checkIfVerifiactionLS(){
    if(localStorage.getItem('verification') == "exit"){
      this.msgCodeVerification = false;
    }
  }

  //Si llegan a entran a /dashboard sin tener un token, lo llevará al login
  checkLoginToken(){
    if(!localStorage.getItem('IdToken')){
      this.router.navigate(['login']);
    }
  }
  

  //Todo este código para abajo es del modal Bootstrap
  closeResult!: string;

  open(content: any) {
    this.modal.open(content, {centered: true, size: "sm", animation: true, ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-holder',}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openCDT(content: any, idCDT: any) {


    var DatosAmountvisible = JSON.parse(localStorage.getItem('dataAmountVisibles') || 'null');

    this.AmountControlVisible = true;
    let cdtsTest = DatosAmountvisible.cdts;
  
            
    for (let i = 0; i < cdtsTest.length; i++) { 

      this.nameCDTid =  DatosAmountvisible.cdts[idCDT].bank; 
      this.amountID =   DatosAmountvisible.cdts[idCDT].amount;  
      this.id_CDT_Responsive = DatosAmountvisible.cdts[idCDT].cdt_id; 
      this.dateOpenID = DatosAmountvisible.cdts[idCDT].date_open;
      this.dateExpirationnID = DatosAmountvisible.cdts[idCDT].date_expiration;
      this.roiGananciaID = DatosAmountvisible.cdts[idCDT].roi;
      this.plazoID = DatosAmountvisible.cdts[idCDT].term;
      this.rateID = DatosAmountvisible.cdts[idCDT].rate;  
    }


    this.modal.open(content, {centered: true, size: "sm", animation: true, ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-holder',}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  // Mensaje de promoción de código
  state = 'open';
  MsjPromo:boolean = true;

  changeState(){
    if (this.state == 'open') {
      this.state = 'closed';   
    }
  }


  //Convertir abreviatura de los montos
  convertNumberToShortString = (
    number: number,
    fraction: number
  ) => {
    let newValue: string = number.toString();
    if (number >= 1000) {
      const ranges = [
        { divider: 1, suffix: '' },
        { divider: 1e3, suffix: 'K' },
        { divider: 1e6, suffix: 'M' },
        { divider: 1e9, suffix: 'B' },
        { divider: 1e12, suffix: 'T' },
        { divider: 1e15, suffix: 'P' },
        { divider: 1e18, suffix: 'E' }
      ];
      //find index based on number of zeros
      const index = Math.floor(Math.abs(number).toString().length / 3);
      let numString = (number / ranges[index].divider).toFixed(fraction);
      numString =
        parseInt(numString.substring(numString.indexOf('.') + 1)) === 0
          ? Math.floor(number / ranges[index].divider).toString()
          : numString;
      newValue = numString + ranges[index].suffix;
    }
    return newValue;
  };
  

  //Para pasar el formato de fecha a letras 
  FechaLetras(dateFun: any, show: any){
    moment.locale('es');
    const date = moment(dateFun);
    const day = date.format('D');
    const month = date.format('MMMM');
    const year = date.format('YYYY');

    if (show == 1) {return day;}
    if (show == 2) {return month;}
    if (show == 3) {return year;}

    return;
  }

  //Funcion para obtener las ganancias total del cdt
  gananciasRoi(amount: any, roi: any){
    const valueRoi = parseInt(roi) - parseInt(amount);
    return valueRoi;
  }

  //Función para separador de miles
  separadorMiles(value: any) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");;
  } 

}

//Manerá rápido para insertar script de iconos
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = "https://kit.fontawesome.com/749fcedd58.js";
document.body.appendChild(script); 



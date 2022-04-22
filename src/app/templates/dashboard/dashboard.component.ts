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
import { NgOtpInputComponent, NgOtpInputConfig } from 'ng-otp-input';

import {  BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import { ChartData, ChartOptions } from 'chart.js';
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

  
  GraficaGanancias:any = "545.000";
  GraficaGananciaFinal:any = "3.000.000";
  monto:string = "";
  salesData: ChartData = {
  
    labels: ['21/May/21', 'Hoy, 20/Abr/22', 'Final, 21/May/22'],
    datasets: [ 
      { 
        label: '',
        montoGanancia: '',
        montoFinal: '',
        data: [27000000], 
        tension: 0.5, 
      },
      
      { 
        label: 'Ganancias Hoy', 
        montoGanancia: 'Hasta el día de hoy has ganado: '+this.GraficaGanancias+'',
        montoFinal: '',
        data: [30000000, 31000000], 
        tension: 0.5
      },

      { 
        label: 'Ganancia final', 
        fill: false,
        montoGanancia: '',
        montoFinal: 'Ganancia Final: '+this.GraficaGananciaFinal+'', 
        data: [30000000, 31000000 , 33000000], 
        tension: 0.5, 
      }
      
      
    ]
  };

  chartOptions: ChartOptions = {
    responsive: true, 
    plugins: {
      title: {
        display: true,
        text: 'Así va tu inversión a hoy',
        color: '#142cb1',
      },
      tooltip: {
          callbacks: {
              label: function(tooltipItem) {
                  return tooltipItem.dataset.montoGanancia + "" + tooltipItem.dataset.montoFinal + "";
              }
          },
          caretSize: 2,
          backgroundColor: '#142cb1',
          titleColor: 'white',
          titleFont: {weight: 'bold'},
      },

    }
  };

  codeVerForm!: FormGroup;
  valueHiddenAmount: any = "********";
  moment: any = moment; 
  fechaActual = moment();
 
  
  VersionDesktop: any; // Versión de Desktop declaradas como Any (Cualquier tipo de dato)
  VersionMobile: any; // Versión de Mobile 
  otp?: string;
  showOtpComponent = true;
  @ViewChild(NgOtpInputComponent, { static: false}) ngOtpInput?:NgOtpInputComponent;

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
  }
  //Inicializador
  ngOnInit(): void {  

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


  }

  CodigoFinal(otp: string) {
    this.otp = otp;
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

  /* Configuración de Codigo de 6 digitos */
  config :NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputClass: 'sms_digit fw-bold mt-4 sms_digit_dashboard'
  };

}

//Manerá rápido para insertar script de iconos
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = "https://kit.fontawesome.com/749fcedd58.js";
document.body.appendChild(script); 



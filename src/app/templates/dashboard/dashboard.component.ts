import { Title } from '@angular/platform-browser';
import { Component, OnInit, Input, ViewChild, ElementRef, ViewChildren, Renderer2} from '@angular/core';
import { LoginService } from '../../services/api/login.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router} from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient} from '@angular/common/http';
import { NgOtpInputComponent, NgOtpInputConfig } from 'ng-otp-input';
import {  BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import * as moment from 'moment';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: [
    "./dashboard.component.css",
    "./css/font-family-openSans.css",
    "./css/dashboard.compoenent.responsive.css",
  ],
  animations: [
    trigger("widthGrow", [
      state(
        "open",
        style({
          opacity: "",
        })
      ),
      state(
        "closed",
        style({
          opacity: "0",
          marginTop: "-8%",
        })
      ),
      transition("* => *", animate(580)),
    ]),
  ],
})
export class DashboardComponent implements OnInit {
  monto: string = "";
  valueHiddenAmount: any = "********";
  moment: any = moment;
  fechaActual = moment();
  VersionDesktop: any; // Versión de Desktop declaradas como Any (Cualquier tipo de dato)
  VersionMobile: any; // Versión de Mobile
  otp?: string;
  showOtpComponent = true;
  @ViewChild(NgOtpInputComponent, { static: false })
  ngOtpInput?: NgOtpInputComponent;

  /* Info Api*/
  nombreUsuario: any = "";
  totalInvertido: number = 0;
  celularUsuario: any;
  totalCDTS: number = 0;
  nivelUsuario: any;
  puntajeUsuario: any;
  NgForCDTS: any;
  controlMontos = false;
  errorAPI = false;
  MensajeError: any;
  okAPI = false;
  MensajeOk: any;
  jsonInfoApi: any;
  InformacionCodigo = true;
  Grafica = false;
  constructor(
    private router: Router,
    private modal: NgbModal,
    public fb: FormBuilder,
    private http: HttpClient,
    public api: LoginService,
    public breakpointObserver: BreakpointObserver,
    private title: Title,
  ) {}
  //Inicializador
  ngOnInit(): void {
    this.breakpointObserver
      .observe(["(min-width: 480px)"])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          //Entonces si el width es superior a 480px, será la versión Desktop mostrando su propio diseño
          this.VersionDesktop = true;
          this.VersionMobile = false;
        } else {
          //Entonces si el width es inferio a 480px, será la versión Mobile mostrando su propio diseño
          this.VersionDesktop = false;
          this.VersionMobile = true;
        }
      });

    this.infoUserAPI();

    if (!localStorage.getItem("IdToken")) {
      this.router.navigate(["login"]);
    }

    if (localStorage.getItem("codigoVerificado") == "true") {
      this.InformacionCodigo = false;
    }
  }
  
  OcultarGrafica(cdtID: any){
    var graficaCDT = document.querySelector("#infoCDT_" + cdtID + "");
    graficaCDT!.setAttribute("style", "display:none;");
  }

  GraficaInfo(cdtID: any) {
    var graficaCDT = document.querySelector("#infoCDT_" + cdtID + "");
    graficaCDT!.setAttribute("style", "display:flex;");

    if (this.Grafica == true) {
      let date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let fechaHoy = `${year}-0${month}-${day}`;
      const dataInfo = JSON.parse(localStorage.getItem("data-info") || "null");
      const fechaInicioCDT = new Date(dataInfo.cdts[cdtID].date_open).getTime();
      const fechaActualHoy = new Date(fechaHoy).getTime();
      const diff = fechaActualHoy - fechaInicioCDT;
      const totalDias = diff / (1000 * 60 * 60 * 24);
      const plazoDiaCDT = dataInfo.cdts[cdtID].term;
      const obtenerPorcentaje = (100 / plazoDiaCDT) * totalDias;
      const inversionFinal = dataInfo.cdts[cdtID].roi;
      const InversionInicial = dataInfo.cdts[cdtID].amount;
      const pendiente = (inversionFinal - InversionInicial) / plazoDiaCDT;
      const gananciaHoy = pendiente * totalDias + InversionInicial;
      const gananciaHoyOPT = Math.trunc(gananciaHoy).toLocaleString("es-CO");
      const canvas = <HTMLCanvasElement>document.querySelector("#grafica_cdt_"+cdtID+" #linea1"); 
      const ctx = canvas.getContext('2d'); 
      document.querySelector("#grafica_cdt_" + cdtID + " .gananciaHoy")!.innerHTML = "$" + gananciaHoyOPT;
      document .querySelector("#grafica_cdt_" + cdtID + " #line-date")!.setAttribute("style", "width:" + obtenerPorcentaje + "%; height:" + obtenerPorcentaje + "%");       
      
      if (ctx) { 
        ctx.lineWidth = .5; 
        ctx.strokeStyle = "#142cb1"; 
        ctx.beginPath(); 
        ctx.moveTo(0, 150); 
        ctx.lineTo(450, -75); 
        ctx.stroke(); 
      }
    } 
  }

  infoUserAPI() {
    if (localStorage.getItem("codigoVerificado") == "true") {
      this.jsonInfoApi = {
        cognito_id: localStorage.getItem("name"),
        sns_code: localStorage.getItem("sms_code"),
      };
    } else {
      this.jsonInfoApi = {
        cognito_id: localStorage.getItem("name"),
      };
    }

    const idTokenUser = localStorage.getItem("IdToken");
    return this.api
      .getUserInfo(this.jsonInfoApi, idTokenUser)
      .subscribe((data: any) => {
        if (localStorage.getItem("codigoVerificado") == "true") {
          this.controlMontos = true;
          this.Grafica = true;
          localStorage.setItem("data-info", JSON.stringify(data));
          for (let i = 0; i < data.cdts.length; i++) {
            this.totalInvertido += data.cdts[i].amount;
          }
        }
        this.nombreUsuario = data.fullname;
        this.celularUsuario = data.phone;
        this.nivelUsuario = data.level;
        this.puntajeUsuario = data.score;
        this.NgForCDTS = data.cdts;

        //Mapeamos el arreglo de CDT dentro del JSON para buscar cuantos "cdt's" hay
        data.cdts.map((dato: any) => {
          if (dato.bank) {
            this.totalCDTS += 1;
          }
        });
      });
  }

  EnviarCodigoVerificacion() {
    const jsonValueUser = { cognito_id: localStorage.getItem("name") };
    const idTokenUser = localStorage.getItem("IdToken");
    return this.api
      .SegundoPlanoCodigoVerificado(jsonValueUser, idTokenUser)
      .subscribe((data: any) => {
        if (data.Mensaje) {
          this.okAPI = true;
          this.MensajeOk = data.Mensaje;
        } else {
          this.errorAPI = true;
          this.MensajeError = data.Mensaje;
        }
      });
  }

  VerificarCodigo() {
    const lengthCelular = this.otp?.length;
    if (lengthCelular == 6) {
      const DATA_API = {
        cognito_id: localStorage.getItem("name"),
        sns_code: String(this.otp),
      };
      const idTokenUser = localStorage.getItem("IdToken");
      return this.api
        .SegundoPlanoCodigoVerificado(DATA_API, idTokenUser)
        .subscribe((data: any) => {
          if (data) {
            localStorage.setItem("codigoVerificado", "true");
            localStorage.setItem("sms_code", String(this.otp));

            this.MensajeOk = "Validación Correcta";

            setTimeout(() => {
              this.router.navigate(["login"]);
            }, 3000);
          } else {
            this.errorAPI = true;
            this.MensajeError = data.message;
          }
        });
    } else {
      this.errorAPI = true;
      this.MensajeError = "El código esta incompleto, revisalo";
    }

    return;
  }

  CodigoFinal(otp: string) {
    this.otp = otp;
  }

  //Todo este código para abajo es del modal Bootstrap
  closeResult!: string;

  open(content: any) {
    this.modal
      .open(content, {
        centered: true,
        size: "sm",
        animation: true,
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-holder",
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  openCDT(content: any, idCDT: any) {
    this.modal
      .open(content, {
        centered: true,
        size: "sm",
        animation: true,
        ariaLabelledBy: "modal-basic-title",
        windowClass: "modal-holder",
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  // Mensaje de promoción de código
  state = "open";
  MsjPromo: boolean = true;

  changeState() {
    if (this.state == "open") {
      this.state = "closed";
    }
  }

  //Convertir abreviatura de los montos
  convertNumberToShortString = (number: number, fraction: number) => {
    let newValue: string = number.toString();
    if (number >= 1000) {
      const ranges = [
        { divider: 1, suffix: "" },
        { divider: 1e3, suffix: "K" },
        { divider: 1e6, suffix: "M" },
        { divider: 1e9, suffix: "B" },
        { divider: 1e12, suffix: "T" },
        { divider: 1e15, suffix: "P" },
        { divider: 1e18, suffix: "E" },
      ];
      //find index based on number of zeros
      const index = Math.floor(Math.abs(number).toString().length / 3);
      let numString = (number / ranges[index].divider).toFixed(fraction);
      numString =
        parseInt(numString.substring(numString.indexOf(".") + 1)) === 0
          ? Math.floor(number / ranges[index].divider).toString()
          : numString;
      newValue = numString + ranges[index].suffix;
    }
    return newValue;
  };

  //Para pasar el formato de fecha a letras
  FechaLetras(dateFun: any, show: any) {
    moment.locale("es");
    const date = moment(dateFun);
    const day = date.format("D");
    const month = date.format("MMMM");
    const year = date.format("YYYY");

    if (show == 1) {
      return day;
    }
    if (show == 2) {
      return month;
    }
    if (show == 3) {
      return year;
    }

    return;
  }

  //Funcion para obtener las ganancias total del cdt
  gananciasRoi(amount: any, roi: any) {
    const valueRoi = parseInt(roi) - parseInt(amount);
    return valueRoi;
  }

  //Función para separador de miles
  separadorMiles(value: any) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  /* Configuración de Codigo de 6 digitos */
  config: NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: "",
    inputClass: "sms_digit fw-bold mt-4 sms_digit_dashboard",
  };
}

//Manerá rápido para insertar script de iconos
var script = document.createElement("script");
script.type = "text/javascript";
script.src = "https://kit.fontawesome.com/749fcedd58.js";
document.body.appendChild(script);

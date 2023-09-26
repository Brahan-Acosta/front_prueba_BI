import { TableroService } from './tableros/tablero.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PowerBIReportEmbedComponent } from 'powerbi-client-angular';
import { IReportEmbedConfiguration, models, service, Embed } from 'powerbi-client';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'prueba-BI';
  tableVista: boolean = false;
  dataTable: any=[];
  dynamicHeight: number = 600;
  trueWork: boolean = false;
  trueWorkFalse: boolean=false;

  // Formulario reactivo
  form: FormGroup = this.fb.group({
    token: ['', Validators.required],
    rol:['', Validators.required],
    tablero:['', Validators.required]
  });


  reportConfig: IReportEmbedConfiguration = {
    type: 'report',
    embedUrl: '',
    tokenType: models.TokenType.Embed,
    accessToken: '',
    settings: undefined,
  };
  @ViewChild(PowerBIReportEmbedComponent)
  reportObj!: PowerBIReportEmbedComponent;
  eventHandlersMap = new Map([
    [
      'loaded',
      () => {
        const report = this.reportObj.getReport();
        report.setComponentTitle('Embedded report');
      },
    ],
    ['rendered', () => console.log('Report has rendered')],
    [
      'error',
      (event?: service.ICustomEvent<any>) => {
        if (event) {
          console.error(event.detail);
        }
      },
    ],
    ['visualClicked', () => console.log('visual clicked')],
    ['pageChanged', (event) => ''],
  ]) as Map<
    string,
    (event?: service.ICustomEvent<any>, embeddedEntity?: Embed) => void | null
  >;



  constructor(private servicesTableros: TableroService, private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  buscar(){
    if(this.form.valid){

      const key = CryptoJS.enc.Utf8.parse('analytics*123546'); // Clave de 16 caracteres para AES-128

      // Convertir el texto a encriptar a formato WordArray
      const textoAEncriptarToken = String(this.form.value.token);

      // Convertir el texto a encriptar a formato WordArray
      const textoAEncriptarTablero = String(this.form.value.rol);

      // Convertir el texto a encriptar a formato WordArray
      const textoAEncriptarRol = String(this.form.value.tablero);


     const textoEncriptado1 = CryptoJS.AES.encrypt(textoAEncriptarToken, key, {iv:key}).toString();
     const textoEncriptado2 = CryptoJS.AES.encrypt(textoAEncriptarTablero, key, {iv:key}).toString();
     const textoEncriptado3 = CryptoJS.AES.encrypt(textoAEncriptarRol, key, {iv:key}).toString();


      const data = {
        workspaceToken: textoEncriptado1,
        nombreRol: textoEncriptado2,
        tableroToken: textoEncriptado3
      }
      this.servicesTableros.getListTableros(data).toPromise().then(resp => {
        if(resp.result == '00'){
          this.trueWork = true;
          this.trueWorkFalse = false;
          this.embedReport(resp.data)
        }else{
          this.trueWork = false;
          this.trueWorkFalse = true;
        }
      });
    }else{
      this.form.markAllAsTouched();
    }
  }


  embedReport(data:any){
    this.reportConfig = {
       ...this.reportConfig,
        accessToken: data.tokenAcceso,
        id: data.idReporte,
        embedUrl: data.url,
     };
 }
}

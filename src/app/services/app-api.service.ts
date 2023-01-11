import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare const window: any;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class AppApiService {
  UserName: string = '';
  DisplayName: string = '';

  private _DatosUsuario: any = {};

  constructor(private http: HttpClient) {
    console.log('**JinterCo Services Works**');

    this._DatosUsuario = window['DatosUsuario'];

    console.log(this._DatosUsuario, 'DatosUsuario');
  }

  callPost = (
    endpoint: string,
    params: any = '',
    controller: string = 'call'
  ) => {
    console.log(params, '***params/postQuery/ApiServices' + endpoint);
    const url = `https://www.tasklever.com/desktopmodules/TL_ServidorDeApis/api/${controller}/${endpoint}`;
    return this.http.post(url, params, httpOptions);
  };

  getUsuario() {
    return this._DatosUsuario;
  }

  getQuery(query: string, controller: string = 'call') {
    const url = `https://www.tasklever.com/desktopmodules/TL_ServidorDeApis/api/${controller}/${query}`;
    return this.http.get(url);
  }

  getClients(id: number, idest: string) {
    return this.getQuery(`ObtenerClientes?id=${id}&idest=${idest}`);
  }

  ObtenerClientesConfir(id: number, idest: string) {
    return this.getQuery(`ObtenerClientesConfir?id=${id}&idest=${idest}`);
  }

  ObtenerUsuarios(rol: string, blanco: boolean = true) {
    return this.getQuery(`ObtenerUsuarios?rol=${rol}&blanco=${blanco}`);
  }

  GetCountries() {
    return this.getQuery(`ObtenerPaises`);
  }

  ObtenerObras(id: number, idest: string) {
    return this.getQuery(`ObtenerObras?id=${id}&idest=${idest}`);
  }

  ObtenerObrasClienteConfirmadas(id_cliente: number) {
    return this.getQuery(
      `ObtenerObrasClienteConfirmadas?id_cliente=${id_cliente}&skipSeparatorDate=false&excluirDadosDeBaja=true&desdeRecaudos=true`
    );
  }

  ObtenerConfirmacionesAgrup(id: number) {
    return this.getQuery(`ObtenerConfirmacionesAgrup?id=${id}`);
  }

  GetClientProject(id_cliente: number) {
    return this.getQuery(`ObtenerObrasCliente?id_cliente=${id_cliente}`);
  }

  GetProspects(
    id: number,
    idest: string,
    uFecha: boolean,
    fIni: string,
    fFin: string,
    asignadosAMi: boolean
  ) {
    let vUser = asignadosAMi ? this._DatosUsuario.UserName : '';

    console.log('GetProspects/idest:' + idest);
    console.log('GetProspects/vUser:' + vUser);
    return this.getQuery(
      `ObtenerProspectos?id=${id}&idest=${idest}&uFecha=${uFecha}&fIni=${fIni}&fFin=${fFin}&User=${vUser}`
    );
  }

  ObtenerDocumentosCliente(id_cliente: number) {
    return this.getQuery(`ObtenerDocumentosCliente?id_cliente=${id_cliente}`);
  }
}

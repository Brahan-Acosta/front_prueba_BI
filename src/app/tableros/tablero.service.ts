import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableroService {

  constructor(private http: HttpClient, private cs: ConfigService) { }

  /*SERVICIO LISTA PARA TABLEROS*/
  getListTableros(data:any): Observable<any> {
    return this.http.post<any>(`${this.cs.base}api/Tableros/Filtros`,data);
  }
}

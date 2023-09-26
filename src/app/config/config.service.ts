import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  base = environment.apiEndPoint;

  public URLactual = window.location.href;
  private httpClient: HttpClient;

  constructor(private handler:HttpBackend) {
    this.httpClient = new HttpClient(handler);
  }

  static ConfiSettings:any;

  load() {
    const jsonFile = `${environment.configuration}.json`;
    return new Promise<void>((resolve, reject) => {
        this.httpClient.get(jsonFile).toPromise().then((response) => {
            ConfigService.ConfiSettings = response ;
            resolve();
        }).catch((response: any) => {
            reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
        });
    });
  }
}

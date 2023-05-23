import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CrudService {
  private api: string = "https://crupcpi-default-rtdb.firebaseio.com/";
  constructor(
    private http: HttpClient
  ) { }

  Data() {
    return this.http.get(`${this.api}usuarios.json`);
  }

  addData(usuario: string, password: string, estado: number = 0) {
    if (estado != 1) {
      estado = 0;
    }
    const usuarios = {
      usuario: usuario,
      password: password,
      estado: estado
    }
    return this.http.post(`${this.api}usuarios.json`, usuarios);
  }

  getData(id: any) {
    return this.http.get(`${this.api}usuarios/${id}.json`);
  }

  update(id:any,usuario: string, password: string, estado: number = 0){
    if (estado != 1) {
      estado = 0;
    }
    const usuarios = {
      usuario: usuario,
      password: password,
      estado: estado
    }
    return this.http.put(`${this.api}usuarios/${id}.json`,usuarios);
  }

  delete(id:any){
    return this.http.delete(`${this.api}usuarios/${id}.json`);
  }
}
1

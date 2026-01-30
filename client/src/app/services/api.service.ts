import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root' 
})
export class ApiService {

  protected readonly apiUrl = 'http://localhost:3000/api';
  protected http = inject(HttpClient);
}

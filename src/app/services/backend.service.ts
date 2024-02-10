import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiURL } from '../models/config'

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  apiURL = apiURL;

  loggedIn: boolean = false;
  loggedInUser !: any;

  constructor(private http: HttpClient) { }

  registerUser(userData: any) {
    return this.http.post(`${this.apiURL}/registerUser`, userData);
  }

  loginIser(userCreds: any) {
    return this.http.post(`${this.apiURL}/loginUser`, userCreds);
  }

  addDevice(deviceData: any) {
    return this.http.post(`${this.apiURL}/addDevice`, deviceData);
  }

  getDevices(userName: any) {
    return this.http.get(`${this.apiURL}/getDevices/${userName}`);
  }

  updateTemp(deviceData: any) {
    return this.http.post(`${this.apiURL}/updateTemp`, deviceData);
  }

  sendMail(mail: any) {
    return this.http.post(`${this.apiURL}/sendMail`, mail);
  }
}

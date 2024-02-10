import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { WebsocketService } from '../../services/websocket.service';
import { BackendService } from '../../services/backend.service';
import { MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  roomName!: any;
  deviceId!: any;

  loggedInUser!: any;

  barChartType: ChartType = 'bar';
  lineChartType: ChartType = 'line';
  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  deviceRoomMap: any = [];
  data: any = [{ data: [], label: 'Data' }];
  label: any = [];
  client!: any;

  constructor(
    private socketService: WebsocketService,
    public service: BackendService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    if (this.service.loggedIn) this.loggedInUser = this.service.loggedInUser;
    this.getDevices();
    this.socketService
      .listen('chat')
      .subscribe((data: any) => this.updateChart(data));
  }

  updateChart(input: any) {
    if (!input) return;
    if (this.deviceRoomMap.length === 0) return;
    input = this.dataFormater(input.message);
    let incomingDeviceId = input.deviceId,
      incomingTemp = input['J01'];

    let deviceIndex = this.deviceRoomMap.findIndex(
      (obj: any) => obj.deviceID === incomingDeviceId
    );

    let curDevice = this.deviceRoomMap.find(
      (obj: any) => obj.deviceID === incomingDeviceId
    );
    let roomName = curDevice?.roomName;

    this.data[deviceIndex].data.push(incomingTemp);
    this.label.push(this.getCurrentTime());

    this.label = [...this.label];
    this.data[deviceIndex].data = [...this.data[deviceIndex].data];

    let req = { deviceID: incomingDeviceId, data: incomingTemp };
    this.service.updateTemp(req).subscribe({ next: (response: any) => {} });
  }

  getDevices() {
    this.label = [];
    this.data = [];
    this.deviceRoomMap = [];
    this.service.getDevices(this.loggedInUser.userID).subscribe({
      next: (response: any) => {
        if (response.successFlag) {
          let maxLabelLength = -1;

          let data = response.data;
          data.forEach((item: any) => {
            this.data.push({ data: [], label: item.roomName });
            this.deviceRoomMap.push({
              deviceID: item.deviceID,
              roomName: item.roomName,
            });

            let deviceIndex = this.deviceRoomMap.findIndex(
              (obj: any) => obj.deviceID === item.deviceID
            );

            if (item.data) {
              let todayData = item.data.find(
                (dateData: any) => dateData.date === this.getCurrentDate()
              );

              if (todayData) {
                let dataValues = todayData?.data.map((row: any) => row.value);
                this.data[deviceIndex].data = dataValues;
                if (maxLabelLength < dataValues?.length) {
                  maxLabelLength = dataValues?.length;
                  this.label = todayData?.data.map((row: any) => row.time);
                }               
              }
              
              this.label = [...this.label];           
              this.data[deviceIndex].data = [...this.data[deviceIndex].data];
            }
          });
        }
      },
      error: (error: any) => {
        this.openSnackBar('No Devices available', 'Close');
      },
    });
  }

  addDevice() {
    let req = {
      deviceID: this.deviceId,
      roomName: this.roomName,
      userID: this.loggedInUser.userID,
    };
    this.deviceId = '';
    this.roomName = '';
    this.service.addDevice(req).subscribe({
      next: (response: any) => {
        if (response.successFlag) {
          this.openSnackBar('Device Added', 'Close');
        }
        this.getDevices();
      },
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 3000 });
  }

  dataFormater(data: any) {
    return JSON.parse(data.replace(/'/g, '"'));
  }

  getCurrentTime() {
    let currentDate = new Date();

    let hours: any = currentDate.getHours();
    let minutes: any = currentDate.getMinutes();
    let seconds: any = currentDate.getSeconds();

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    let currentTime = hours + ':' + minutes + ':' + seconds;
    return String(currentTime);
  }

  getCurrentDate() {
    let today: any = new Date();
    let yyyy: any = today.getFullYear();
    let mm: any = today.getMonth() + 1; // Months start at 0!
    let dd: any = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    let formattedToday = dd + '-' + mm + '-' + yyyy;

    return formattedToday;
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { SorterService } from '../core/services/sorter.service';
import { FilterService } from '../core/services/filter.service';
import { IOrders, IMonitoring } from '../shared/interfaces';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from './customValidators';
import { NgbActiveModal, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import 'rxjs';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  //technicians = ['--select--','user2','user5','user6'];
  roles = ['--select--', 'Traffic Controller', 'Technician'];
  naviera = ['--select--', 'MSC', 'MSK', 'APL', 'CMA-CGM', 'YANG-MING', 'C-6', 'C-7', 'C-8'];
  referType = ['--select--', 'Atmosfera Controlada', 'Cold Treatment', 'Normal', 'Super Freezer'];
  malfunctions = ['--select--', '116 PROBE ERRO RETURN', '117 PROBE ERROR SUPPLY RET AIR SENSOR OPEN CIRCUIT', 'PROBE ERROR', 'RETURN AIR TEMPERATURE SENSOR INVALID', 'SUPPLY AIR TEMPERATURE SENSOR 2 INVALID', 'EVAPORATOR TEMPERATURE SENSOR INVALID', 'AMBIENT TEMPERATURE SENSOR INVALID', 'SUPPLY AIR TEMPERATURE ERROR', 'COMPRESSOR SUCTION PRESSURE TRANSMITTER INVALID', 'PHASE DIRECTION NOT DETECTABLE', 'BAD POWER SUPPLY STAR COOL U/F RATIO',
    'FC MISSING', 'AA508 STARCOOL FC SHORT CIRCUIT', 'FC EARTH FAULT ALARM', 'STARTCOOL FC OVERLOAD', 'IN RANGE FAULT', 'STARTCOOL HIGH PRESSURE'];
  portTerminal = ['--select--', 'PPC', 'BLB', 'PPC', 'CRT', 'PSA', 'MIT', 'VACAMONTE', 'CCT', 'CP1-CARNES DE COCLE', 'CP2- ZANGUENGA', 'RESCATE'];
  optionSelected: any;
  filteredOrders: IOrders[] = [];
  filteredMonitoringData: IMonitoring[] = [];
  showDeleteModal = false;
  sortType = 'createdOn';
  sortReverse = false;
  isAdded = false;
  isAddedTech = false;
  cannotMove = false;
  ongoing = false;
  monitoring = false;
  pending = true;
  isAddedMonitor = false;
  showNew: boolean = true;
  showInProgress: boolean = false;
  showReports: boolean = false;
  closeResult: string;
  cnum = '';
  toBeDeleted = '';
  toBeEdited = '';
  baseUrl = "http://localhost:3000"; //https://easy-json-server.herokuapp.com

  constructor(private http: Http, private sorterService: SorterService,
    private filterService: FilterService, private modalService: NgbModal) { }

  requestTime = { hour: 0, minute: 0 };
  requestTimeForm = new FormGroup({
    reqTime: new FormControl()
  });

  orderDataForm = new FormGroup({
    containerNumber: new FormControl('', [Validators.required,
    Validators.pattern("[a-zA-z]{4}[0-9]{7}$")]),
    navieraSelected: new FormControl('', Validators.required),
    referSelected: new FormControl('', Validators.required),
    malfunctionSelected: new FormControl('', Validators.required),
    portTerminalSelected: new FormControl('', Validators.required),
    requestDate: new FormControl('', Validators.required),
    vesselIn: new FormControl('', Validators.required),
    vesselOut: new FormControl('', Validators.required),
    portOfLoading: new FormControl('', Validators.required),
    technicianSelected: new FormControl('', Validators.required),
  });


  registerForm = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required)
  });


  onGoingObj: any;
  orders: any;
  monitoringData: any;
  results = [];

  displayNew = function () {
    this.requestTimeForm.controls['reqTime'].setValue(this.requestTime, { onlySelf: true });
    this.showNew = true;
    this.showInProgress = false;
    this.showReports = false;
  }

  displayInProgress = function () {
    this.showNew = false;
    this.showInProgress = true;
    this.showReports = false;
    this.ngOnInit();
  }

  displayReports = function () {
    this.showNew = false;
    this.showInProgress = false;
    this.showReports = true;
    //this.Pending();
    this.ngOnInit();
  }


  ngOnInit() {
    this.fetchOrders();
    //this.fetchReports();
    this.fetchMonitoring();
    this.clearData();
    this.fetchUsers();
  }

  sort(prop: string) {
    this.sortType = prop;
    this.sortReverse = !this.sortReverse;
    if (this.pending === true) {
      this.sorterService.sort(this.orders, prop);
    }
    else if (this.ongoing === true) {
      this.sorterService.sort(this.monitoringData, prop);
    }
    else if (this.showReports === true) {
      this.sorterService.sort(this.monitoringData, prop);
    }
  }

  filterChanged(data: string) {
    if (this.pending === true) {
      if (data && this.orders) {
        data = data.toUpperCase();
        const props = ['containerNumber', 'naviera', 'referType', 'malfunction', 'portTerminal', 'requestTime', 'portOfLoading', 'technician'];
        this.filteredOrders = this.filterService.filter<IOrders>(this.orders, data, props);
        //console.log(this.filteredOrders);
      } else {
        this.filteredOrders = this.orders;
      }
    }

    if (this.ongoing === true) {
      if (data && this.monitoringData) {
        data = data.toUpperCase();
        const props = ['containerNumber', 'naviera', 'referType', 'malfunction', 'portTerminal', 'requestTime', 'portOfLoading', 'technician'];
        this.filteredMonitoringData = this.filterService.filter<IMonitoring>(this.monitoringData, data, props);
        //console.log(this.filteredOrders);
      } else {
        this.filteredMonitoringData = this.monitoringData;
      }
    }

    if (this.showReports === true) {
      if (data && this.monitoringData) {
        data = data.toUpperCase();
        const props = ['containerNumber', 'naviera', 'referType', 'malfunction', 'portTerminal', 'requestTime', 'portOfLoading', 'technician'];
        this.filteredMonitoringData = this.filterService.filter<IMonitoring>(this.monitoringData, data, props);
        //console.log(this.filteredOrders);
      } else {
        this.filteredMonitoringData = this.monitoringData;
      }
    }

  }


  fetchUsers  =  function () {
    this.http.get(this.baseUrl + "/users").subscribe(
      (res:  Response)  =>  {
        this.technicians  =  res.json();
      }
    )
  }


  fetchOrders = function () {
    this.http.get(this.baseUrl + "/orders").subscribe(
      (res: Response) => {
        this.orders = res.json();
        // sort by created on
        this.filteredOrders = this.orders.sort(function (a, b) {
          var createdOnA = a.createdOn; // ignore upper and lowercase
          var createdOnB = b.createdOn; // ignore upper and lowercase
          if (createdOnA < createdOnB) {
            return 1;
          }
          if (createdOnA > createdOnB) {
            return -1;
          }
          return 0;
        });
      }
    )
  }

  fetchMonitoring = function () {
    this.http.get(this.baseUrl + "/monitoring").subscribe(
      (res: Response) => {
        this.monitoringData = res.json();
        this.filteredMonitoringData = this.monitoringData.sort(function (a, b) {
          var createdOnA = a.createdOn; // ignore upper and lowercase
          var createdOnB = b.createdOn; // ignore upper and lowercase
          if (createdOnA < createdOnB) {
            return 1;
          }
          if (createdOnA > createdOnB) {
            return -1;
          }
          return 0;
        });
      }
    )
  }

  fetchReports = function () {
    this.http.get(this.baseUrl + "/reports").subscribe(
      (res: Response) => {
        this.reports = res.json();
      }
    )
  }

  deleteContainer() {
    console.log("--->", this.toBeDeleted);
    const url = `${this.baseUrl + "/orders"}/${this.toBeDeleted}`;
    return this.http.delete(url, { headers: this.headers }).toPromise()
      .then(() => {
        this.ngOnInit();
        this.modalService.dismissAll('Cross click');
      })
  }


  createContainer1: boolean = false;
  createContainer = function () {
    this.createContainer1 = true;
  }

  assignTechnician = function () {
    console.log("ongoingobj  : ", this.onGoingObj);
    this.http.post(this.baseUrl + "/monitoring", this.onGoingObj).subscribe((res: Response) => {
      this.isAddedTech = true;
    },
      (res: Response) => {
        this.isAddedTech = false;
        this.cannotMove = true;
      })
  }


  assignMonitoring = function () {
    this.isAddedMonitor = true;
  }

  Pending = function () {
    document.getElementById("ongoing").classList.remove('menu-sub-active');
    document.getElementById("pending").classList.add('menu-sub-active');
    this.pending = true;
    this.ongoing = false;
    this.ngOnInit();
  }

  onGoing = function () {
    document.getElementById("pending").classList.remove('menu-sub-active');
    document.getElementById("ongoing").classList.add('menu-sub-active');
    this.ongoing = true;
    this.pending = false;
    this.isAddedTech = false;
    this.ngOnInit();
  }

  Monitoring = function () {
    this.monitoring = true;
  }

  openRegisterSuccessModal(content4) {
    this.modalService.open(content4, { ariaLabelledBy: 'modal-register-success' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  registerUser = function (content4, d) {
    this.newUserObj = {
      "id": Math.random().toString,
      "userName": d.userName,
      "password": d.password,
      "designation": d.role
    }
    console.log("obj  : ", this.newUserObj);
    this.http.post(this.baseUrl + "/users", this.newUserObj).subscribe((res: Response) => {
      this.modalService.dismissAll('Cross click');
      this.openRegisterSuccessModal(content4);
    })
  }





  addNewContainer = function (c) {
    this.orderObj = {
      "id": Math.random().toString,
      "containerNumber": c.containerNumber,
      "naviera": c.navieraSelected,
      "referType": c.referSelected,
      "malfunction": c.malfunctionSelected,
      "portTerminal": c.portTerminalSelected,
      "requestDate": c.requestDate, //c.requestDate 23/09/2018
      "requestTime": this.requestTimeForm.controls.reqTime.value, //c.requestTime
      "vesselIn": c.vesselIn,
      "vesselOut": c.vesselOut,
      "portOfLoading": c.portOfLoading,
      "technician": c.technicianSelected,
      "userId":this.userId,
      "createdOn": new Date().getTime()
    }
    console.log("name :"+c.t);
    console.log("nww :"+this.t);
    console.log("obj  : ", this.orderObj);
    /* this.http.post(this.baseUrl + "/orders", this.orderObj).subscribe((res: Response) => {
      this.isAdded = true;
    }) */
  }

userId:String="";

setNewUser(id): void {
    this.userId=id;    
    console.log("id : "+this.userId);    
}

onInputTechnician(value) { 
  console.log("d "+value);
  } 

  checkOneByOne = function (o) {
    this.onGoingObj = o;
  }


  openDeleteModal(content, o) {
    this.cnum = o.containerNumber;
    this.toBeDeleted = o.id;
    this.modalService.open(content, { ariaLabelledBy: 'modal-delete' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  updateContainer = function (content2) {
    //console.log("data : "+this.editNavieraForm.controls.mNaviera.value)
    this.orderObj = {
      "id": this.toBeEdited,
      "containerNumber": this.EcontainerNumber,
      "naviera": this.editNavieraForm.controls.mNaviera.value,
      "referType": this.editReeferForm.controls.mReefer.value,
      "malfunction": this.editMalfunctionsForm.controls.mMalfunction.value,
      "portTerminal": this.editPortTerminalForm.controls.mPortTerminal.value,
      "requestDate": this.editDateForm.controls.mRequestDate.value, //c.requestDate 23/09/2018
      "requestTime": this.editTimeForm.controls.mRequestTime.value, //c.requestTime 12:20
      "vesselIn": this.EvesselIn,
      "vesselOut": this.EvesselOut,
      "portOfLoading": this.EportOfLoading,
      "technician": this.editTechnicianForm.controls.mTechnician.value,
      "createdOn": new Date().getTime()
    }
    //console.log("con obj  : ",this.orderObj);
    const url = `${this.baseUrl + "/orders"}/${this.toBeEdited}`;
    this.http.put(url, JSON.stringify(this.orderObj), { headers: this.headers })
      .toPromise()
      .then(() => {
        this.ngOnInit();
        this.modalService.dismissAll('Cross click');
        this.openEditSuccessModal(content2);
      })
  }


  openEditModal = function (content1, o) {
    this.editNavieraForm = new FormGroup({
      mNaviera: new FormControl()
    });
    this.editReeferForm = new FormGroup({
      mReefer: new FormControl()
    });
    this.editMalfunctionsForm = new FormGroup({
      mMalfunction: new FormControl()
    });
    this.editPortTerminalForm = new FormGroup({
      mPortTerminal: new FormControl()
    });
    this.editTechnicianForm = new FormGroup({
      mTechnician: new FormControl()
    });
    this.editDateForm = new FormGroup({
      mRequestDate: new FormControl()
    });
    this.editTimeForm = new FormGroup({
      mRequestTime: new FormControl()
    });

    this.editNavieraForm.controls['mNaviera'].setValue(o.naviera, { onlySelf: true });
    this.editReeferForm.controls['mReefer'].setValue(o.referType, { onlySelf: true });
    this.editMalfunctionsForm.controls['mMalfunction'].setValue(o.malfunction, { onlySelf: true });
    this.editPortTerminalForm.controls['mPortTerminal'].setValue(o.portTerminal, { onlySelf: true });
    this.editTechnicianForm.controls['mTechnician'].setValue(o.technician, { onlySelf: true });
    this.editDateForm.controls['mRequestDate'].setValue(o.requestDate, { onlySelf: true });
    this.editTimeForm.controls['mRequestTime'].setValue(o.requestTime, { onlySelf: true });

    this.toBeEdited = o.id;
    this.EcontainerNumber = o.containerNumber
    this.Enaviera = o.naviera
    this.EreferType = o.referType
    this.Emalfunction = o.malfunction
    this.EportTerminal = o.portTerminal
    this.ErequestDate = o.requestDate
    this.ErequestTime = o.requestTime
    this.EvesselIn = o.vesselIn
    this.EvesselOut = o.vesselOut
    this.EportOfLoading = o.portOfLoading
    this.Etechnician = o.technician

    this.modalService.open(content1, { ariaLabelledBy: 'modal-edit' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openEditSuccessModal(content2) {
    this.modalService.open(content2, { ariaLabelledBy: 'modal-edit-success' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  openRegisterModal(content3) {
    this.modalService.open(content3, { ariaLabelledBy: 'modal-register' }).result.then((result) => {
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
      return `with: ${reason}`;
    }
  }



  clearData = function () {
    this.isAdded = false;
    /* this.isAddedTech=false;
    this.ongoing=false;
    this.monitoring=false;
    this.pending=true;
    this.isAddedMonitor=false;
   */
    this.navieraSelected = '';
    this.referSelected = '';
    this.malfunctionSelected = '';
    this.portTerminalSelected = '';
    this.vesselInSelected = '';
    this.vesselOutSelected = '';
    this.technicianSelected = '';

    this.results = [];
  }










  // BAR CHART
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = ['2012', '2013', '2014', '2015', '2016', '2017', '2018'];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartData: any[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Open' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Closed' }
  ];

  public barChartLabels1: string[] = ['Jan2018', 'March2018', 'May2018', 'July2018', 'Sep2018', 'Nov2018'];
  public barChartData1: any[] = [
    { data: [103, 133, 180, 81, 256, 155], label: 'Approved' },
    { data: [28, 8, 40, 19, 86, 27], label: 'Pending' }
  ];

  //LINE CHART
  lineChartData = [
    { data: [330, 600, 260, 700], label: 'Sales' },
    { data: [120, 455, 100, 340], label: 'Approval' },
    { data: [45, 67, 800, 500], label: 'Pending' }
  ];

  lineChartLabels = ['January', 'February', 'March', 'April'];

  lineColors = [
    {
      backgroundColor: '#8ec06c'
    },
    {
      backgroundColor: '#a5a9ab'
    },
    {
      backgroundColor: '#c4dff6'
    }
  ]

  //DOUGHNUT CHART
  doughnutChartLabels: string[] = ['In Progress', 'Monitoring', 'Pending'];
  doughnutChartData: number[] = [330, 600, 260];
  doughnutChartType: string = 'doughnut';

  // CHART CLICK EVENT.
  onChartClick(event) {
    console.log(event);
  }





}

import { Component, OnInit } from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import { SorterService } from '../core/services/sorter.service';
import { FilterService } from '../core/services/filter.service';
import { IOrders, IMonitoring } from '../shared/interfaces';
import 'rxjs';

@Component({
  selector: 'app-technician',
  templateUrl: './technician.component.html',
  styleUrls: ['./technician.component.css']
})
export class TechnicianComponent implements OnInit {

  constructor(private http: Http, private sorterService: SorterService,
    private filterService: FilterService) { }
  ongoing=false;
 
  pending=true;
  filteredOrders: IOrders[] = [];
  filteredMonitoringData: IMonitoring[] = [];
  monitoring:any;
  orders:any;
  monitoringData:any;
  sortType='createdOn';
  sortReverse=false;


  results = [];
  fetchOrders = function() {
    this.http.get("http://localhost:3000/orders").subscribe(
      (res: Response) => {
        this.orders = this.filteredOrders = res.json();
        
      }
    )
  }

  fetchMonitoring = function() {
    this.http.get("http://localhost:3000/monitoring").subscribe(
      (res: Response) => {
        this.monitoring = this.monitoringData = res.json();
      }
    )
  }

  fetchReports = function() {
    this.http.get("http://localhost:3000/reports").subscribe(
      (res: Response) => {
        this.reports = res.json();
      }
    )
  }


  sort(prop: string) {    
    this.sortType=prop;
    this.sortReverse=!this.sortReverse;
    if(this.pending===true){
      this.sorterService.sort(this.orders, prop);
    }
    else if(this.ongoing===true){
      this.sorterService.sort(this.monitoringData, prop);
    }
  }

  filterChanged(data: string) {
    if(this.pending===true){        
      if (data && this.orders) {
        data = data.toUpperCase();
        const props = ['containerNumber', 'naviera', 'referType', 'malfunction','portTerminal','requestTime','portOfLoading','technician'];
        this.filteredOrders = this.filterService.filter<IOrders>(this.orders, data, props);
    } else {
      this.filteredOrders = this.orders;
    }
    }

    if(this.ongoing===true){
      if (data && this.monitoring) {
        data = data.toUpperCase();
        const props = ['containerNumber', 'naviera', 'referType', 'malfunction','portTerminal','requestTime','portOfLoading','technician'];
        this.monitoringData = this.filterService.filter<IMonitoring>(this.monitoringData, data, props);
    } else {
      this.monitoringData = this.monitoring;
    }
    } 
 
    
  }

 
  ngOnInit() {
    this.fetchOrders();
    this.fetchMonitoring();
    this.fetchReports();
  }

  Pending=function(){
    document.getElementById("ongoing").classList.remove('menu-sub-active');
    document.getElementById("pending").classList.add('menu-sub-active');
    this.pending=true;
    this.ongoing=false;
  }

  onGoing=function(){
    document.getElementById("pending").classList.remove('menu-sub-active');
    document.getElementById("ongoing").classList.add('menu-sub-active');
    this.ongoing=true;
    this.pending=false;
    this.isAddedTech=false;
  }

}

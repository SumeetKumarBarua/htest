import { Component, OnInit } from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import { SorterService } from '../core/services/sorter.service';
import { FilterService } from '../core/services/filter.service';
import { IOrders, IMonitoring } from '../shared/interfaces';
import 'rxjs';

@Component({
  selector: 'app-ceo',
  templateUrl: './ceo.component.html',
  styleUrls: ['./ceo.component.css']
})
export class CeoComponent implements OnInit {

  optionSelected: any;
  filteredOrders: IOrders[] = [];
  filteredMonitoringData: IMonitoring[] = [];

  constructor(private http: Http,private sorterService: SorterService,
    private filterService: FilterService) { }

  sortType='containerNumber';
  sortReverse=false;  
  showReports:boolean=true;

  monitoringData:any;
  results = [];

 
  displayReports=function(){    
    this.showReports=true;
    this.ngOnInit();
  }


  ngOnInit() {    
    this.fetchMonitoring();    
    this.clearData();
  }

  viewReport:boolean=false;
  viewDetails=function(){
    this.viewReport=true;
  }

  sort(prop: string) {    
    this.sortType=prop;
    this.sortReverse=!this.sortReverse;    
    this.sorterService.sort(this.monitoringData, prop);
          
  }

  filterChanged(data: string) {    
    if(this.showReports===true){
      if (data && this.monitoringData) {
        data = data.toUpperCase();
        const props = ['containerNumber', 'naviera', 'referType', 'malfunction','portTerminal','requestTime','portOfLoading','technician'];
        this.filteredMonitoringData = this.filterService.filter<IMonitoring>(this.monitoringData, data, props);
        //console.log(this.filteredOrders);
    } else {
      this.filteredMonitoringData = this.monitoringData;
    }
    } 
    
  }


  fetchMonitoring = function() {
    this.http.get("https://easy-json-server.herokuapp.com/monitoring").subscribe(
      (res: Response) => {
        this.monitoringData = res.json();
        this.filteredMonitoringData=this.monitoringData.sort(function(a, b) {
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

  fetchReports = function() {
    this.http.get("https://easy-json-server.herokuapp.com/reports").subscribe(
      (res: Response) => {
        this.reports = res.json();
      }
    )
  }

  


  checkOneByOne=function(o){
    this.onGoingObj=o;
      
  }

  clearData=function(){
  this.isAdded=false;    
  this.results = [];
  }










// BAR CHART
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = ['2012', '2013', '2014', '2015', '2016', '2017', '2018'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
 
  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Open'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Closed'}
  ];
 
  public barChartLabels1:string[] = ['Jan2018', 'March2018', 'May2018', 'July2018', 'Sep2018', 'Nov2018'];
  public barChartData1:any[] = [
    {data: [103, 133, 180, 81, 256, 155], label: 'Approved'},
    {data: [28, 8, 40, 19, 86, 27], label: 'Pending'}
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
 doughnutChartLabels:string[] = ['In Progress', 'Monitoring', 'Pending'];
   doughnutChartData:number[] = [330, 600, 260];
   doughnutChartType:string = 'doughnut';
 
// CHART CLICK EVENT.
onChartClick(event) {
  console.log(event);
}

}

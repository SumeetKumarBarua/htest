import { ModuleWithProviders } from '@angular/core';
import { Routes } from '@angular/router';

export interface IOrders {
      id: number;
      containerNumber:string;
      naviera: string;
      referType: string;
      malfunction: string;
      portTerminal: string;
      requestDate: any;
      requestTime: string;
      vesselIn: string;
      vesselOut: string;
      portOfLoading: string;
      technician: string;
      createdOn: string;
}


export interface IMonitoring {
    id: number;
    containerNumber:string;
    naviera: string;
    referType: string;
    malfunction: string;
    portTerminal: string;
    requestDate: any;
    requestTime: string;
    vesselIn: string;
    vesselOut: string;
    portOfLoading: string;
    technician: string;
    createdOn: string;
}


export interface ICustomer {
    id: number;
    firstName: string;
    lastName: string;
    gender: string;
    address: string;
    city: string;
    state: IState;
    orders?: IOrder[];
    orderTotal?: number;
    latitude?: number;
    longitude?: number;
}

export interface IOrder {
    productName: string;
    itemCost: number;
}

export interface IState {
    abbreviation: string;
    name: string;
}

export interface IPagedResults<T> {
    totalRecords: number;
    results: T;
}

export interface IUserLogin {
    email: string;
    password: string;
}

export interface IApiResponse {
    status: boolean;
    error?: string;
}

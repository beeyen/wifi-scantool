import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GettingStartedComponent } from './assessment/components/getting-started/getting-started.component';
import { HomeSizeComponent } from './assessment/components/home-size/home-size.component';
import { CompleteComponent } from './assessment/components/scan/complete/complete.component';
import { AboutScanComponent } from './assessment/components/about-scan/about-scan.component';
import { RebootingComponent } from './assessment/components/rebooting/rebooting.component';
import { LocatingGatewayComponent } from './assessment/components/scan/locating-gateway/locating-gateway.component'
import { WifiScanComponent } from './assessment/components/scan/wifi-scan/wifi-scan.component';
import { ResultComponent } from './assessment/components/scan/result/result.component';
import { MoreComponent } from './assessment/components/scan/more/more.component';


const ROUTES: Routes = [
  {
    path: 'gettingStarted',
    component: GettingStartedComponent
  },
  {
    path: 'homeSize',
    component: HomeSizeComponent
  },
  {
    path: 'aboutScan',
    component: AboutScanComponent
  },
  {
    path: 'rebooting',
    component: RebootingComponent
  },
  {
    path: 'scanning/gateway',
    component: LocatingGatewayComponent
  },
  {
    path: 'scanning/wifi/:floor',
    component: WifiScanComponent
  },
  {
    path: 'scanning/complete',
    component: CompleteComponent
  },
  {
    path: 'scanning/result',
    component: ResultComponent
  },
  {
    path: 'scanning/more',
    component: MoreComponent
  },
  {
    path: 'scanning',
    redirectTo: '/scanning/gateway',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: '/gettingStarted',
    pathMatch: 'full'
  },
];

// This module contains routing configuration
// It is the default route by giving it a path of "",
// which means you can access the main route when you visit the root URL of your web application

@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }

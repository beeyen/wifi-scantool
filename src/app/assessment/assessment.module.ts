import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GettingStartedComponent } from './components/getting-started/getting-started.component';
import { HomeSizeComponent } from './components/home-size/home-size.component';
import { HeaderComponent } from './components/header/header.component';
import { AboutScanComponent } from './components/about-scan/about-scan.component';
import { RebootingComponent } from './components/rebooting/rebooting.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { LocatingGatewayComponent } from './components/scan/locating-gateway/locating-gateway.component';
import { WifiScanComponent } from './components/scan/wifi-scan/wifi-scan.component';
import { Store } from '../store';
import { AssessmentService } from './services/assessment.service';
import { CompleteComponent } from './components/scan/complete/complete.component';
import { ResultComponent } from './components/scan/result/result.component';
import { MoreComponent } from './components/scan/more/more.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  declarations: [
    GettingStartedComponent,
    HomeSizeComponent,
    HeaderComponent,
    AboutScanComponent,
    RebootingComponent,
    StepperComponent,
    LocatingGatewayComponent,
    WifiScanComponent,
    CompleteComponent,
    ResultComponent,
    MoreComponent
  ],
  exports: [
    HeaderComponent
  ],
  providers: [
    Store, AssessmentService
  ]
})
export class AssessmentModule { }

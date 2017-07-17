import { Component, OnInit } from '@angular/core';
import { Result } from '../../../models/result';
import { Store } from '../../../../store';
import { Router } from '@angular/router';
import { AssessmentService } from '../../../services/assessment.service';


import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

@Component({
  selector: 'cp-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  title: String = 'Wi-Fi SCAN RESULT';
  results$ = this.store.select<any[]>('results');
  floors$ = this.store.select<any[]>('floors');
  gatewayLocation: number;
  totalFloors: number;
  sqft: number;
  constructor(private store: Store, private router: Router, private service: AssessmentService) { }

  get showResult() {
    return (!this.store.value.results);
  }
  ngOnInit() {
    this.service.getFloors()
    this.service.testResults();
    this.totalFloors = +this.service.getTotalFloors();
    this.gatewayLocation = +this.service.getGatewayLocation(); // +convert to number
    const home = JSON.parse(localStorage.getItem('home'));
    this.sqft = home.sqft;

    if (!this.store.value.results) {
      this.router.navigate(['/gettingStarted']);
    }
  }

  getFloorData(floor: number) {
    return this.store.select('results').filter(Boolean)
      .map(results => results.filter(res => res.floor - floor === 0));
    // for some reason res.floor === floor never be true :((((
  }

  done() {
    // flush result set
    this.store.set('results', []);
    this.router.navigate(['/gettingStarted']);
  }

}

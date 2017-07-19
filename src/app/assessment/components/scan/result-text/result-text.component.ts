import { Component, OnInit } from '@angular/core';
import { Result } from '../../../models/result';
import { Store } from '../../../../store';
import { Router } from '@angular/router';
import { AssessmentService } from '../../../services/assessment.service';
import { SQFT_META_DATA, FLOOR_META_DATA, FLOOR_OPTIONS_DATA, FLOOR_LIST_DATA } from '../../../models/types';
import * as FileSaver from 'file-saver';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

@Component({
  selector: 'cp-result',
  templateUrl: './result-text.component.html',
  styleUrls: ['./result-text.component.scss']
})
export class ResultTextComponent implements OnInit {
  title: String = 'Wi-Fi SCAN RESULT';
  results$ = this.store.select<any[]>('results');
  floors = [];
  gatewayLocation: number;
  gatewayRoom: string;
  totalFloors: number;
  sqft: number;
  basement: false;
  wifiFloors: string[];
  constructor(private store: Store, private router: Router, private service: AssessmentService) { }

  get showResult() {
    return (!this.store.value.results);
  }
  ngOnInit() {
    this.service.getFloors();
    this.totalFloors = +this.service.getTotalFloors();
    this.gatewayLocation = +this.service.getGatewayLocation(); // +convert to number
    this.gatewayRoom = this.service.getGatewayRoomLocation();
    const home = JSON.parse(localStorage.getItem('home'));
    this.sqft = home.sqft;
    this.basement = home.basement;
    this.wifiFloors = JSON.parse(localStorage.getItem('wifiFloors'));
    this.floors = this.generateWifiFloorSelection();
    if (!this.store.value || !home) {
      this.router.navigate(['/gettingStarted']);
    }
  }

  generateWifiFloorSelection() {
    const floors = [];
    const resultFloors = [].concat(this.wifiFloors);
    if (resultFloors.filter(fl => +fl === this.gatewayLocation).length === 0) {
      resultFloors.push(Number(this.gatewayLocation).toString());
    }
    // resultFloors =
    resultFloors.sort();
    for (let i = 0; i < resultFloors.length; i++) {
      floors.push(FLOOR_OPTIONS_DATA.filter(res => res.id === +resultFloors[i])[0]);
    };
    return floors;
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

  get wifiCoverageFloors() {
    const text = [];
    this.wifiFloors.forEach(obj => text.push(FLOOR_LIST_DATA[obj].desc));
    return text.join(', ');
  }

}

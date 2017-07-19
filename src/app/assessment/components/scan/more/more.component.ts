import { Component, OnInit } from '@angular/core';
import { Result } from '../../../models/result';
import { Store } from '../../../../store';
import { Router } from '@angular/router';
import { AssessmentService } from '../../../services/assessment.service';
import { FLOOR_OPTIONS_DATA } from '../../../models/types';

@Component({
  selector: 'cp-more',
  templateUrl: './more.component.html',
  styleUrls: ['./more.component.scss']
})
export class MoreComponent implements OnInit {
  title: String = 'Wi-Fi SCAN';
  result: Result;
  results: any[];
  // floors$ = this.store.select<any[]>('floors');
  displayFloorSelection = true;
  floors = [];
  constructor(private store: Store, private router: Router, private service: AssessmentService) { }

  ngOnInit() {
    this.service.getFloors();
    if (this.service.getTotalFloors() <= 1) {
      this.displayFloorSelection = false;
    }
    const gatewayLocation = +this.service.getGatewayLocation();
    const home = JSON.parse(localStorage.getItem('home'));
    const scanFloors = JSON.parse(localStorage.getItem('wifiFloors'));
    if (scanFloors.filter(fl => fl === gatewayLocation).length === 0) {
      scanFloors.push(gatewayLocation);
    }
    scanFloors.sort();
    scanFloors.forEach(item => {
      this.floors.push(FLOOR_OPTIONS_DATA[item]);
    });
  }

  onSubmit({ value, valid }: { value: Result, valid: boolean }) {
    if (!this.displayFloorSelection) {
      value.floor = 1;
    }
    const strength = this.service.checkSignalStrength(value.reading);
    value.strength = strength.toLowerCase();
    value.reading = Math.abs(value.reading);
    this.service.addResult(value);
    this.complete();
  }


  complete() {
    this.router.navigate(['/wifi-scan/complete'], { skipLocationChange: true });
  }

}

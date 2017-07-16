import { Component, OnInit } from '@angular/core';
import { Result } from '../../../models/result';
import { Store } from '../../../../store';
import { Router } from '@angular/router';
import { AssessmentService } from '../../../services/assessment.service';

@Component({
  selector: 'cp-locating-gateway',
  templateUrl: './locating-gateway.component.html',
  styleUrls: ['./locating-gateway.component.scss']
})

export class LocatingGatewayComponent implements OnInit {
  title: String = 'Locating Wi-Fi Gateway';
  result: Result;
  results: any[];
  floors$ = this.store.select<any[]>('floors');
  displayFloorSelection = true;
  constructor(private store: Store, private router: Router, private service: AssessmentService) { }

  ngOnInit() {
    this.service.getFloors();
    if (this.service.getTotalFloors() <= 1) {
      this.displayFloorSelection = false;
    }
    if (this.floors$) {
      this.floors$.subscribe(data => {
        if (data) {
          console.log(data);
        }
      });
    }
  }

  onSubmit({ value, valid }: { value: Result, valid: boolean }) {
    if (this.displayFloorSelection) {
      this.service.setGateWayLocation(value.floor);
    } else {
      this.service.setGateWayLocation(1);
      value.floor = 1;
    }
    // console.log(value, valid)
    const strength = this.service.checkSignalStrength(value.reading);
    this.service.addResult(value);
    // check strength and determine route
    if (strength === 'GREEN') {
      this.router.navigate([`/scanning/wifi/${value.floor}`], { queryParams: { 'scan': 0 } });
    } else {
      this.router.navigate([`/scanning/wifi/${value.floor}`], { queryParams: { 'scan': 1 } });
    }
    // this.router.navigate([`/scanning/wifi/${value.floor}`]);
  }
}
import { Component, OnInit } from '@angular/core';
import { Result } from '../../../models/result';
import { Store } from '../../../../store';
import { Router } from '@angular/router';
import { AssessmentService } from '../../../services/assessment.service';

@Component({
  selector: 'cp-more',
  templateUrl: './more.component.html',
  styleUrls: ['./more.component.scss']
})
export class MoreComponent implements OnInit {
  title: String = 'Wi-Fi SCAN';
  result: Result;
  results: any[];
  floors$ = this.store.select<any[]>('floors');
  displayFloorSelection = true;
  constructor(private store: Store, private router: Router, private service: AssessmentService) { }

  ngOnInit() {
    // this.service.getFloors();
    if (this.service.getTotalFloors() <= 1) {
      this.displayFloorSelection = false;
    }
  }

  onSubmit({ value, valid }: { value: Result, valid: boolean }) {
    if (!this.displayFloorSelection) {
      value.floor = 1;
    }
    this.service.addResult(value);
    this.complete();
  }


  complete() {
    this.router.navigate(['/scanning/complete']);
  }

}

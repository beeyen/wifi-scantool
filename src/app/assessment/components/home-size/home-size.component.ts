import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '../../../store';
import { Home } from '../../models/home';
import { AssessmentService } from '../../services/assessment.service';

@Component({
  selector: 'cp-home-size',
  templateUrl: './home-size.component.html',
  styleUrls: ['./home-size.component.scss']
})
export class HomeSizeComponent implements OnInit {
  title: String = 'Home Size';
  home: Home;
  floors: number;
  basement: false;
  sqft: 4;
  floors$ = this.store.select<any[]>('floors');
  basements$ = this.store.select<any[]>('basements');
  sqfts$ = this.store.select<any[]>('sqfts');

  constructor(private store: Store, private router: Router, private service: AssessmentService) { }

  ngOnInit() {
    this.store.set('floors', [{ id: 1, name: '1' }, { id: 2, name: '2' }, { id: 3, name: '3' }]);
    this.store.set('basements', [{ value: true, name: 'yes' }, { value: false, name: 'no' }]);
    this.store.set('sqfts', [
      { id: 1, name: '0 - 2000 SqFt' },
      { id: 2, name: '3001 - 4000 SqFt' },
      { id: 3, name: '4001 - 5000 SqFt' },
      { id: 4, name: 'I am not sure' },
    ]);
  }

  onSubmit({ value, valid }: { value: Home, valid: boolean }) {
    let totalFloors = 0;
    // save this to store???
    // this.store.set('home', value);
    this.service.setHomeSize(value);
    // total Floor include basement
    if (value.basement) {
      totalFloors = 1;
    }
    totalFloors += value.floors;
    localStorage.setItem('totalFloors', JSON.stringify(totalFloors));
    localStorage.setItem('home', JSON.stringify(value));
    this.service.initFloors();
    this.router.navigate(['/aboutScan']);
  }

}

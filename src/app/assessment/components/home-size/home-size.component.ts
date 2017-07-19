import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '../../../store';
import { Home } from '../../models/home';
import { AssessmentService } from '../../services/assessment.service';
import { SQFT_META_DATA, FLOOR_LIST_DATA, FLOOR_OPTIONS_DATA } from '../../models/types';

@Component({
  selector: 'cp-home-size',
  templateUrl: './home-size.component.html',
  styleUrls: ['./home-size.component.scss']
})
export class HomeSizeComponent implements OnInit {
  title: String = 'Home Size';
  home: Home;
  floors = 4;
  wifiFloors: string[];
  basement: false;
  sqft: number;
  bfloors: any[];
  floors$ = this.store.select<any[]>('floors');
  basements$ = this.store.select<any[]>('basements');
  sqfts$ = this.store.select<any[]>('sqfts');

  constructor(private store: Store, private router: Router, private service: AssessmentService) { }

  ngOnInit() {
    let floors = new Array();
    this.bfloors = new Array();
    floors = floors.concat(FLOOR_LIST_DATA).splice(1, 4);
    this.bfloors = [].concat(FLOOR_OPTIONS_DATA).splice(1, this.floors);

    this.store.set('floors', floors);
    this.store.set('basements', [{ value: true, name: 'yes' }, { value: false, name: 'no' }]);
    this.store.set('sqfts', SQFT_META_DATA);
  }

  logBasement(basement) {
    this.basement = basement;
    this.generateWifiFloorSelection(this.floors);
  }

  logFloor(floor) {
    this.floors = floor;
    this.generateWifiFloorSelection(floor);
  }

  get selectedOptions() {
    if (!this.basement && this.floors === 1) {
      return this.bfloors
        .filter(opt => opt.id === 1)
        .map(opt => opt.id);
    } else {
      return this.bfloors
        .filter(opt => opt.checked)
        .map(opt => opt.id);
    }
  }

  generateWifiFloorSelection(count) {
    let start = 0;
    if (!this.basement) {
      start = 1;
    } else {
      ++count;
    }
    this.bfloors = [].concat(FLOOR_OPTIONS_DATA).splice(start, count);
  }

  onSubmit({ value, valid }: { value: Home, valid: boolean }) {
    localStorage.clear();
    this.store.set('results', []);
    let totalFloors = 0;

    this.store.set('home', value);
    this.service.setHomeSize(value);
    // total Floor include basement
    if (value.basement) {
      totalFloors = 1;
    }
    totalFloors += value.floors;
    localStorage.setItem('wifiFloors', JSON.stringify(this.selectedOptions));
    localStorage.setItem('totalFloors', JSON.stringify(totalFloors));
    localStorage.setItem('home', JSON.stringify(value));
    this.service.initFloors();
    this.router.navigate(['/aboutScan'], { skipLocationChange: true });
  }

}

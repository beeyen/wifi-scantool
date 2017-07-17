import { Injectable, EventEmitter } from '@angular/core';
import { Result } from '../models/result';
import { Home } from '../models/home';
import { Store } from '../../store';
@Injectable()
export class AssessmentService {
  statusUpdated = new EventEmitter<string>();
  results = [];
  results$ = this.store.select<any[]>('results');

  constructor(private store: Store) { }

  test() {
    console.log('service results object:', this.results);
  }

  addResult(result: Result) {
    if (this.results$) {
      this.results$.subscribe(data => {
        if (data) {
          this.results = data
        }
      });
    }
    this.results.push(result);
    this.store.set('results', this.results);
  }

  testResults() {
    if (this.results$) {
      this.results$.subscribe(data => {
        if (data) {
          this.results = data
          // console.log('results objectx:', this.results);
        }
      });
    }
  }
  setHomeSize(home: Home) {
    this.store.set('home', home);
  }

  initFloors() {
    const floors = [];
    // retrieving # of floor and construct floor list
    const home = JSON.parse(localStorage.getItem('home'));
    if (home.basement) {
      floors.push({ value: '0', name: 'Basement' });
      for (let i = 1; i <= home.floors; i++) {
        floors.push({ value: `${i}`, name: `${i}` });
      }
    } else {
      for (let i = 1; i <= home.floors; i++) {
        floors.push({ value: `${i}`, name: `${i}` });
      }
    }
    localStorage.setItem('floors', JSON.stringify(floors));
    this.store.set('floors', floors);
  }

  getFloors() {
    const floors = [];
    // retrieving # of floor and construct floor list
    const home = JSON.parse(localStorage.getItem('home'));
    if (home) {
      if (home.basement) {
        floors.push({ value: '0', name: 'Basement' });
        for (let i = 1; i <= home.floors; i++) {
          floors.push({ value: `${i}`, name: `${i}` });
        }
      } else {
        for (let i = 1; i <= home.floors; i++) {
          floors.push({ value: `${i}`, name: `${i}` });
        }
      }
    }
    this.store.set('floors', floors);
  }

  getTotalFloors() {
    return JSON.parse(localStorage.getItem('totalFloors')) || 1;
  }

  setTotalFloors(totalFloors: number) {
    localStorage.setItem('totalFloors', JSON.stringify(totalFloors));
  }

  setGateWayLocation(floor: number) {
    localStorage.setItem('gatewayLocation', JSON.stringify(floor));
  }

  getGatewayLocation() {
    // console.log(JSON.parse(localStorage.getItem('gatewayLocation')));
    return JSON.parse(localStorage.getItem('gatewayLocation'));
  }

  getFloorData(floor: number) {
    // console.log('get result for floor:', floor);
    const value = this.store.value.results;
    const data = value.map((result: Result) => {
      if (result.floor === floor) {
        return result;
      }
    });
    console.log('get result for floor:', data);
    return data;
  }

  checkSignalStrength(value: number) {
    // turn to absolute value before comparing
    // < 69 GREEN
    // 70 ~ 78 YELLOW
    // > 78 RED
    const strength = Math.abs(value);
    if (strength <= 69) {
      return 'GREEN';
    } else if (strength >= 70 && strength <= 77) {
      return 'YELLOW';
    } else if (strength >= 78) {
      return 'RED';
    }
  }
}

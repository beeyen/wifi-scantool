import { Injectable, EventEmitter } from '@angular/core';
import { Result } from '../models/result';
import { Home } from '../models/home';
import { Store } from '../../store';
import { SQFT_META_DATA, FLOOR_LIST_DATA } from '../models/types';
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
          return true;
        } else {
          return false;
        }
      });
    } else {
      return false;
    }
  }
  setHomeSize(home: Home) {
    this.store.set('home', home);
  }

  initFloors() {
    let floors = new Array();
    floors = floors.concat(FLOOR_LIST_DATA);
    // retrieving # of floor and construct floor list
    const home = JSON.parse(localStorage.getItem('home'));
    if (home.basement) {
      floors = floors.splice(0, home.floors);
    } else {
      floors = floors.splice(1, home.floors);
    }
    localStorage.setItem('floors', JSON.stringify(floors));
    this.store.set('floors', floors);
  }

  getFloors() {
    let floors = new Array();
    floors = floors.concat(FLOOR_LIST_DATA);
    // retrieving # of floor and construct floor list
    const home = JSON.parse(localStorage.getItem('home'));
    if (home.basement) {
      floors = floors.splice(0, home.floors + 1);
    } else {
      floors = floors.splice(1, home.floors);
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

  setGateWayRoomLocation(room: string) {
    localStorage.setItem('gatewayRoomLocation', JSON.stringify(room));
  }

  getGatewayLocation() {
    // console.log(JSON.parse(localStorage.getItem('gatewayLocation')));
    return JSON.parse(localStorage.getItem('gatewayLocation'));
  }

  getGatewayRoomLocation() {
    // console.log(JSON.parse(localStorage.getItem('gatewayLocation')));
    return JSON.parse(localStorage.getItem('gatewayRoomLocation'));
  }

  getFloorData(floor: number) {
    // console.log('get result for floor:', floor);
    const value = this.store.value.results;
    const data = value.map((result: Result) => {
      if (result.floor === floor) {
        return result;
      }
    });
    // console.log('get result for floor:', data);
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

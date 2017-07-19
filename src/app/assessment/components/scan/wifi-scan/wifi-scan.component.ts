import { Component, OnInit } from '@angular/core';
import { Result } from '../../../models/result';
import { Store } from '../../../../store';
import { Router, NavigationExtras } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AssessmentService } from '../../../services/assessment.service';
import { FLOORS } from '../../../models/types';
import { ScanInfo } from '../../../models/scanInfo';
import { Dictionary } from '../../../models/ikeycollection';
import { FLOOR_LIST_DATA } from '../../../models/types';
import { Home } from '../../../models/home';

@Component({
  selector: 'cp-wifi-scan',
  templateUrl: './wifi-scan.component.html',
  styleUrls: ['./wifi-scan.component.scss']
})
export class WifiScanComponent implements OnInit {
  title: String = 'Wi-Fi Scan';
  floor: number;
  floorName: String;
  result: Result;
  instruction: String;
  scanType: number;
  gatewayLocation;
  totalFloors: number;
  nextScanData: ScanInfo;
  scanFloors: number[];
  floorsScanned: any[];
  floors$ = this.store.select<any[]>('floors');
  floors = [];
  scanPerFloor = new Dictionary<any[]>();
  scanDirection = '';
  home: Home;
  constructor(private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private service: AssessmentService) { }
  ngOnInit() {
    this.service.getFloors();
    this.route
      .queryParams
      .subscribe(params => this.scanType = +params['scan']);
    this.route
      .params
      .subscribe(params => this.floor = +params.floor);
    // construct the instruction string dynamically
    this.gatewayLocation = +this.service.getGatewayLocation(); // +convert to number
    this.totalFloors = +this.service.getTotalFloors();
    this.floors$.subscribe(data => {
      if (data) {
        this.floors = data
      }
    });
    this.home = JSON.parse(localStorage.getItem('home'));
    // retrieving list of floors to scan
    this.scanFloors = JSON.parse(localStorage.getItem('wifiFloors'));
    // descending
    // this.scanFloors.sort(function (a, b) { return b - a });
    // init scanPerFloor Dictionary by wifi floor selection
    for (let i = 0; i < this.scanFloors.length; i++) {
      this.scanPerFloor.Add(Number(this.scanFloors[i]).toString(), []);
    }
    // add gatewayLocation in the dictionary if it doesn't exists in scanFloors list
    if (this.scanFloors.filter(fl => fl === this.gatewayLocation).length === 0) {
      this.scanPerFloor.Add(Number(this.gatewayLocation).toString(), []);
    }
    this.templateSetUp(this.floor, this.scanType);
  }

  templateSetUp(floor, scanType) {
    if (scanType === 0) {
      this.instruction = `Now go to the room/area on the ${FLOOR_LIST_DATA[floor].desc} that is farthest away from the Wi-Fi Gateway.`;
    } else if (scanType === 2) {
      this.instruction = `Now go to the room/area on the ${FLOOR_LIST_DATA[floor].desc} that is farthest away from here.`;
    } else if (scanType === 1) {
      this.instruction = `Now go to the next room/area on the ${FLOOR_LIST_DATA[floor].desc} that is closer to the Wi-Fi Gateway`;
    }
  }

  getNext() {
    const scanPerFloor = this.scanPerFloor.Item(Number(this.floor).toString());
    const green = scanPerFloor.filter(res => { return res === 'GREEN' });
    const maxFloors = Math.max(...this.scanFloors);
    const minFloors = Math.min(...this.scanFloors);
    /* console.log('this floor:', this.floor);
    console.log('scanPerFloor:', scanPerFloor);
    console.log('floors to scan:', this.scanFloors); */
    if (this.floor === this.gatewayLocation) { // second scan of locating gateway position
      // gateway location on top floor
      if ((this.gatewayLocation === maxFloors) ||
        ((!this.home.basement && this.totalFloors > 1 && this.gatewayLocation === this.totalFloors) ||
          (this.home.basement && this.totalFloors > 1 && this.gatewayLocation === this.totalFloors - 1))) {
        this.scanDirection = 'down';

        if (green.length === 0 && scanPerFloor.length < 2) {
          return this.floor;
        } else if (green.length === 1 && this.scanType === 1 && scanPerFloor.length < 2) {
          return this.floor;
        } else {
          return this.getNextUnscanned(this.floor, this.scanDirection);
        }

      } else if ((this.gatewayLocation === minFloors) ||
        ((!this.home.basement && this.totalFloors > 1 && this.gatewayLocation === 1) ||
          (this.home.basement && this.totalFloors > 1 && this.gatewayLocation === 0))
      ) { // bottom floor
        this.scanDirection = 'up';
        if (green.length === 0 && scanPerFloor.length < 2) {
          return this.floor;
        } else if (green.length === 1 && this.scanType === 1 && scanPerFloor.length < 2) {
          return this.floor;
        } else {
          if ((!this.home.basement && this.floor <= this.totalFloors) ||
            (this.home.basement && this.floor <= this.totalFloors - 1)) {
            return this.getNextUnscanned(this.floor, this.scanDirection);
          }
        }
      } else { // gateway in the middle
        // do something here
        this.scanDirection = 'up';
        if (green.length === 0 && scanPerFloor.length < 2) {
          return this.floor;
        } else if (green.length === 1 && this.scanType === 1 && scanPerFloor.length < 2) {
          return this.floor;
        } else {
          if ((!this.home.basement && this.floor <= this.totalFloors) ||
            (this.home.basement && this.floor <= this.totalFloors - 1)) {
            return this.getNextUnscanned(this.floor, this.scanDirection);
          }
        }
      }
    } else {
      // GATEWAY IN MIDDLE FLOOR
      if (green.length === 2 || scanPerFloor.length >= 3) {
        return this.getNextUnscanned(this.floor, this.scanDirection);
      } else {
        return this.floor;
      }
    }
  }

  getNextLowerFloor(floor) {
    if (this.scanFloors.filter(fl => fl === floor).length > 0) {
      return floor;
    } else {
      if (floor > 0) {
        return this.getNextLowerFloor(floor - 1);
      } else {
        return -1;
      }
    }
  }

  getNextHigherFloor(floor) {
    const maxFloors = Math.max(...this.scanFloors);
    if (this.scanFloors.filter(fl => fl === floor).length > 0) {
      return floor;
    } else {
      if (floor < maxFloors) {
        return this.getNextHigherFloor(floor + 1);
      } else {
        // check to see if we need to go down
        if (this.scanFloors.length > 0) {
          this.scanDirection = 'down';
          return this.getNextLowerFloor(floor - 1);
        }
        return -1;
      }
    }
  }

  getNextUnscanned(floor, direction) {
    // REMOVE THIS FLOOR FROM FLOORS TO SCAN
    const newScanFloors = [];
    let temp;
    for (let i = 0; i < this.scanFloors.length; i++) {
      if (this.scanFloors[i] !== floor) {
        newScanFloors.push(this.scanFloors[i]);
      }
    }
    this.scanFloors = newScanFloors;
    if (direction === 'down') { // at top, go down
      if (floor > 0) {
        temp = this.getNextLowerFloor(floor - 1);
      } else {
        temp = -1;
      }
      return temp;
    } else if (direction === 'up') {
      if (floor < this.totalFloors) {
        temp = this.getNextHigherFloor(floor + 1);
      } else {
        temp = -1;
      }
      return temp;
    } else {
      if (this.scanFloors.length > 0) {
        return this.scanFloors.pop();
      } else {
        return -1;
      }
    }
  }

  // previous version w/o discrimination of which floor to scan
  /* getNextFloor(currentFloor: number, scanPerFloor: any[]) {
    // TESTING NEW LOGIC
    // logic to determine what is the next floor in the flow
    const home = JSON.parse(localStorage.getItem('home'));
    const green = scanPerFloor.filter(res => { return res === 'GREEN' });
    if (currentFloor === this.gatewayLocation) { // second scan of locating gateway position
      // gateway location on top floor
      if ((!home.basement && this.totalFloors > 1 && this.gatewayLocation === this.totalFloors) ||
        (home.basement && this.totalFloors > 1 && this.gatewayLocation === this.totalFloors - 1)) {
        if (green.length === 0 && scanPerFloor.length < 2) {
          return currentFloor;
        } else if (green.length === 1 && this.scanType === 1 && scanPerFloor.length < 2) {
          return currentFloor;
        } else {
          return currentFloor - 1;
        }
      } else { // bottom floor
        if (green.length === 0 && scanPerFloor.length < 2) {
          return currentFloor;
        } else if (green.length === 1 && this.scanType === 1 && scanPerFloor.length < 2) {
          return currentFloor;
        } else {
          if ((!home.basement && currentFloor <= this.totalFloors) ||
            (home.basement && currentFloor <= this.totalFloors - 1)) {
            return currentFloor + 1;
          }
        }
      }
    } else { // step after locating gateway position
      // gateway on first floor
      if ((!home.basement && this.gatewayLocation === 1) || (home.basement && this.gatewayLocation === 0)) {
        if (green.length === 2 || scanPerFloor.length >= 3) {
          // go next floor
          if ((!home.basement && currentFloor < this.totalFloors) ||
            (home.basement && currentFloor < this.totalFloors - 1)) {
            return currentFloor + 1;
          } else {
            return -1;
          }
        } else {
          // same floor
          return currentFloor;
        }
      } else if ((!home.basement && this.gatewayLocation === this.totalFloors) ||
        (home.basement && this.gatewayLocation === this.totalFloors - 1)) { // gateway locate on top floor
        if (green.length === 2 || scanPerFloor.length >= 3) {
          // go next floor
          if (home.basement && currentFloor > 0 || !home.basement && currentFloor > 1) {
            return currentFloor - 1;
          } else if (home.basement && currentFloor === 0 || !home.basement && currentFloor === 1) {
            // done scanning all floors
            return -1;
          }
        } else {
          // same floor
          return currentFloor;
        }
      } else { // gateway in the middle floors
        // TODO: get all scans # from other floor
        if ((!home.basement && currentFloor === this.totalFloors) ||
          (home.basement && currentFloor === this.totalFloors - 1)) {
          if (green.length === 2 || scanPerFloor.length >= 3) {
            // go to next floor ( up first then down)
            if ((!home.basement && currentFloor === this.totalFloors && currentFloor > 0) ||
              (home.basement && currentFloor === this.totalFloors - 1 && currentFloor > 0)) { // on top floor so going down
              const testFloor = this.gatewayLocation - 1;
              const greenlist = this.scanPerFloor.Item(Number(testFloor).toString()).filter(res => res === 'GREEN');
              const list = this.scanPerFloor.Item(Number(testFloor).toString());
              if (greenlist.length === 2) {
                if (testFloor > 0) {
                  return testFloor - 1;
                } else {
                  return -1;
                }
              } else {
                return testFloor;
              }
            }
          } else {
            return currentFloor;
          }
        } else if ((!home.basement && currentFloor < this.totalFloors && currentFloor > this.gatewayLocation) ||
          (home.basement && currentFloor < this.totalFloors - 1 && currentFloor > this.gatewayLocation)) {
          // do somethi
          if (green.length === 2 || scanPerFloor.length >= 3) {
            // go next floor
            if ((!home.basement && currentFloor <= this.totalFloors) ||
              (home.basement && currentFloor <= this.totalFloors - 1)) {
              return currentFloor + 1;
            }
          } else {
            return currentFloor;
          }
        } else {
          // do somethi
          if (green.length === 2 || scanPerFloor.length >= 3) {
            // go next floor
            if (home.basement && currentFloor > 0 || !home.basement && currentFloor > 1) {
              return currentFloor - 1;
            } else if (home.basement && currentFloor === 0 || !home.basement && currentFloor === 1) {
              // done scanning all floors
              return -1;
            }
          } else {
            return currentFloor;
          }
        }
      }
    }
  } */

  getScanType(floor) {
    // const result = scanPerFloor.filter((res, i) => { return res === 'RED' });
    if (floor === -1) {
      return -1;
    }
    const scanPerFloor = this.scanPerFloor.Item(Number(floor).toString());
    if (scanPerFloor.length === 0) {
      return 0;
    } else if (scanPerFloor[scanPerFloor.length - 1] === 'RED') {
      return 1;
    } else {
      return 2;
    }
  }

  onSubmit({ value, valid }: { value: Result, valid: boolean }) {
    const result = value;
    const strength = this.service.checkSignalStrength(value.reading);
    // const floors = [FLOORS.Basement, FLOORS.First, FLOORS.Second, FLOORS.Third, FLOORS.Fourth];
    result.floor = this.floor;
    result.strength = strength.toLowerCase();
    result.reading = Math.abs(result.reading);
    this.service.addResult(result);
    const scanPerFloor = this.scanPerFloor.Item(Number(this.floor).toString());
    // keep track of how many scan happening on this floor
    scanPerFloor.push(strength);
    // need to get the params again
    this.route
      .queryParams
      .subscribe(params => this.scanType = +params['scan']);
    this.route
      .params
      .subscribe(params => this.floor = +params.floor);
    // logic to dertermine next floor goes here
    // if on gateway floor && reading is green go to next floor
    if (this.gatewayLocation === this.floor) {
      // if total floor is 1
      if (this.scanPerFloor.Count() === 1) {
        // 3rd scan on gateway floor
        if (strength !== 'GREEN' && this.scanType !== 1 && scanPerFloor.length < 2) {
          this.nextScan({ floor: this.floor, scanType: 1 })
          this.templateSetUp(this.floor, 1);
        } else {
          this.complete();
        }
      } else {
        // this.floor = this.getNextFloor(this.floor, scanPerFloor);
        this.floor = this.getNext();
        this.scanType = this.getScanType(this.floor);
        this.nextScan({ floor: this.floor, scanType: this.scanType });
        this.templateSetUp(this.floor, this.scanType);
      }
    } else {
      // this.floor = this.getNextFloor(this.floor, scanPerFloor);
      this.floor = this.getNext();
      this.scanType = this.getScanType(this.floor);
      if (this.floor !== -1) {
        this.nextScan({ floor: this.floor, scanType: this.scanType });
        this.templateSetUp(this.floor, this.scanType);
      } else {
        this.complete();
      }
    }
  }

  nextScan(scanData: ScanInfo) {

    const navigationExtras: NavigationExtras = {
      queryParams: { 'scan': scanData.scanType },
      skipLocationChange: true
    };
    this.floor = scanData.floor;
    this.router.navigate([`/wifi-scan/wifi/${scanData.floor}`], navigationExtras);
    this.templateSetUp(scanData.floor, scanData.scanType);
  }

  complete() {
    this.router.navigate(['/wifi-scan/complete'], { skipLocationChange: false });
  }

  stopScan() {
    this.router.navigate(['/stop'], { skipLocationChange: true });
  }
}

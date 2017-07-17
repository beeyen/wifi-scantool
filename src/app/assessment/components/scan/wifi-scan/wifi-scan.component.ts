import { Component, OnInit } from '@angular/core';
import { Result } from '../../../models/result';
import { Store } from '../../../../store';
import { Router, NavigationExtras } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AssessmentService } from '../../../services/assessment.service';
import { FLOORS } from '../../../models/types';
import { ScanInfo } from '../../../models/scanInfo';
import { Dictionary } from '../../../models/ikeycollection';

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
  floors$ = this.store.select<any[]>('floors');
  floors = [];
  scanPerFloor = new Dictionary<any[]>();

  constructor(private store: Store, private router: Router, private route: ActivatedRoute, private service: AssessmentService) { }

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
    if (this.floors$) {
      this.floors$.subscribe(data => {
        if (data) {
          this.floors = data
        }
      });
    }
    // init scanPerFloor Dictionary
    for (let i = 0; i < this.totalFloors; i++) {
      this.scanPerFloor.Add(this.floors[i].value, []);
    }
    this.templateSetUp(this.floor, this.scanType);
  }

  templateSetUp(floor, scanType) {
    if (scanType === 0) {
      this.instruction = `Now go to the room/area on the ${this.getFloorName(floor)} that is farthest away from the Wi-Fi Gateway.`;
    } else if (scanType === 2) {
      this.instruction = `Now go to the room/area on the ${this.getFloorName(floor)} that is farthest away from here.`;
    } else if (scanType === 1) {
      this.instruction = `Now go to the next room/area on the ${this.getFloorName(floor)} that is closer to the Wi-Fi Gateway`;
    }
  }

  getFloorName(floor) {
    switch (floor) {
      case 0:
        return 'basement';
      case 1:
        return 'first floor';
      case 2:
        return 'second floor';
      case 3:
        return 'third floor';
      case 4:
        return 'fourth floor';
    }
  }

  getNextFloor(currentFloor: number, scanPerFloor: any[]) {
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
  }

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

  refreshForm() {

  };

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
      // go next floor
      // if total floor is 1, go to complete
      if (this.totalFloors === 1) {
        if (strength !== 'GREEN' && this.scanType === 1) {
          this.stopScan();
        } else if (strength !== 'GREEN' && this.scanType !== 1 && scanPerFloor.length < 2) {
          this.nextScan({ floor: this.floor, scanType: 1 })
          this.templateSetUp(this.floor, 1);
        } else if (strength === 'GREEN' && this.scanType === 1 && scanPerFloor.length < 2) {
          this.nextScan({ floor: this.floor, scanType: 0 })
          this.templateSetUp(this.floor, 0);
        } else {
          this.complete();
        }
      } else {
        const greenlist = this.scanPerFloor.Item(Number(this.floor).toString()).filter(res => res === 'GREEN');
        if (greenlist.length === 0 && this.scanType === 1) {
          this.stopScan();
        } else {
          this.floor = this.getNextFloor(this.floor, scanPerFloor);
          this.scanType = this.getScanType(this.floor);
          this.nextScan({ floor: this.floor, scanType: this.scanType });
          this.templateSetUp(this.floor, this.scanType);
        }
      }
    } else {
      this.floor = this.getNextFloor(this.floor, scanPerFloor);
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
    this.router.navigate(['/stop'], { skipLocationChange: false });
  }
}

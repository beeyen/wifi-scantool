import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Result } from '../../../models/result';
import { Store } from '../../../../store';
import { Router, ActivatedRoute } from '@angular/router';
import { AssessmentService } from '../../../services/assessment.service';
import { SQFT_META_DATA, FLOOR_META_DATA, FLOOR_OPTIONS_DATA, FLOOR_LIST_DATA } from '../../../models/types';
import * as FileSaver from 'file-saver';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';
import 'firebase/storage';

@Component({
  selector: 'cp-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  title: String = 'Wi-Fi SCAN RESULT';
  results$ = this.store.select<any[]>('results');
  floors = [];
  gatewayLocation: number;
  gatewayRoom: string;
  totalFloors: number;
  sqft: number;
  basement: false;
  wifiFloors: string[];
  downloadURL: string;

  doneSave: EventEmitter<any> = new EventEmitter();

  constructor(private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private service: AssessmentService,
    private firebaseApp: FirebaseApp) {

  }


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
    this.checkResultData();
    this.route
      .queryParams
      .subscribe(params => this.done = params['done']);
    // TODO: STOP BROWSER REFRESH
    if (!this.downloadURL) {
      this.saveToFirebase();
    }
  }

  checkResultData() {
    const result$ = this.store.select('results');
    let gotData = false;
    let data: any[];
    console.log(result$);
    //result$.subscribe(res =>
    //  gotData =  res.length > 0);
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
    if (this.store) {
      return this.store.select('results').filter(Boolean)
        .map(results => results.filter(res => res.floor - floor === 0));
    } else {
      return undefined;
    }
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

  generateTextResult() {
    const content = [];
    content.push(`Home SqFt: ${SQFT_META_DATA[this.sqft].name}\r\n`);
    content.push(`Total Floor(s) include basement: ${this.totalFloors}\r\n`);
    content.push(`Wi-Fi Gateway Location: ${FLOOR_LIST_DATA[this.gatewayLocation].desc} - Room: ${this.gatewayRoom}\r\n`)
    content.push(`Floors you needs Wi-Fi coverage: `);
    const floors = [];
    this.wifiFloors.forEach(floor => {
      floors.push(`${FLOOR_META_DATA[floor].name}`);
    });
    content.push(floors.join(',') + '\r\n');
    content.push('===============================\r\n');
    this.floors.forEach(floor => {
      content.push(`${FLOOR_LIST_DATA[floor.id].desc}\r\n`);
      const rooms$ = this.getFloorData(floor.id);
      rooms$.subscribe(data => {
        data.forEach(item => {
          content.push(`${item.room}: -${item.reading} dBm\r\n`);
        });
      });
    });
    return content.join('');
  }

  saveToFirebase() {
    const storageRef = this.firebaseApp.storage().ref();
    const scandataRef = this.firebaseApp.storage().ref();
    const fileContent = this.generateTextResult();
    const timeInMs = Date.now();
    const fileName = `${timeInMs}_scandata.txt`;
    const file = new Blob([fileContent], { type: 'text/plain' });

    const uploadTask = scandataRef.child('scandata/' + fileName).put(file);
    const self = this;
    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', function (snapshot) {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function (error) {
      // Handle unsuccessful uploads
    }, function (this) {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      self.downloadURL = uploadTask.snapshot.downloadURL;
      console.log('downloadURL', self.downloadURL);
      localStorage.setItem('downloadURL', JSON.stringify(this.downloadURL));
      self.doneSave.emit(null);
      /* const timeoutId = setTimeout(() => {
        self.router.navigate(['wifi-scan/result'], {
          queryParams: { 'done': true }, replaceUrl: true
        });
      }, 240000); */
    });
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-stop',
  templateUrl: './stop.component.html',
  styleUrls: ['./stop.component.scss']
})
export class StopComponent implements OnInit {
  title: String = 'Wi-Fi SCAN RESULT';
  constructor() { }

  ngOnInit() {
  }

}

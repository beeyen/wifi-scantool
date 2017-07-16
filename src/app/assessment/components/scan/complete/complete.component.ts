import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.scss']
})
export class CompleteComponent implements OnInit {
  title: String = 'Wi-Fi Scan';
  constructor() { }

  ngOnInit() {
  }

}

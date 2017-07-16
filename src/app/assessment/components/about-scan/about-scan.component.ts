import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-about-scan',
  templateUrl: './about-scan.component.html',
  styleUrls: ['./about-scan.component.scss']
})
export class AboutScanComponent implements OnInit {
  title: String = 'About Wi-Fi Scan';
  constructor() { }

  ngOnInit() {
  }

}

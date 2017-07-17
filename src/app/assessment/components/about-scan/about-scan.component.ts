import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'cp-about-scan',
  templateUrl: './about-scan.component.html',
  styleUrls: ['./about-scan.component.scss']
})
export class AboutScanComponent implements OnInit {
  title: String = 'About Wi-Fi Scan';
  constructor(private router: Router) { }

  ngOnInit() {
  }

  rebooting() {
    this.router.navigate(['/rebooting'], { skipLocationChange: true });
  }
}

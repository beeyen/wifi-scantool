import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'cp-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.scss']
})
export class CompleteComponent implements OnInit {
  title: String = 'Wi-Fi Scan';
  constructor(private router: Router) { }

  ngOnInit() {
  }

  more() {
    this.router.navigate(['/wifi-scan/more'], { skipLocationChange: true });
  }

}

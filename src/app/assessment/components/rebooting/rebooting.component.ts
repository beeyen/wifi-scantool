import { Component, OnInit } from '@angular/core';
import { Store } from '../../../store';
import { Router } from '@angular/router';

@Component({
  selector: 'cp-rebooting',
  templateUrl: './rebooting.component.html',
  styleUrls: ['./rebooting.component.scss']
})
export class RebootingComponent implements OnInit {
  title: String = 'Rebooting Wi-Fi Gateway';
  constructor(private store: Store, private router: Router) {
    const home = JSON.parse(localStorage.getItem('home'));
  }

  ngOnInit() {
  }

  next() {
    this.router.navigate(['/wifi-scan/gateway'], { skipLocationChange: true });
  }
}

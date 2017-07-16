import { Component, OnInit } from '@angular/core';
import { Store } from '../../../store';

@Component({
  selector: 'cp-rebooting',
  templateUrl: './rebooting.component.html',
  styleUrls: ['./rebooting.component.scss']
})
export class RebootingComponent implements OnInit {
  title: String = 'Rebooting Wi-Fi Gateway';
  constructor(private store: Store) {
    const home = JSON.parse(localStorage.getItem('home'));
  }

  ngOnInit() {
  }

}

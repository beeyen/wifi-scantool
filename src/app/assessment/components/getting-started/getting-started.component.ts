import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss']
})
export class GettingStartedComponent implements OnInit {
  title: String = 'Getting Started';
  constructor() { }

  ngOnInit() {
    localStorage.clear();
  }

}

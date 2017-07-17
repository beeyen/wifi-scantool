import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '../../../store';

@Component({
  selector: 'cp-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss']
})
export class GettingStartedComponent implements OnInit {
  title: String = 'Getting Started';
  constructor(private router: Router, private store: Store) { }

  ngOnInit() {
    localStorage.clear();
    this.store.set('results', []);
  }

  scan() {
    this.router.navigate(['/wifi-scan']);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// renders the app’s current route
@Component({
  selector: 'cp-app-root',
  templateUrl: './app.component.html', // need to import app-routing module in app.module
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title: String;
  constructor(private router: Router) { }
  ngOnInit() { }
  onActivate(event) {
    this.title = event.title;
  }
  onDeactivate(event) { }
}

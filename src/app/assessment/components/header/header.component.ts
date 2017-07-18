import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-header',
  template: `
  <nav class="navbar navbar-dark stylish-color fixed-top">
    <div class="container">
        <a class="navbar-brand">
            <strong>{{title}}</strong>
        </a>
    </div>
  </nav>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() title;
  constructor() { }

  ngOnInit() {
  }

}

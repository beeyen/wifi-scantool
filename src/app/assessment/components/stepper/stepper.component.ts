import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {
  @Input() activeStep;
  stepOneStat: String = '';
  stepTwoStat: String = '';
  stepThreeStat: String = '';
  constructor() { }

  ngOnInit() {

    this.stepOneStat = '';
    this.stepTwoStat = '';
    this.stepThreeStat = '';
    switch (this.activeStep) {
      case 1: {
        this.stepOneStat = 'active-step';
        break;
      }
      case 2: {
        this.stepOneStat = 'active-step step-done';
        this.stepTwoStat = 'active-step';
        break;
      }
      case 3: {
        this.stepOneStat = 'active-step step-done';
        this.stepTwoStat = 'active-step step-done';
        this.stepThreeStat = 'active-step';
        break;
      }
      default: {
        this.stepOneStat = 'active-step';
        break;
      }
    }
  }

}

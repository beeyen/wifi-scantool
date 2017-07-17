import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'floorname' })
export class FloorNamePipe implements PipeTransform {
  transform(value: string): string {
    // to make sure it is a number
    const floor = +value;
    switch (floor) {
      case 0:
        return 'Basement';
      case 1:
        return 'First Floor';
      case 2:
        return 'Second Floor';
      case 3:
        return 'Third Floor';
      case 4:
        return 'Fourth Floor';
    }
  }
}

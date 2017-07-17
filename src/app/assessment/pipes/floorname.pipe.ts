import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
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

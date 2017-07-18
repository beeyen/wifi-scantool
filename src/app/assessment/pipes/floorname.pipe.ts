import { Pipe, PipeTransform } from '@angular/core';
import { FLOOR_LIST_DATA } from '../models/types';

@Pipe({ name: 'floorname' })
export class FloorNamePipe implements PipeTransform {
  transform(value: string): string {
    // to make sure it is a number
    const floor = +value;
    return FLOOR_LIST_DATA[floor].desc;
  }
}

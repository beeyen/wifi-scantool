import { Pipe, PipeTransform } from '@angular/core';
import { SQFT_META_DATA } from '../models/types';

@Pipe({ name: 'homesqft' })
export class HomeSqftPipe implements PipeTransform {
  transform(value: number): string {
    const sqftdata = SQFT_META_DATA;
    return sqftdata[+value].name;
  }
}

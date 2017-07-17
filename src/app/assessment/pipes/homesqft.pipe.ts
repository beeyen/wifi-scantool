import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'homesqft' })
export class HomeSqftPipe implements PipeTransform {
  transform(value: number): string {
    // to make sure it is a number
    switch (value) {
      case 1:
        return '0 - 2000 SqFt';
      case 2:
        return '2001 - 4000 SqFt';
      case 3:
        return '4001 - 5000 SqFt';
      case 4:
        return '5001+ SqFt';
      case 5:
        return 'Not known';
    }
  }
}
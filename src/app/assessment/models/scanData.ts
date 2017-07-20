export class ScanData {
  static fromJsonList(array): ScanData[] {
    return array.map(ScanData.fromJson);
  }

  static fromJson({ $key, description }): ScanData {
    return new ScanData(
      $key,
      description);
  }

  constructor(
    public $key: string,
    public description: string) { }
}

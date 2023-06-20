class MonitoringResponseDataResult {
  metric: object;
  value: any[];
}

class MonitoringResponseData {
  resultType: string;
  result: MonitoringResponseDataResult[];
}

export class MonitoringResponseDto {
  status: string;
  data: MonitoringResponseData;
}

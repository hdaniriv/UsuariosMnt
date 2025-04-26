import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import moment from 'moment-timezone';

@Injectable()
export class DateService {
  private readonly timeZone: string;
  private readonly mockDate: Date | null;

  constructor(private configService: ConfigService) {
    this.timeZone = this.configService.get<string>('TIME_ZONE') || 'UTC';

    const mockDateStr = this.configService.get<string>('MOCK_DATE');
    this.mockDate = mockDateStr ? new Date(mockDateStr) : null;
  }

  getNow(): Date {
    if (this.mockDate) return new Date(this.mockDate);
    return moment().tz(this.timeZone).toDate();
  }
}
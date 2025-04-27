import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from './proxy.service';

@Controller('api')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @All('booking/*')
  async proxyBookingService(@Req() req: Request, @Res() res: Response) {
    const path = req.path.replace('/api/booking/', '');
    const result = await this.proxyService.forwardRequest(
      'booking',
      req.method,
      path,
      req.headers,
      req.body,
      req.query,
    );

    res.status(result.status);
    if (result.headers) {
      Object.entries(result.headers).forEach(([key, value]) => {
        if (
          !['host', 'connection', 'content-length'].includes(
            key.toLowerCase(),
          )
        ) {
          res.header(key, value as string);
        }
      });
    }
    res.send(result.data);
  }

  @All('user/*')
  async proxyUserService(@Req() req: Request, @Res() res: Response) {
    const path = req.path.replace('/api/user/', '');
    const result = await this.proxyService.forwardRequest(
      'user',
      req.method,
      path,
      req.headers,
      req.body,
      req.query,
    );

    res.status(result.status);
    if (result.headers) {
      Object.entries(result.headers).forEach(([key, value]) => {
        if (
          !['host', 'connection', 'content-length'].includes(
            key.toLowerCase(),
          )
        ) {
          res.header(key, value as string);
        }
      });
    }
    res.send(result.data);
  }

  @All('logging/*')
  async proxyLoggingService(@Req() req: Request, @Res() res: Response) {
    const path = req.path.replace('/api/logging/', '');
    const result = await this.proxyService.forwardRequest(
      'logging',
      req.method,
      path,
      req.headers,
      req.body,
      req.query,
    );

    res.status(result.status);
    if (result.headers) {
      Object.entries(result.headers).forEach(([key, value]) => {
        if (
          !['host', 'connection', 'content-length'].includes(
            key.toLowerCase(),
          )
        ) {
          res.header(key, value as string);
        }
      });
    }
    res.send(result.data);
  }
}
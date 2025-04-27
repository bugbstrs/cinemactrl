import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ProxyService {
  private serviceUrls = {
    booking: process.env.BOOKING_SERVICE_URL || 'http://localhost:3001',
    user: process.env.USER_SERVICE_URL || 'http://localhost:3003',
    logging: process.env.LOGGING_SERVICE_URL || 'http://localhost:3002',
  };

  async forwardRequest(
    service: 'booking' | 'user' | 'logging',
    method: string,
    path: string,
    headers: any,
    body?: any,
    query?: any,
  ) {
    try {
      let url = `${this.serviceUrls[service]}/${path}`;
      
      if (query && Object.keys(query).length > 0) {
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(query)) {
          if (value !== undefined) {
            queryParams.append(key, value?.toString() ?? '');
          }
        }
        url += `?${queryParams.toString()}`;
      }

      const cleanedHeaders = { ...headers };
      delete cleanedHeaders.host;
      delete cleanedHeaders['content-length'];
      delete cleanedHeaders.connection;

      const fetchOptions: RequestInit = {
        method,
        headers: cleanedHeaders,
        redirect: 'follow',
      };

      if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && body) {
        fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
      }

      const response = await fetch(url, fetchOptions);
      
      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      const responseHeaders = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      return {
        status: response.status,
        data: responseData,
        headers: responseHeaders,
      };
    } catch (error) {
      console.error('Proxy error:', error);
      throw new HttpException(
        'Error contacting service',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

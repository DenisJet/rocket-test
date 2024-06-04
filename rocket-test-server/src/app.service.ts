import { Injectable } from '@nestjs/common';
import { ExchangeCodeOptions } from './ExchangeCodeOptions';
import { ExchangeAccessTokenOptions } from './ExchangeAccessTokenOptions';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getToken(url: string, data: ExchangeCodeOptions) {
    return await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((response) => response.json());
  }

  async refreshToken(url: string, data: ExchangeAccessTokenOptions) {
    return await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((response) => response.json());
  }

  async getDeals(url: string, token: string) {
    return await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((deals) => deals._embedded.leads);
  }
}

import { Injectable } from '@nestjs/common';
import { ExchangeCodeOptions } from './ExchangeCodeOptions';
import { ExchangeAccessTokenOptions } from './ExchangeAccessTokenOptions';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

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

  async getDeals(token: string, query?: string) {
    const url = 'https://denisjet.amocrm.ru/api/v4';
    query && query.length >= 2 ? query : (query = '');

    const data = await firstValueFrom(
      this.httpService
        .get(`${url}/leads?with=contacts&query=${query}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        })
        .pipe(
          map((res) => res.data),
          catchError((error) => {
            throw `ERROR - ${error}`;
          }),
        ),
    );

    const leads = data?._embedded.leads?.map(async (lead: any) => {
      const user = async () => {
        return await firstValueFrom(
          this.httpService
            .get(`${url}/users/${lead.responsible_user_id}`, {
              headers: {
                Authorization: 'Bearer ' + token,
              },
            })
            .pipe(map((res) => res.data.name)),
        );
      };

      const status = async () => {
        return await firstValueFrom(
          this.httpService
            .get(
              `${url}/leads/pipelines/${lead.pipeline_id}/statuses/${lead.status_id}`,
              {
                headers: {
                  Authorization: 'Bearer ' + token,
                },
              },
            )
            .pipe(map((res) => res.data.name)),
        );
      };

      const date = new Date(lead.created_at * 1000);
      const formattedDate = `${('0' + date.getDate()).slice(-2)}.${('0' + (date.getMonth() + 1)).slice(-2)}.${date.getFullYear()}`;

      const contacts = async () => {
        return await firstValueFrom(
          this.httpService
            .get(`${url}/contacts/${lead._embedded.contacts[0].id}`, {
              headers: {
                Authorization: 'Bearer ' + token,
              },
            })
            .pipe(map((res) => res.data)),
        );
      };
      const contact = await contacts();

      return {
        name: lead.name,
        price: lead.price,
        status: await status(),
        user: await user(),
        date: formattedDate,
        contacts: {
          name: contact.name,
          phone: contact.custom_fields_values[0]?.values[0]?.value,
          email: contact.custom_fields_values[1]?.values[0]?.value,
        },
      };
    });
    return Promise.all(leads);
  }
}

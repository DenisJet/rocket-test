import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private accessToken = '';
  private refreshToken = '';
  private clientId = 'e2473869-8661-4bec-87f7-0af2c699eef6';
  private clientSecret =
    'kWSdvCU7zGnVFtgVHLm51VapKIDHoenHCKfw2uZIsfkwy1rqsLmMthjiW7jgOe0M';
  private redirectUrl = 'https://example.com';
  private code =
    'def50200c77583d7e449a3b1106fc85446dd2245ae1a2f25b8ba2d3b43ecb8f59f9e91a03f6798117cc45d815f8e660aeb18344ecb3aa32bac4edabc8376bdea95100e80e14d70723f511f6a23514deffcb0516d54d9badd27d56e4c3b317c44ee0b23c1d5a7fe6364f8fc992e2d6e60265134f7b771e09090066d87b0d2e9670b53dc437f74d16176156c3453f3939e68818b9a7cb4c041c4d389fc56fcf8534e888e94247ae59f14a5b824d7d0ef5b6b0594bc9bdaabd1cd46a3c0efd39303d69b7ed39b4ff69921f7d22122e179945c5bd27ff7890d35b2af6d868381623e8cc4096dd196905c2811bdb51ee5ddcfdf4f08d5211d55bc1dd4e5e7e904614fa18a969ae48d0ac12268dd7a6b99a28c99061b0d36a83190da0f327dc1b9a4b83c534b9b3e8e70572aecdafddd2d675675cd1d36a3f2f5266138e77678869560a633028d162a0cc4899c59a492f35371090c373ebdaad0c38dd05f700bc63aeb34740f1ce1e9443fbc7b057ce3e3a64c017a9830e90afb81d04afe15ba8b7de70cd7faee92cc665691973f656859dabe188688c2a700a028eab98bc23dfa784101083fa6def7f5781134a67b35fed296f6ce998cf3e8a8239be84c4fc39287f602e0d77b0fbcb9cc51d6fd7b63c6d8282a9e41ea87aaf3a570ba1d26af9ad022ba1a1acf';

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/api/leads')
  async getDeals() {
    const data = [];

    if (!this.accessToken && !this.refreshToken) {
      console.log('needAccesstoken');
      const newToken = await this.appService.getToken(
        'https://denisjet.amocrm.ru/oauth2/access_token',
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'authorization_code',
          code: this.code,
          redirect_uri: this.redirectUrl,
        },
      );
      this.accessToken = newToken.access_token;
      this.refreshToken = newToken.refresh_token;
    }

    if (this.accessToken === '' && this.refreshToken.length > 0) {
      console.log('needRefreshtoken');
      const newToken = await this.appService.refreshToken(
        'https://denisjet.amocrm.ru/oauth2/access_token',
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken,
          redirect_uri: this.redirectUrl,
        },
      );
      this.accessToken = newToken.access_token;
      this.refreshToken = newToken.refresh_token;
    }

    const deals = await this.appService.getDeals(
      'https://denisjet.amocrm.ru/api/v4/leads',
      this.accessToken,
    );

    deals.forEach((deal) => {
      const dataDeal = {
        id: deal.id,
        date: deal.created_at,
        name: deal.name,
        price: deal.price,
      };
      data.push(dataDeal);
    });

    console.log(deals);
    console.log(data);
    return data;
  }
}

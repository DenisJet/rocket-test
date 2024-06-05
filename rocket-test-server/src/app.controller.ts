import { Controller, Get, Query } from '@nestjs/common';
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
    'def5020058f2c4b966c399049f010777b0b99aaf5fa22df9ff1e4d3b356123766ece3762570595dd2465e17ca3a5ab5793aaa1d4348ece6b153a9de83fdba9bf5d59d7d9749676529934caccf7bbd9d3d3eaae65723f3ecf8401d9741a4fd7cc8dc7541616f5e26f5ec045be25fbc2a4ae476255dc9e5be10e7cad7d0960736ecc8caf014e5e208d597cb7fd30e7af20b4568fd096afdf8e75e5c39ac4ada8977037ba64075b9823b3d38e042ca133f7030f5a1ff4b29816dffa0e13458332fd5f7c15cd01e76ade1bf50a1911e8e457edfa5eb90226f51bb949aca5dd619f0153bac34b59646c190f3ba5cf7100d24e912cc48b58c2897b699fced49c8bd70e06b1de4f2ba72be5d7dc7331ad80a93325c918199c6a42bf00207a68217afcffba7f5d0380711e26dfab3040689d8cc149b21d12deec6e15259f142272379022cb91186a06480cd9eff637aa63579246c86ff186534031dc70c15212a1c5aed2bf427358b1fe457c440fefe4826fe9766e61623ac4b5daa2980a3db7591e2d1fa54453c600be54c370c425b1f93fd317832d4a99c0e3f07865bec57498f74e6f6f6d2605a25bb56f93b3eb5ccd32d907568a9af83b1c5d2e7a03ceed4cf62e9fd8ebbe08e686aa43ab83eeda94cb975c5bdb1aefc6ce79efc089c94d4d84ec9d6019c7e2';

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/api/leads')
  async getDeals(@Query('query') query?: string) {
    if (!this.accessToken && !this.refreshToken) {
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

    const data = await this.appService.getDeals(this.accessToken, query);

    console.log(data);
    return data;
  }
}

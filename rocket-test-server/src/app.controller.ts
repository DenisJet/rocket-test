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
    'def50200e7dd249c1624525c86504e282a44344e0ca307e530aa7a27e9fff635777a391d02e85c468f8b54c85f9091a7df8a2778dbbc7f5deab6d4e2aa772067172c85e9d30aa03c3c2b5da7382a4ab0cc081da2c92fa1c21f4ad567f2dfe89aee89af066d3a6870dd9f605b23af4e3b1edd281c5253b420ddaed5212e9e2e08e714c15bfa0e01609cc5f00065b695c336864ba2a1aa9b239484c5869ab279fb7e166e560b04807621e3165e3984715a80e54af7f9a751e30cc224e04d51b512ea581204f1e1d6b307591d84136e6891cad3bb523edbbf085493787f91b3c0bdb99c36a88b4b694f293566c5daef11797931f546cefaf3bf903c6735978f0c393a2f35c6eee7072ae4a6af8641f2a92f789706890949fdf245a2e6665759e089a67db66b9ba00e2149af96284198f72bd2a7492f42cfa263f336bd78ddad73462ca0411c4a10de959717e7f1902184df6a765d9d4bf07989be1880524cbbc6eaab8592ffe63e44a2a6b4a3c2f403898ff1cb21b7913d0a5e309b7582ef6f7e695f16ade282f57c6e8e7d45d5a1b608e9af6bc6a8159fd2e599ed63cd13d7e303831b8edffc841bf8bf96a58a17024b71e3e36d56fe569bc5e3b3b126e3eb6f9deea09958b5946ef3d3f83cbc96579d8b9319d21ab58b9a9b5bba2c25f0bcd07cedfb046c';

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/api/leads')
  async getDeals() {
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

    const data = await this.appService.getDeals(
      'https://denisjet.amocrm.ru/api/v4',
      this.accessToken,
    );

    console.log(data);
    return data;
  }
}

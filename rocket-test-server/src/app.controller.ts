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
    'def502008cd41fc17a4f8af953949a7f03b24cad063c1cb7d6490990059f963494c5e29f81efb94a15934aadd4a65f7af993c0fbfb4c8dc2cf17889f9aa6b64bdde6cefd2aa6900f626863e8350bad2ced1e05bcc33995cef204a158280b07865855553b0347e87c511b8ae28348a4edf942b19cade7884d1306af39650ce335e81ffc6c7f626885174fddaca4058b30b70ad81d9e51a23615fca82d5df666572e5144529482ca0f941951a96183a1ab27833cd8baa280a332c807408daaf8475dc3bbcadaef3d863bceabf26ed359a726e4b08275226461a5892c0095415c7f2918b2e09a8e8d1280436fe408841b9f8916adc8557b22c7ee65907dd0acb809677c7a2b3b890caf4c1b284c8c92fadd4847ae59dabc998591b02bf8dc98ad24f1d5b370f8c1613a552802ca46d098210b27e9a6b3f8775dbd59e2fa1a6625048d750fe48053820a7d239132f4d9cd7f1f840b492c6379e69a0e26826e8a37695a10666f288b767cc95403f0423c1de32e446e0a2ef906fa2784fdbe225b4b33b51be111664298939cc96ecec75ca6d126a06cee2dc57746725637e7754ae68a56e059c4f483a0d8eaa77c940846c95ad32a25e1fd8039502242b8ccccf2a04bc8ff67e686ef8d0927279330159ff226ce9f79ae52e55730795a196829a3ed9bea419775';

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

    const deals = await this.appService.getDeals(
      'https://denisjet.amocrm.ru/api/v4/leads',
      this.accessToken,
    );
    return deals;
  }
}

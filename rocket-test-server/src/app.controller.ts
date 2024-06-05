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
    'def50200a3e472af7948ffdc58cb8ff93b0fc219a28e7130f1a763dd7e4abf09b3ab35dfdde40f44604d05336194c265077624614e2f33fd47a698223edb7afc140251b87c6c08b125c3bea35e57ef16b4155a1670da89ff924a6ca7efb81d531b85454bcb22b4cbaf58eb79cf1902832e4c724e87caae461d3b8dd4079e8cb81d441a72035c254aa902dcd6cbbfc55b3ff78496e53ceb1cd0071376c977b9a54c9b0428112aef088e05d65bec0bd3aff7c9fa0d285795db896f39d4260b78f4e67f8fac8f888f0e43e74791d9c98534f3aad023c9536969c592754484d0fc433c329e83a3a8be80b958e0ca364203340e21daa83731e53589a947fc62ee0f2e2c576f577ed55f9568df4788c13a41b9a7a2547b42be85b989266ec9f098bdafb18c3168b1719cf5f1ef8b0c69448bfb12e7e148b4dca36bd72c7043c5c31216ec989d612a7b7f7cae73e3ea711200ce7664124761e5f27e473f5a374bd08a70ea25028b8df6d8a5b2d8fd4368057817d1630068b804056dfcd1b9169eafd11ae9551576f68f14727f0ba704db4e95f03ce5ee3f2c6604e595ba6d81d1cd1106d1f7b68963eb6cf2b52cb485445346bd118f3653d093d42dd0bc4d0e8569008aecbc90692788ca38cb23c281b9457b42913c31abd72db66d4eee56e6df22d1c5134162d2';

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

    if (!this.accessToken && this.refreshToken) {
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
    return data;
  }
}

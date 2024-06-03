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
    'def50200b6814443419ac5f16c1cb2c159da6f51e9922a3e46f5b8e830dc142b77d0bd02277c6ca6e71461b342a563de301473fd804a8df23340a8a05459a52f8cc623159b8a239b3086675f2e4a6e114a47b992ba5d3b83d708c3f815cf7e8b1a72a41d6c685ac9d49e375ebb34ec2d4384b85c82e4de831fd870147a1f182f8bda183d2523dcadabdde6e90a2dc55ce9a6ce03dad36f4a74b3dd59ae62e07f1c2770fbfa3101a5e5f5cee682d30507f0059a14293c2346f181c4e447e639d9c2d222a5e6ad31fe109d4c92309819e787826a9720b2042c8790ffbe8979f6af31c1b68829088439acef541129c32cc5e8f2c6388419a5421e79fa85a4048bee3bc133bd82d7ba946cd0aa237a1240550a9e51c4cd2f39d991188979a982e6763e1f8a690899fa6a3ec2947d228e93088bac2c8957a862cb8da8f23b53c14b55ffe4d6e07612a7ba1bcf22738d512ebafeb6bcb847d09e797f51f54ee6179961e53b93294cdd031e56486eb4dd26ec9f66944f38473288de03f8c0688f5ab975724ffd251ed739400eb7afabd624b0c39834dc29c53af10a8b0da9fd85814f2c943e4ba4eaa8919fa79ffd8de4a4af177aa6d4c8f21b682259c4bcfe6a0969801171e4694fdfcf4267aaa0d521312660c4f776732d997c79d6a0d66a09f1cd0865a46797';

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

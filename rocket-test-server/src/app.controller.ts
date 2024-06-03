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
    'def5020023e7d528e54b5384ff006d480e92945711f0740807e4bdd5a8cd5df0fd510cb8e77c90cb6666c8b7456d3c2f46427bd996ac72f4c4dd6b198d6f270efa6ef32ab1869c8bfaf624b0199aef895be53db0ed1259069b0302f291daea89ec1b1830ca25e971dcb0a29f717b4153a156c397481bff1fd313e37e1eedc4e15c8576612e8fb445bd1602522d6cdeb759cfdc15c384f5e164aec4676f5cc18044710f85b350bc7860276e03eb1aadaf845adb3c21e199e769ad21591aa16db4e6e484a94f34fedaf01e725e6c5768b3269da92ffacea3597fb84d1427cc2e75452d734a8dc86cc612defee805a461fe9e0ff4d1d3f93174182edfe450ca102921d2caa2aeca1da2d2121d79f9b3867e8e90f86fa3b838f8a5549319d5197f7c878648fbdfe78083ab2f001de8f352eccbd545b18168b3e8bb80b562dbfb0aa3c632954f85dc6e34dd848746fce87a153f15d2c393c9343999f772a2824472bebddd70b291069a5df1be94ea162331ae69707ee24af6fb38bda21a573b922f21dd55113f738a3d7129a6a8ecde906c7194894f1090008dfa913eb4f1b3d6945df3122770f62fcb908107999b9bbaad3ea26050410d4451529e084ed630071bd2cfac9ba11bdeb3505e500be65f567d9bf4aecbd5f66291fccdc26b550a7a20a8a1e3de37';

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
      'https://denisjet.amocrm.ru/api/v4/leads',
      this.accessToken,
    );

    console.log(data);
    return data;
  }
}

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
    'def50200185a9562075248974a02e109f1e583b94ae975a6a08f290d918c346fad5a069a02489cc3ea0e237609418a5578757d781288052ce97bc92cf67f6985cf4a53dea59fece05ad183269303ff0f683073bdaa497d344a7eac80c8ffb15db4f92f8e0d2f1696789abe71d3cad41cd6e862a98137ae6ae2c43252b249eb168ed873d4073a89f0dcb1558f19bc23ab84cc5091968083d3c96b4c7af8499bef1d03f52890ed97a5fbad98cb0a83b51d26be91c88fc27f2c0ecfc528f6590a4f40a6c43ae813c568d522a07b8495a5f62d1a2fd065d29f2a0412f027522d464818ad12d82b2a2e8ef669b4c7e046aed2d1c03e6ad62019c348de34c750a1e301acaf6fefadfbce653dd97ba0d0fef08a5e32962e6f5d8a91845e71b154f936c1d9a21e9b1ed839de60c3e582069af47a80f033d5106ae5a6e34b6988e80a8efa3792fc66397eecf33a27bf9eb9abadf09e1361e90ca8cc0119f5272e5e838f8d7a17c715058adf44ff302a4131ef2cbb2672f80519b57222682ea1796570c86fcb6bbff03f2104ec911cbb177877fdbf60ee442afab5e1d599206a62aa1db78bc66c2b16b6f8940a2dcae55941d14ac95f82eb3f44e2a5ac30d99e76e881d78f524db30d37e9774879458640171063c98ec903e250c51cc56fb14086e7571c3605f74b2f';

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

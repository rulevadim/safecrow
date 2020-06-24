import Dadata from 'dadata-suggestions';

export class DadataService {
  public static dadata = new Dadata(process.env.VUE_APP_DADATA_TOKEN);
}

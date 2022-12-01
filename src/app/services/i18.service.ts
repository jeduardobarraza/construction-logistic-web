import { Injectable } from '@angular/core';
//import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class I18Service {
  constructor() { //private translate: TranslateService
    //translate.setDefaultLang('es');
    //translate.use('es');
  }

  //   t = (path: string, params: object = {}) =>
  //     firstValueFrom(this.translate.get(path, params));
}

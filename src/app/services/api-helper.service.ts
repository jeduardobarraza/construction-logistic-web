import { Injectable } from '@angular/core';
import { IApiHelperOptions } from '../interfaces/api-helper-options.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiHelperService {
  #window: any = { DatosUsuario: null };
  userData: any = {};
  baseDomain = 'https://managing-micheline-jeduardobarraza.koyeb.app';

  constructor() {
    this.#window = window;
    this.userData = this.#window.DatosUsuario;
  }

  httpAction = (
    method: string,
    controller: string,
    options: IApiHelperOptions = {},
    domain: string = this.baseDomain
  ) => {
    const { query = '', path = '', body } = options;
    console.log('body>>>', body);
    const url = `${domain}/${controller}/${path}${
      query !== '' ? `?${query}` : ''
    }`;
    let httpConfig: any = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (body) httpConfig['body'] = JSON.stringify(body);
    return fetch(url, httpConfig)
      .then((data) => data.json())
      .catch((error) => {
        console.log('***********error', error);
        throw error;
      });
  };

  getAsync = async (
    controller: string,
    options: IApiHelperOptions = {},
    domain: string = this.baseDomain
  ) => {
    return this.httpAction('GET', controller, options, domain);
  };

  postAsync = (
    controller: string,
    options: IApiHelperOptions = {},
    domain: string = this.baseDomain
  ) => this.httpAction('POST', controller, options, domain);

  updateAsync = (
    controller: string,
    options: IApiHelperOptions = {},
    domain: string = this.baseDomain
  ) => this.httpAction('PUT', controller, options, domain);

  deleteAsync = (
    controller: string,
    options: IApiHelperOptions = {},
    domain: string = this.baseDomain
  ) => this.httpAction('DELETE', controller, options, domain);
}

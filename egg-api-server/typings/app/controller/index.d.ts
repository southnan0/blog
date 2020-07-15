// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportArticle from '../../../app/controller/article';
import ExportHome from '../../../app/controller/home';
import ExportLogin from '../../../app/controller/login';
import ExportSort from '../../../app/controller/sort';

declare module 'egg' {
  interface IController {
    article: ExportArticle;
    home: ExportHome;
    login: ExportLogin;
    sort: ExportSort;
  }
}

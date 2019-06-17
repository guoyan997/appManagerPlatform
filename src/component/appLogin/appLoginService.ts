/**
 * Created by guoyan on 2018/1/22.
 */
import {Injectable} from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Setting} from '../../../setting';
@Injectable()
export class AppLoginService {
  setting = new Setting() ;
  constructor(private http:  HttpClient) {}
/**
  checkLogin(username, password) {
    const params = new HttpParams().set('username', username).set('password', password);
    const body = {username: username, password: password};
    return this.http.post(this.setting.urlStr + '/appUser/checkLogin', body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }
**/


changeUserPassword(username, password, newPassword, reNewPassword) {
  const body = {username: username, password: password, newPassword: newPassword, reNewPassword: reNewPassword};
  return this.http.post(this.setting.urlStr + '/appUser/changeUserPsw', body, {
    headers: new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8'),
  });
}




}

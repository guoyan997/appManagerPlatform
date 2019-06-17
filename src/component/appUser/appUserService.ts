/**
 * Created by guoyan on 2018/4/13.
 */
import {Injectable} from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import { ProjectModel } from '../../model/ProjectModel';
import {Setting} from '../../../setting';

@Injectable()
export class AppUserService {

  setting = new Setting() ;
  constructor(private http:  HttpClient) {}

  // 查找用户列表
  findUserByCreatorId(creatorId) {
    const params = new HttpParams().set('creatorId', creatorId);
    return this.http.get(this.setting.urlStr + '/appUser/findUserListByCreatorId', {params});
  }

  // 添加用户
  createUser(username, password, creatorId) {
    const body = {username: username, password: password, creatorId: creatorId};
    return this.http.post(this.setting.urlStr + '/appUser/createUser', body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8'),
    });
  }

  // 修改用户信息
  modifyUser(userId, username, password) {
    const body = {id: userId, username: username, password: password};
    return this.http.post(this.setting.urlStr + '/appUser/updateUser', body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8'),
    });
  }

  // 删除用户
  deleteUser(userId) {
    const params = new HttpParams().set('id', userId);
    return this.http.get<ProjectModel[]>(this.setting.urlStr + '/appUser/deleteUserById', {params});
  }


}

/**
 * Created by guoyan on 2018/3/29.
 */
import {Injectable} from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import { ProjectModel } from '../../model/ProjectModel';
import {Setting} from '../../../setting';

@Injectable()
export class AppProjectService {

  setting = new Setting() ;
  constructor(private http:  HttpClient) {}


  getProjectListData(creatorId) {
    const params = new HttpParams().set('creatorId', creatorId);
    return this.http.get<ProjectModel[]>(this.setting.urlStr + '/appProject/findAllProjects', {params});
  }

  createProject(projectName, description, creatorId) {
    const body = {projectName: projectName, description: description, creatorId: creatorId};
    return this.http.post(this.setting.urlStr + '/appProject/createProject', body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8'),
    });
  }

}

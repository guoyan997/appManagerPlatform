/**
 * Created by guoyan on 2018/3/29.
 */

import {Injectable} from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Setting} from '../../../setting';

@Injectable()
export class ProjectDetailService {

  setting = new Setting() ;
  constructor(private http:  HttpClient) {}

  modifyProject(projectId, projectName, description) {
    const body = {projectId: projectId, projectName: projectName, description: description};
    return this.http.post(this.setting.urlStr + '/appProject/updateProject', body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8'),
    });
  }

  deleteProject(projectId, creatorId) {
    const params = new HttpParams().set('projectId', projectId).set('creatorId', creatorId);
    return this.http.get(this.setting.urlStr + '/appProject/deleteProject', {params});
  }

// 通过工程id去查询该工程下的分支以及各个分支的下载量情况，用于右上方展示
  findBranchsByProjectId(projectId) {
    const params = new HttpParams().set('projectId', projectId);
    return this.http.get(this.setting.urlStr + '/appBranch/findNewstBranchsByProjectId', {params});
  }

  findBranchDownloadCountByProjectId(projectId) {
    const params = new HttpParams().set('projectId', projectId);
    return this.http.get(this.setting.urlStr + '/appBranch/findBranchsByProjectId', {params});
  }

  // 通过工程id查找该工程的信息用于左上方展示
  findProjectInfoByProject(projectId) {
    const params = new HttpParams().set('projectId', projectId);
    return this.http.get(this.setting.urlStr + '/appProject/findProjectById', {params});
  }

  // 创建分支
  createBranch(branchName, description, projectId, creatorId) {
    const body = { branchName: branchName, description: description, projectId: projectId, creatorId: creatorId};
    return this.http.post(this.setting.urlStr + '/appBranch/createBranch', body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8'),
    });
  }









}

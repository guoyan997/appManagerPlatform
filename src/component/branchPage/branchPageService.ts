/**
 * Created by guoyan on 2018/4/9.
 */
import {Injectable} from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Setting} from '../../../setting';
@Injectable()
export class BranchPageService {

  setting = new Setting() ;
  constructor(private http:  HttpClient) {}

  // 删除分支
  deleteBranch(projectId, branchId, creatorId) {
    const params = new HttpParams().set('branchId', branchId).set('projectId', projectId).set('creatorId', creatorId);
    return this.http.get(this.setting.urlStr + '/appBranch/deleteBranch', {params});
  }

  // 修改版本的描述信息
  modifyVersionDesc(versionId, versionDescription ) {
    const body = {versionId: versionId, versionDescription: versionDescription};
    return this.http.post(this.setting.urlStr + '/appVersion/updateVersion', body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8'),
    });
  }

  // 通过branchId 去查询该分支下的版本列表数据
  findVersionListByBranchId(branchId) {
    const params = new HttpParams().set('branchId', branchId);
    return this.http.get(this.setting.urlStr + '/appVersion/findVersionListByBranchId', {params});
  }

  // 修改分支的信息
  modifyBranchInfo(projectId, branchId, branchName, description ) {
    const body = {projectId: projectId, branchId: branchId, branchName: branchName, description: description};
    return this.http.post(this.setting.urlStr + '/appBranch/updateBranch', body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8'),
    });
  }
  // 通过brandID去查询一个分支的详细信息
  findBranchById(branchId) {
    const params = new HttpParams().set('branchId', branchId);
    return this.http.get(this.setting.urlStr + '/appBranch/findBranchById', {params});
  }
  // 通过versionId 删除某个版本
  deleteVersionByVersionId(projectId, branchId, versionKey, versionCode, versionId, creatorId) {
    const params = new HttpParams().set('projectId', projectId).set('branchId', branchId)
      .set('versionKey', versionKey).set('versionCode', versionCode).set('versionId', versionId).set('creatorId', creatorId);
    return this.http.get(this.setting.urlStr + '/appVersion/deleteVersion', {params});
  }

  // 通过versionKey和platform去查找关联关系
  findRelationByKey(versionKey, platform) {
    const params = new HttpParams().set('versionKey', versionKey).set('platform', platform);
    return this.http.get(this.setting.urlStr + '/appRelation/findRelationByKey', {params});
  }
  // 查找可以进行关联的渠道
  findRelationListForSelect (versionKey, platform, creatorId) {
    const params = new HttpParams().set('versionKey', versionKey).set('platform', platform).set('creatorId', creatorId);
    return this.http.get(this.setting.urlStr + '/appRelation/findRelationListForSelect', {params});
 }
  createRelation (androidKey, iosKey) {
    const params = new HttpParams().set('androidKey', androidKey).set('iosKey', iosKey);
    return this.http.get(this.setting.urlStr + '/appRelation/createRelation', {params});
  }
  updateRelation (androidKey, iosKey, turn) {
  const params = new HttpParams().set('androidKey', androidKey).set('iosKey', iosKey).set('turn', turn);
  return this.http.get(this.setting.urlStr + '/appRelation/updateRelation', {params});
}
  deleteRelation (androidKey, iosKey) {
    const params = new HttpParams().set('androidKey', androidKey).set('iosKey', iosKey);
    return this.http.get(this.setting.urlStr + '/appRelation/deleteRelation', {params});
  }



}

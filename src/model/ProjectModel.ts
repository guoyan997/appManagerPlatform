/**
 * Created by guoyan on 2018/3/29.
 */
import {ImageModel} from './ImageModel';
export class ProjectModel {
  projectId: string;
  projectName: string;
  packageName: string;
  description: string;
  creator: string;
  createTime: string;
  iconPath: string;
  imageList: ImageModel[];
}

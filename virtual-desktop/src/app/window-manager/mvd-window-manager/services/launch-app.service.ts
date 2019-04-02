import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()


export class LaunchAppService {

  host: string;
  port: number;
  connectionSettings: any;

  constructor() {
  }

  launch(appId: string, argumentFormatter: any, parameters: any): void {
    const dispatcher: any = ZoweZLUX.dispatcher;
    const pluginManager: any = (window as any).ZoweZLUX.pluginManager;
    const plugin = pluginManager.getPlugin(appId);
    const actionTitle = 'Launch app from ' + appId;
    const actionID = appId + '.launch';
    if (!plugin) {
      console.log('Plugin is undefined, launching default app');
      appId = 'com.rs.mvd.myplugin';
    }
    const mode = dispatcher.constants.ActionTargetMode['PluginCreate'];
    const type = dispatcher.constants.ActionType['actionLaunch'];
    const action = dispatcher.makeAction(actionID, actionTitle, mode, type, appId, argumentFormatter);
    const argumentData = {'data': parameters};
    dispatcher.invokeAction(action, argumentData);
  }

}

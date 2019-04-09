

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/

import { Component, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContextMenuItem } from 'pluginlib/inject-resources';
import { WindowManagerService } from '../shared/window-manager.service';
import { BaseLogger } from 'virtual-desktop-logger';

@Component({
  selector: 'rs-com-mvd-desktop',
  templateUrl: 'desktop.component.html'
})
export class DesktopComponent {
  contextMenuDef: {xPos: number, yPos: number, items: ContextMenuItem[]} | null;
  private authenticationManager: MVDHosting.AuthenticationManagerInterface;
  public isPersonalizationPanelVisible: boolean;
  public isSearchPanelVisible: boolean;

  constructor(
    public windowManager: WindowManagerService,
    private http: HttpClient,
    private injector: Injector
  ) {
    // Workaround for AoT problem with namespaces (see angular/angular#15613)
    this.authenticationManager = this.injector.get(MVDHosting.Tokens.AuthenticationManagerToken);
    this.contextMenuDef = null;
    this.authenticationManager.registerPostLoginAction(new AppDispatcherLoader(this.http));
    this.authenticationManager.registerPostLoginAction(new SearchHandlerLoader(this.http));
    this.authenticationManager.registerPreLogoutAction(ZoweZLUX.searchManager);    
  }
  ngOnInit(): void {
    this.windowManager.contextMenuRequested.subscribe(menuDef => {
      this.contextMenuDef = menuDef;
    });
  }

  showPersonalizationPanel(): void {
    this.isPersonalizationPanelVisible = true;
  }

  hidePersonalizationPanel(): void {
    this.isPersonalizationPanelVisible = false;
  }

  personalizationPanelToggle(): void {
    this.isPersonalizationPanelVisible = !this.isPersonalizationPanelVisible;
  }

  searchPanelToggle(): void {
    console.log('toggling search panel');
    this.isSearchPanelVisible = !this.isSearchPanelVisible;    
  }

  closeContextMenu(): void {
    this.contextMenuDef = null;
  }
}

//must do search loding here rather than in search UI, due to the UI being JIT loaded
class SearchHandlerLoader implements MVDHosting.LoginActionInterface {
  private readonly log: ZLUX.ComponentLogger = BaseLogger;

  constructor(public http: HttpClient) { }
  
  async onLogin(username:string, plugins:ZLUX.Plugin[]) {
    this.log.info("Loading search handlers upon login of user="+username);
    for (let plugin of plugins) {
      let plugin1_1: ZLUX.Plugin1_1 = (plugin as ZLUX.Plugin1_1);
      if (plugin1_1.getSearchCapabilities) {
        await ZoweZLUX.searchManager.loadHandlers(plugin1_1);
      }
    }
    return true;
  }

}

class AppDispatcherLoader implements MVDHosting.LoginActionInterface {
  private readonly log: ZLUX.ComponentLogger = BaseLogger;
  constructor(private http: HttpClient) { }

  async onLogin(username:string, plugins:ZLUX.Plugin[]) {
    let desktop:ZLUX.Plugin = ZoweZLUX.pluginManager.getDesktopPlugin();
    let recognizersUri = ZoweZLUX.uriBroker.pluginConfigUri(desktop,'recognizers');
    let actionsUri = ZoweZLUX.uriBroker.pluginConfigUri(desktop,'actions');
    this.log.debug(`Getting recognizers from "${recognizersUri}", actions from "${actionsUri}"`);
    let config: any = await this.http.get(recognizersUri).toPromise();
    if (config) {
      let appContents = config.contents;
      let appsWithRecognizers:string[] = [];
      plugins.forEach((plugin:ZLUX.Plugin)=> {
        let id = plugin.getIdentifier();
        if (appContents[id]) {
          appsWithRecognizers.push(id);
        }
      });
      appsWithRecognizers.forEach(appWithRecognizer=> {
        appContents[appWithRecognizer].recognizers.forEach((recognizerObject:ZLUX.RecognizerObject)=> {
          ZoweZLUX.dispatcher.addRecognizerFromObject(recognizerObject.clause,recognizerObject.id);
        });
        this.log.info(`Loaded ${appContents[appWithRecognizer].recognizers.length} recognizers for App(${appWithRecognizer})`);
      });
    }

    config = await this.http.get(actionsUri).toPromise();
    if (config) {
      let appContents = config.contents;
      let appsWithActions:string[] = [];
      plugins.forEach((plugin:ZLUX.Plugin)=> {
        let id = plugin.getIdentifier();
        if (appContents[id]) {
          appsWithActions.push(id);
        }
      });
      appsWithActions.forEach(appWithAction=> {
        appContents[appWithAction].actions.forEach((actionObject:any)=> {
          let mode: any = ZoweZLUX.dispatcher.constants.ActionTargetMode[actionObject.targetMode];
          let type: any = ZoweZLUX.dispatcher.constants.ActionType[actionObject.type];
          if (actionObject.id && actionObject.defaultName && actionObject.targetId && actionObject.arg && mode !== undefined && type !== undefined) {
            ZoweZLUX.dispatcher.registerAction(ZoweZLUX.dispatcher.makeAction(actionObject.id, actionObject.defaultName, (mode as ZLUX.ActionTargetMode), (type as ZLUX.ActionType), actionObject.targetId, actionObject.arg));
          }
        });
        this.log.info(`Loaded ${appContents[appWithAction].actions.length} actions for App(${appWithAction})`);
      });
    }
    return true;
  }
}

window.onbeforeunload = function(e: Event) {
  let dialogText = 'Are you sure you want to navigate away from the Desktop? Apps & Changes will be lost.';
  e.returnValue = false;
  return dialogText;
}


/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/


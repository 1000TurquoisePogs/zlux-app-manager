

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/

import { Component, ElementRef, HostListener, Output, EventEmitter, Injector } from '@angular/core';
import { WindowManagerService } from '../shared/window-manager.service'
//import { TranslationService } from 'angular-l10n';
//import { config }  from './test/types';
//import { HelloHandler, pluginDefs } from './test/ooc-app';



@Component({
  selector: 'org-zowe-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.css']
})
export class SearchPanelComponent {
  @Output() menuStateChanged: EventEmitter<boolean>;
  isActive: boolean = false;
  pluginManager: MVDHosting.PluginManagerInterface;
  public applicationManager: MVDHosting.ApplicationManagerInterface;

  
  public displayDescription: boolean = true;
  public style: any = {};
  
  constructor(
    private elementRef: ElementRef,
    public windowManager: WindowManagerService,
    private injector: Injector,
    // private translation: TranslationService
  ) {
    // Workaround for AoT problem with namespaces (see angular/angular#15613)
    this.applicationManager = this.injector.get(MVDHosting.Tokens.ApplicationManagerToken);
    this.pluginManager = this.injector.get(MVDHosting.Tokens.PluginManagerToken);
    this.menuStateChanged = new EventEmitter<boolean>();
    let test = true;
    if (test) {
/*
      const configJson:any = config;
      for (let i:number = 0; i < configJson.searchNodes.length; i++){
        //TODO put this elsewhere
        const handler = new WebSearchHandler(
          {
            definition: configJson.searchNodes[i],
            id: "_web:search."+configJson.searchNodes[i].name
          });
        ZoweZLUX.searchManager.addSearchHandler(handler);
      }


      for (let i:number = 0; i < pluginDefs.length; i++){
        //TODO put this elsewhere
        const plugin = pluginDefs[i];
        for (let j = 0; j < plugin.search.handlers.length; j++) {
          const handlerDef = plugin.search.handlers[j];
          const id = plugin.identifier+":search."+handlerDef.name;
          const initName: string = ''+handlerDef.initializerName;
          //TODO big typescript hack... ooc-app.ts was being silently skipped
          if (initName == 'helloInit') {
            const handler:any = new HelloHandler({
              definition: handlerDef,
              //TODO make something that isnt going to conflict or look weird with dataservices
              id: id,
              pluginDefinition: plugin,
              logger: ZoweZLUX.logger.makeComponentLogger(id)
            });

            ZoweZLUX.searchManager.addSearchHandler(handler);
          }        
        }
      }
*/
    }
  }

  ngOnInit(): void {
  }

  focus(): void {
    this.style['z-index'] = 100;
  }

  close(): any {
    const t = this;
    return function() {
      t.style['z-index'] = -1;
    }
  }

  activeToggle(): void {
    console.log('Toggling searcher');
    this.isActive = !this.isActive;
    this.emitState();
  }

  /**
   * Close the launchbar icon if the user clicks anywhere other than on the launchbar area
   */
  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (this.isActive && event && !this.elementRef.nativeElement.contains(event.target)) {
      this.isActive = false;
      this.emitState();
    }
  }

  private emitState(): void {
    this.menuStateChanged.emit(this.isActive);
  }
}


/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/

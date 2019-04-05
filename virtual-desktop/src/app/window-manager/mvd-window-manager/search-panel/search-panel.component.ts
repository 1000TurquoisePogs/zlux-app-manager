

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/

import { Component, ElementRef, HostListener, Output, EventEmitter, Injector } from '@angular/core';
import { WindowManagerService } from '../shared/window-manager.service'
// import { TranslationService } from 'angular-l10n';

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
  }

  ngOnInit(): void {
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

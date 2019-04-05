/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchPanelComponent } from './search-panel.component';
import { SearchComponent } from './search/search.component';
//this should be moved
import { LaunchAppService } from './services/launch-app.service'


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SearchPanelComponent,
    SearchComponent
  ],
  providers: [
    LaunchAppService
  ],
  exports: [
    SearchPanelComponent
  ]
})
export class SearchPanelModule {

}

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/

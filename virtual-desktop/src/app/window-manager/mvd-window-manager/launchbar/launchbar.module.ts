

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from 'app/shared/shared.module';

import { LaunchbarComponent } from './launchbar/launchbar.component';
import { LaunchbarIconComponent } from './launchbar-icon/launchbar-icon.component';
import { LaunchbarMenuComponent } from './launchbar-menu/launchbar-menu.component';
import { LaunchbarWidgetComponent } from './launchbar-widget/launchbar-widget.component';
import { LaunchbarInstanceViewComponent } from './launchbar-instance-view/launchbar-instance-view.component';
import {LaunchbarSpotlightComponent} from './launchbar-spotlight/launchbar-spotlight.component';
import {SearchComponent} from './search/search.component';
import { SearchTableComponent } from './search-table/search-table.component';
// import { SearchService } from '../services/search.service';
// import { LaunchAppService } from '../services/launch-app.service'


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  declarations: [
    LaunchbarComponent,
    LaunchbarIconComponent,
    LaunchbarMenuComponent,
    LaunchbarWidgetComponent,
    LaunchbarInstanceViewComponent,
    LaunchbarSpotlightComponent,
    SearchComponent,
    SearchTableComponent
  ],
  exports: [
    LaunchbarComponent
  ],
  // providers:[
  //   SearchService,
  //   LaunchAppService
  // ]
})
export class LaunchbarModule { }


/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/

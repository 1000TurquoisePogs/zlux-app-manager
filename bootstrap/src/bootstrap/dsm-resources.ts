

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/

import { PluginManager } from 'zlux-base/plugin-manager/plugin-manager'
import { DsmUri } from '../uri/dsm-uri'
import { Dispatcher } from 'zlux-base/dispatcher/dispatcher'
import { Logger } from '../../../../zlux-shared/src/logging/logger'
import { Registry } from 'zlux-base/registry/registry'
import { NotificationManager } from 'zlux-base/notification-manager/notification-manager'
import { EnvironmentManager } from 'zlux-base/environment-manager/environment-manager'
import { SimpleGlobalization } from '../i18n/simple-globalization'

declare var window: { ZoweZLUX: ZoweZLUXResources };
window; /* Suppress TS error */
let logger = new Logger();
logger.addDestination(logger.makeDefaultDestination(true,true,true));

export function getDSMResources(environmentInfo:ZLUX.EnvironmentInfo){
  return {
    pluginManager : PluginManager,
    dispatcher : new Dispatcher(logger),
    environmentManager: new EnvironmentManager(environmentInfo, logger.makeComponentLogger("ZLUX.EnvironmentManager")),
    logger : logger,
    registry : new Registry(),
    notificationManager : new NotificationManager(),
    // currently replaced in plugin-manager.module
    globalization : new SimpleGlobalization(),
    uriBroker : new DsmUri(logger)
  }
}

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/

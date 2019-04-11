/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/

export class AppsHandler implements MVDHosting.SearchHandler {
  pluginDefinition: any;
  logger: any;
  action: any;
  
  constructor(protected context: any) {
    
    this.pluginDefinition = context.pluginDefinition;
    this.logger = context.logger;
    const dispatcher = ZoweZLUX.dispatcher;
    this.action = dispatcher.makeAction('what',
                                        'what',
                                        dispatcher.constants.ActionTargetMode.PluginCreate,
                                        dispatcher.constants.ActionType.Launch,
                                        this.pluginDefinition.identifier,
                                        {data: {op:'deref',source:'event',path:['data']}});
    
  }

  public search(queryString: string):Promise<MVDHosting.SearchResult> {
    return new Promise((resolve)=>{
      let entries:MVDHosting.SearchData[] = [];
      let result:MVDHosting.SearchResult = {type: this.getDefinition().type,
                                            id: this.context.id,
                                            shortName: this.getDefinition().name,
                                            longName: this.getDefinition().description,
                                            entries: entries};
      let plugins = ZoweZLUX.pluginManager.findMatchingPlugins(queryString);
      const constants = ZoweZLUX.dispatcher.constants;
      plugins.forEach((plugin:ZLUX.Plugin)=>{
        let name = plugin.getWebContent().launchDefinition.pluginShortNameDefault;
        entries.push({title:name,
                      summary:"Launch "+name+" App",
                      imageRef: ZoweZLUX.uriBroker.pluginResourceUri(plugin,
                                                                     plugin.getWebContent().launchDefinition.imageSrc),
                      data:
                      {action: ZoweZLUX.dispatcher.makeAction('what',
                                                              'what',
                                                              constants.ActionTargetMode.PluginCreate,
                                                              constants.ActionType.Launch,
                                                              plugin.getIdentifier(),
                                                              null),
                                                              argData: {}}});
      });

      console.log(`resolving with result=`,result);
      resolve(result);
    });
  }

  getDefinition(): MVDHosting.SearchHandlerDefinition { return this.context.definition; }
}


export function appsInit(context: any): MVDHosting.SearchHandler {
  return new AppsHandler(context);
}


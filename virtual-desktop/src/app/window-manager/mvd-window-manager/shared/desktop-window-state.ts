

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

import { EventEmitter } from '@angular/core';

import { WindowPosition } from './window-position';

export enum DesktopWindowStateType {
  Minimized,
  Maximized,
  Normal
}

export class DesktopWindowState {
  private _stateType: DesktopWindowStateType;
  private _previousStateType : DesktopWindowStateType;
  private normalPosition: WindowPosition;
  private _position: WindowPosition;
  zIndex: number;

  stateChanged: EventEmitter<DesktopWindowStateType>;
  positionChanged: EventEmitter<WindowPosition>;

  constructor(zIndex: number, position: WindowPosition) {
    this._stateType = DesktopWindowStateType.Normal;
    this._previousStateType = DesktopWindowStateType.Normal;
    this.normalPosition = position;
    this._position = position;
    this.zIndex = zIndex;
    this.stateChanged = new EventEmitter<DesktopWindowStateType>(true);
    this.positionChanged = new EventEmitter<WindowPosition>(true);
  }

  /* State transformations */

  private setStateType(stateType: DesktopWindowStateType): void {
    if (this._stateType !== stateType) {
      this._previousStateType = this._stateType;
      this._stateType = stateType;
      this.stateChanged.emit(stateType);
    }
  }

  maximize(): void {
    this.normalPosition = this.position;
    this.setStateType(DesktopWindowStateType.Maximized);
  }

  minimize(): void {
    if (this._stateType !== DesktopWindowStateType.Maximized) {
      this.normalPosition = this.position;
    }
    this.setStateType(DesktopWindowStateType.Minimized);
  }

  restore(): void {
    this.position = this.normalPosition;
    this.setStateType(DesktopWindowStateType.Normal);
  }

  /* Accessors and mutators */

  get stateType(): DesktopWindowStateType {
    return this._stateType;
  }

  get PreviousStateType(): DesktopWindowStateType {
    return this._previousStateType;
  }

  get position(): WindowPosition {
    return this._position;
  }

  set position(position: WindowPosition) {
    const { top, left, width, height} = position;
    const { top: pTop, left: pLeft, width: pWidth, height: pHeight} = this._position;
    if (top !== pTop || left !== pLeft || width !== pWidth || height !== pHeight) {
      this._position = position;
      this.positionChanged.emit(position);
    }
  }

  get shouldRender(): boolean {
    return this._stateType !== DesktopWindowStateType.Minimized;
  }
}


/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/


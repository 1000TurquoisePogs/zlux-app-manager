export class RouteManager {
  private _routes: any = {};
  private _route_pointers: any = {};
  constructor() {

  }

  getRoute(viewportId: MVDHosting.ViewportId): string|undefined {
    try {
      return this._routes[viewportId][this._route_pointers[viewportId]];
    } catch (e) {return undefined;}
  }

  setRoute(viewportId: MVDHosting.ViewportId, route: string): void {
    if (!this._routes[viewportId]) {
      this._routes[viewportId] = [];
    } else if (this._route_pointers[viewportId] != this._routes[viewportId].length-1) {
      this._routes[viewportId] = this._routes[viewportId].slice(0,this._route_pointers[viewportId]+1);
    }
    this._routes[viewportId].push(route);
    this._route_pointers[viewportId] = this._routes[viewportId].length-1;
  }

  removeRoutes(viewportId: MVDHosting.ViewportId): void {
    this._routes[viewportId] = undefined;
    this._route_pointers[viewportId] = undefined;
  }

  backRoute(viewportId: MVDHosting.ViewportId): string|undefined {
    if (this._route_pointers[viewportId] > 0) {
      this._route_pointers[viewportId]=this._route_pointers[viewportId]-1;
      return this._routes[viewportId][this._route_pointers[viewportId]];
    } else { return undefined; }
  }

  forwardRoute(viewportId: MVDHosting.ViewportId): string|undefined {
    if (this._route_pointers[viewportId] !== undefined && (this._route_pointers[viewportId] < (this._routes[viewportId].length-1))) {
      this._route_pointers[viewportId]=this._route_pointers[viewportId]+1;
      return this._routes[viewportId][this._route_pointers[viewportId]];
    } else { return undefined; }
  }

  
}

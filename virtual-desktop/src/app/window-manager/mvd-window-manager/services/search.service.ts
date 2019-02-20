import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SearchResult } from '../models/search-result.model';
import { EntityData } from '../models/entity-data.model';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class SearchService {

  private leibnizUrl: string;
  private appUrl: string;
  private webUrl: string[] = [];

  public results: EventEmitter<any> = new EventEmitter<any>();

  public searchTerm: string;

  constructor(private http: Http) {
    this.appUrl = "/plugins?type=all"
    this.webUrl.push("https://www.ibm.com/support/knowledgecenter/v1/search?offset=0&products=&tags=&lang=en&fallback=true&")
  }

  searchObjectAttributes = (obj:any, search:string):boolean =>{
    let status:boolean = false;
      for (const attr in obj){
        if ( typeof(obj[attr]) !== "undefined" && obj[attr] !== null ) {
          if (typeof(obj[attr]) === "object"){
            status = this.searchObjectAttributes(obj[attr], search);
          }
          else if (typeof(obj[attr]) === "string") {
            status = obj[attr].toLowerCase().indexOf(search) !== -1
          }
          else if (typeof(obj[attr]) === "number") {
            status = obj[attr].toString().indexOf(search) !== -1
          }
        }
        if (status)
        {
          break;
        }
      }
      return status;
  };

  processResults (input:any, query:string):any[]{
    if (input && typeof(input) === "object" && input.pluginDefinitions){
      return input.pluginDefinitions
      .filter((instance:any)=>{
        return instance &&
        instance.pluginType &&
        instance.pluginType.toLowerCase() === "application" &&
        this.searchObjectAttributes(instance, query.toLowerCase()) === true
      }).map((instance:any)=>{
        return {
          type: "application",
          appId:instance.identifier,
          summary: instance.webContent.descriptionDefault,
          name: instance.webContent.launchDefinition.pluginShortNameDefault
        }
      })
    }
    return [];
  }





  executeAppQuery(query: string): Observable<SearchResult> {
    // const config = {params: {text: query, username: 'PDJOH2'}};
    // const body = "{}"
    // return this.http.post(this.leibnizUrl + 'query', body, config).map((res) => {
    return this.http.get(this.appUrl).map((res) => {
      // this.searchTerm = res.json().query;
      // if (query === 'apps' || query === 'app') {
      //   const json = new JSON();
      //   this.results.emit(new SearchResult().deserialize(json.getJson()));
      // } else {
      //   this.results.emit(new SearchResult().deserialize(res.json()));
      // }

      return new SearchResult().deserialize(this.processResults(res.json(), query), query);
    }).catch((err) => {
      return this.errorHandler(err);
    });
  }


  addCount():string{
    // TODO need to consider if/how we'd set this dynamically
    // return this.count !== null ? "&" + this.count +"=20": "";
    return "&limit=20";
  }

   addQueryStr(queryString:string):string{
    let output:string = "";
    // for (const indQuery in this.query){
      output += "&" + "query" + "=" + encodeURI(queryString);
    // }
    return output;
  }

  constructUrl(queryString:string):string{
    return this.addQueryStr(queryString) + this.addCount();
  }

  public processWebResults(input:any, query:string):any[]{
    let result:any[] = [];
    let names:string[] = [];
    let summaries:string[] = [];
    let hrefs:string[] = [];
    const nameJson:string[] = "topics.#.label".split(".");// this.title.split('.');
    const summaryJson:string[] = "topics.#.summary".split(".");// this.summary.split('.');
    const hrefJson:string[] = "topics.#.href".split(".");// this.href.split('.');
    if (input[nameJson[0]] &&
      input[nameJson[0]].length > 0 &&
      input[nameJson[0]][0][nameJson[2]] &&
      input[summaryJson[0]] &&
      input[summaryJson[0]].length > 0 &&
      input[summaryJson[0]][0][summaryJson[2]] &&
      input[hrefJson[0]] &&
      input[hrefJson[0]].length > 0 &&
      input[hrefJson[0]][0][hrefJson[2]]
    ){
      for(let i:number= 0; i < input[nameJson[0]].length; i++){
          if (input[nameJson[0]][i][nameJson[2]])
          names.push(input[nameJson[0]][i][nameJson[2]].replace(/<\/?b>/g, ''));
        }
        for(let i:number= 0; i < input[summaryJson[0]].length; i++){
          if (input[summaryJson[0]][i][summaryJson[2]])
          summaries.push(input[summaryJson[0]][i][summaryJson[2]].replace(/<\/?b>/g, ''));
        }
        for(let i:number= 0; i < input[hrefJson[0]].length; i++){
          if (input[hrefJson[0]][i][hrefJson[2]])
          hrefs.push("https://www.ibm.com/support/knowledgecenter/" + input[hrefJson[0]][i][hrefJson[2]]);
        }
        // each result has a title/summary/href, eg equal count
        if (hrefs.length === names.length && hrefs.length === summaries.length){
          for (let i:number=0; i < hrefs.length; i++){
            result.push({name:names[i], summary:summaries[i], href:hrefs[i]});
          }
        }
      }
    return result;
  }

  executeWebQuery(query: string): Observable<SearchResult> {
    // const config = {params: {text: query, username: 'PDJOH2'}};
    // const body = "{}"
    // return this.http.post(this.leibnizUrl + 'query', body, config).map((res) => {
    return this.http.get(this.webUrl[0] + this.constructUrl(query)).map((res) => {
      // this.searchTerm = res.json().query;
      // if (query === 'apps' || query === 'app') {
      //   const json = new JSON();
      //   this.results.emit(new SearchResult().deserialize(json.getJson()));
      // } else {
      //   this.results.emit(new SearchResult().deserialize(res.json()));
      // }

      return new SearchResult().deserialize(this.processWebResults(res.json(), query), query);
    }).catch((err) => {
      return this.errorHandler(err);
    });
  }

  disambiguate(query: EntityData): Observable<SearchResult>  {
    const body = query.serialize();
    const config = {params: {text: this.searchTerm, username: 'PDJOH2'}};
    return this.http.post(this.leibnizUrl + 'disambiguate', body, config).map((res) => {
      this.results.emit(new SearchResult().deserialize(res.json(), ""));
      return new SearchResult().deserialize(res.json(), "");
    }).catch((err) => {
      return this.errorHandler(err);
    });
  }

  errorHandler(err:any): Observable<SearchResult> {
    let errorMessage;
    switch (err.status) {
      case 500:
        errorMessage = {searchDescriptor: '500 Internal Server Error'};
        break;
      case 400:
        errorMessage = {searchDescriptor: '400 Bad Request'};
        break;
      case 401:
        errorMessage = {searchDescriptor: '401 Unauthorized'};
        break;
      case 403:
        errorMessage = {searchDescriptor: '403 Forbidden'};
        break;
      case 404:
        errorMessage = {searchDescriptor: '404 Not Found'};
        break;
      case 409:
        errorMessage = {searchDescriptor: '409 Conflict'};
        break;
      default:
        errorMessage = {searchDescriptor: 'It appears something went wrong'};
    }
    this.results.emit(errorMessage);
    return Observable.throw(
      new Error(`${ err.status } ${ err.statusText }`)
    );
  }

}

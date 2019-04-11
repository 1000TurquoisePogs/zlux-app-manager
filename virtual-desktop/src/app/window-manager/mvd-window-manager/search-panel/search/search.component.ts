// import { AutocompleteService } from '../services/autocomplete.service.ts';
import { LaunchAppService } from '../services/launch-app.service';
import { Component, OnInit, Input, ViewChild, ViewChildren, Renderer2, ElementRef } from '@angular/core';
// import { Angular2InjectionTokens } from 'pluginlib/inject-resources';

@Component({
  selector: 'org-zowe-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  host: {
    '(document:click)': 'onClick($event)',
  }
})
export class SearchComponent implements OnInit {

  @ViewChildren('searchResults') searchResults: any;
  @ViewChild('searchInput') searchInput: any;
  @ViewChild('searchField') searchField: any;
  @Input('dismissParent') dismissParent: any;

  public inputElement: any;

  public searchTerm: string;
  public errorMessage: string;
  public loadingQuery: boolean = false;
  public suggestions: string[];
  public historyList: string[];
  public originalSearchTerm: any = '';
  public displaySuggestions: boolean = false;
  public suggestionList: any;
  public listElements: any;
  public currentTab: any;
  public entityIndex: number = -1;
  public entitySuggestionList: string[] = [];
  public typingDelay: any;

  public searchHandlerResults: MVDHosting.SearchResult[];
  
  public viewMode:string = '';
  public displayPopover:boolean = false;
  public regexActive:boolean = false;
  public handlerCount: number;
  private searchManager = ZoweZLUX.searchManager;
  

  constructor(
    private _eref: ElementRef,
    // private autocompleteService: AutocompleteService,
    private launchAppService: LaunchAppService,
    private renderer: Renderer2
  ) {  }

  public dismiss() {
    this.searchTerm = '';
    this.errorMessage = '';
    this.originalSearchTerm = '';
    this.listElements = null;
    this.currentTab = 0;
    this.entityIndex = -1;
    this.searchHandlerResults = [];
    this.inputElement.value = '';
    this.dismissParent();
  }
  
  public onClick(event:any) {
   if (!this._eref.nativeElement.contains(event.target)) // or some similar check
    this.displayPopover = false;
  }

  public ngOnInit(): void {
    this.inputElement = this.searchInput.nativeElement;
    this.handlerCount = this.searchManager.getHandlers().size;
  }
  public inputPopover():void{
    console.log("inputPopover")
    this.displayPopover=!this.displayPopover;
  }
  public appSearch():void{
    this.inputElement.value = "myapp:";
    this.displayPopover = false;
  }

  public checkRegexActive():void{
    this.regexActive = false;
    const inputVal:string = this.inputElement.value.toLowerCase();
    // TODO: make this regexps driven by config
    const regexps:any = {"myapp":/^myapp:/,"ibmknow":/^ibmknow:/};
    for (const key in regexps){
      if(inputVal.startsWith(key)){
        this.regexActive = true;
        break;
      }
    }
  }

  public searchSelector(regexKey:string): boolean{
    let status:boolean = false;
    const inputVal:string = this.inputElement.value.toLowerCase();
    // TODO: make this regexps driven by config
    const regexps:any = {"myapp":/^myapp:/,"ibmknow":/^ibmknow:/};
    if (this.regexActive){
      for (const key in regexps){
        if(inputVal.startsWith(key)){
          status = true;
          break;
        }
      }
    }
    return status;
  }

  public stripRegex():string{
    // TODO: make this driven by config
    const regexps:string[] = ['myapp:','ibmknow:'];
    for (const val of regexps){
      if (this.inputElement.value.startsWith(val))
        return this.inputElement.value.substring(val.length, this.inputElement.value.length);
    }
    return this.inputElement.value;
  }

  public search(): void {
    this.displayPopover = false;
    this.displaySuggestions = false;
    this.checkRegexActive();
    this.viewMode = "";
    this.loadingQuery = true;
    this.currentTab = undefined;
    const stripQuery:string = "search="+ encodeURI(this.stripRegex());
    let searchTopics:string[] = [];
    let searchHandlers: string[] = [];
    /*
    if (this.inputElement.value.toLowerCase().startsWith("myapp:")){
        searchHandlers.push("app");
        this.viewMode = "tab3";
    }
    else if(this.inputElement.value.toLowerCase().startsWith("ibmknow:")){
      searchHandlers.push("ibm knowledge center");
      this.viewMode = "tab2";
    }
    */
    this.searchManager.search(stripQuery, searchTopics, searchHandlers)
    .then((results:MVDHosting.SearchResult[])=> {
      this.loadingQuery = false;
      this.displaySuggestions = true;
      this.searchHandlerResults = results;
      /*
      for(const result of results){
        console.log("type detected:" + result.type)
        if (result.id === "app"){
          this.tempAppSearchResults = result;
        }
        else if (result.id === "ibmknow"){
          this.tempWebSearchResults = result;
        }
      }
      */
    }, (err:any) => {
        console.log(err);
        this.loadingQuery = false;
    });
    // if (this.searchSelector("myapp")){
    //   this.searchService
    //   .executeAppQuery(stripQuery)
    //   .subscribe((result:SearchResult) => {
    //   // const searchManager = this.zoweWindow.ZoweZLUX.searchManager;
    //   // searchManager.conductSearches(stripQuery)
    //   // .then((result:SearchResult)=> {
    //     this.loadingQuery = false;
    //     this.displaySuggestions = true;
    //     this.tempAppSearchResults = result;
    //   }, (err) => {
    //       console.log(err);
    //       this.loadingQuery = false;
    //     });
    //   }
     //  if (this.searchSelector("ibmknow")){
     //    const searchManager = this.zoweWindow.ZoweZLUX.searchManager;
     //    searchManager.conductSearches(stripQuery)
     //    .then((result:SearchResult)=> {
     //      this.loadingQuery = false;
     //      this.displaySuggestions = true;
     //      this.tempWebSearchResults = result[0];
     //    }, (err) => {
     //        console.log(err);
     //        this.loadingQuery = false;
     //    });
     // }
  }
  // public search(): void {
  //   this.displayPopover = false;
  //   this.displaySuggestions = false;
  //   this.checkRegexActive();
  //   this.tempAppSearchResults = new SearchResult();
  //   this.tempWebSearchResults = new SearchResult();
  //
  //   this.loadingQuery = true;
  //   this.currentTab = undefined;
  //   if (this.searchSelector("myapp")){
  //     const stripQuery:string = this.stripRegex();
  //     this.searchService
  //     .executeAppQuery(stripQuery)
  //     .subscribe((result:SearchResult) => {
  //       this.loadingQuery = false;
  //       this.displaySuggestions = true;
  //       this.tempAppSearchResults = result;
  //     }, (err:any) => {
  //         console.log(err);
  //         this.loadingQuery = false;
  //       });
  //     }
  //     if (this.searchSelector("ibmknow")){
  //       const stripQuery:string = this.stripRegex();
  //     this.searchService
  //     .executeWebQuery(stripQuery)
  //     .subscribe((result:SearchResult) => {
  //       this.loadingQuery = false;
  //       this.displaySuggestions = true;
  //       this.tempWebSearchResults = result;
  //     }, (err:any) => {
  //         console.log(err);
  //         this.loadingQuery = false;
  //     });
  //    }
  // }

  public removeSuggestions(event: any): void {
    // if (event.explicitOriginalTarget.classList &&
    // !event.explicitOriginalTarget.parentElement.classList.contains('history-list') &&
    // !event.explicitOriginalTarget.parentElement.classList.contains('suggestions-list') &&
    // !event.explicitOriginalTarget.classList.contains('suggestions-list') &&
    // !event.explicitOriginalTarget.classList.contains('history-list') &&
    // !event.explicitOriginalTarget.classList.contains('launch-app-left') &&
    // !event.explicitOriginalTarget.classList.contains('launch-app-right')) {
    //   this.displaySuggestions = false;
    //   this.currentTab = undefined;
    // }
  }

  public addSuggestionToInput(event: any): void {
    console.log("addSuggestionToInput")
    this.inputElement.focus();
    this.displaySuggestions = false;
    this.currentTab = undefined;
    this.inputElement.value = event.target.innerText;
    this.select(event.target.innerText);
  }

  public addSuggestionAndSearch(event: any): void {
    this.inputElement.focus();
    this.currentTab = undefined;
    this.inputElement.value = event.target.innerText;
    this.search();
  }

  public addSuggestions(event: any): void {
    console.log("addSuggestions")
      this.displaySuggestions = true;
  }

  public invokeAction(entry: any): void {
    ZoweZLUX.dispatcher.invokeAction(entry.data.action, entry.data.argData);
    this.dismiss();
  }

  public autocomplete(): void {
    console.log("autocomplete")

   //  this.entitySuggestionList = [];
   //  this.originalSearchTerm = this.inputElement.value;
   //  this.entityIndex = -1;
   //  clearTimeout(this.typingDelay);
   //  this.typingDelay = setTimeout(() => {
   //    this.displaySuggestions = true;
   //    if (this.currentTab) {
   //      this.renderer.removeClass(this.currentTab, 'active');
   //    }
   //
   //    if (this.searchTerm) {
   //      this.autocompleteService.getHistory(this.searchTerm).subscribe((result) => {
   //        this.historyList = result.data.slice(0, 7);
   //      });
   //    }
   //
   //    this.autocompleteService.getSuggestions(this.searchTerm).subscribe((result) => {
   //        this.suggestions = result.data;
   //    });
   //
   //    this.autocompleteService.getApps(this.searchTerm).subscribe((result) => {
   //        this.appList = result.data;
   //    });
   //
   //    this.searchResults.changes.subscribe(() => {
   //      if (this.searchResults._results && this.searchResults._results.length !== 0) {
   //        this.suggestionList = this.searchResults._results[0].nativeElement;
   //        this.listElements = this.suggestionList.children;
   //        this.currentTab = this.listElements[0];
   //      }
   //    });
   //    const searchTermWords = this.originalSearchTerm.split(' ');
   //    const lastWord = searchTermWords[searchTermWords.length - 1];
   //    this.autocompleteService.getEntities(lastWord).subscribe((result) => {
   //      this.entitySuggestionList = result.data;
   //    });
   // }, 500);
  }

  public launchApp(targetApp: any): void {
    this.launchAppService.launch(targetApp.appId, targetApp.argumentFormatter, targetApp.parameters);

  }

  public getPreviousEntity(event: any): void {
    event.preventDefault();

    const searchTermWords = this.originalSearchTerm.split(' ');
    const lastWord = searchTermWords[searchTermWords.length - 1];

    if (this.entitySuggestionList && this.entitySuggestionList.length !== 0) {
      if (this.entityIndex <= 0) {
        this.entityIndex = this.entitySuggestionList.length - 1;
      } else {
        this.entityIndex--;
      }
      this.selectEntities(this.entitySuggestionList, lastWord);
    }
  }

  public getNextEntity(event: any): void {
    event.preventDefault();

    const searchTermWords = this.originalSearchTerm.split(' ');
    const lastWord = searchTermWords[searchTermWords.length - 1];

    if (this.entitySuggestionList && this.entitySuggestionList.length !== 0) {
      if (this.entityIndex >= this.entitySuggestionList.length - 1) {
        this.entityIndex = 0;
      } else {
        this.entityIndex++;
      }
      this.selectEntities(this.entitySuggestionList, lastWord);
    }
  }

  public selectEntities(entitySuggestionList:any, lastWord:any): void {
    const currentEntity = entitySuggestionList[this.entityIndex];
    const remainingEntityPart = currentEntity.substring(
      lastWord.length,
      currentEntity.length
    );
    this.inputElement.value = this.originalSearchTerm + remainingEntityPart;

    const start = this.originalSearchTerm.length;
    const end = start + currentEntity.length;
    if (start !== -1 && end !== -1) {
      this.inputElement.focus();
      this.inputElement.setSelectionRange(start, end + 1);
    }
  }

  public tabDown(): void {
    this.displaySuggestions = true;
    if (this.currentTab) {
      if (this.currentTab === this.listElements[0] && !this.currentTab.classList.contains('active')) {
        this.renderer.addClass(this.currentTab, 'active');
        this.inputElement.value = this.currentTab.innerText;
      } else {
        this.renderer.removeClass(this.currentTab, 'active');
        if (!this.currentTab.nextElementSibling) {
          this.currentTab = this.listElements[0];
          this.inputElement.value = this.originalSearchTerm;
        } else {
          this.currentTab = this.currentTab.nextElementSibling;
          this.renderer.addClass(this.currentTab, 'active');
          this.inputElement.value = this.currentTab.innerText;
        }
      }
      this.scrollDown();
      this.select(this.currentTab.innerText);
    }
  }

  public tabUp(): void {
    this.displaySuggestions = true;
    if (this.currentTab) {
      if (this.currentTab === this.listElements[0] && !this.currentTab.classList.contains('active')) {
        this.currentTab = this.listElements[this.listElements.length - 1];
        this.renderer.addClass(this.currentTab, 'active');
        this.inputElement.value = this.currentTab.innerText;
      } else if (!this.currentTab.previousElementSibling) {
        this.renderer.removeClass(this.currentTab, 'active');
        this.currentTab = this.listElements[0];
        this.inputElement.value = this.originalSearchTerm;
      } else {
        this.renderer.removeClass(this.currentTab, 'active');
        this.currentTab = this.currentTab.previousElementSibling;
        this.renderer.addClass(this.currentTab, 'active');
        this.inputElement.value = this.currentTab.innerText;
      }
      this.scrollUp();
      this.select(this.currentTab.innerText);
    }
  }

  public scrollDown(): void {
    if (this.isNotInView()) {
      const offsetBottom = this.currentTab.offsetTop + this.currentTab.offsetHeight;
      this.suggestionList.scrollTop = offsetBottom - this.suggestionList.clientHeight;
    }
  }

  public scrollUp(): void {
    if (this.isNotInView()) {
      this.suggestionList.scrollTop = this.currentTab.offsetTop;
    }
  }

  public isNotInView(): boolean {
    const listTop = this.suggestionList.scrollTop;
    const listBottom = listTop + this.suggestionList.clientHeight;
    const listItemTop = this.currentTab.offsetTop;
    const listItemBottom = listItemTop + this.currentTab.clientHeight;
    return ((listItemBottom > listBottom) || (listItemTop < listTop));
  }

  public select(suggestion: string): void {
    const start = suggestion.indexOf('<');
    const end = suggestion.indexOf('>');
    if (start !== -1 && end !== -1) {
      this.inputElement.focus();
      this.inputElement.setSelectionRange(start, end + 1);
    }
  }
}

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { LaunchAppService } from '../../services/launch-app.service';

@Component({
  selector: 'search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.css']
})
export class SearchTableComponent implements OnInit {

  @Input() table: boolean;

  @Input() tableType: string;
  @ViewChild('tableBody') tableBody: any;

  public appIconSource: string;
  public tableData: any[];

  constructor(
    private launchAppService: LaunchAppService, private searchService: SearchService) {
  }

  public ngOnInit(): void {
    this.searchService.results.subscribe((searchResult:any) => {
      if (searchResult.confidence !== -1) {
        this.tableData = searchResult.entityTypes;
      }
    });
  }

  public launchApp(targetApp: any): void {
    this.launchAppService.launch(targetApp.appId, targetApp.argumentFormatter, targetApp.parameters);
  }

  public toggleTableDisplay(type: any): void {
    type.toggle = !type.toggle;
  }

}

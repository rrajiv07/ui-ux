import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
@Component({
  selector: 'app-workspace-ai-integration',
  templateUrl: './workspace-ai-integration.component.html',
  styleUrls: ['./workspace-ai-integration.component.css']
})
export class WorkspaceAiIntegrationComponent implements OnInit {

  constructor(private _location: Location) { }

  ngOnInit(): void {
  }
  goBack(){
    this._location.back();
  }
}

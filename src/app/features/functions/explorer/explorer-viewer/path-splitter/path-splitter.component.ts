import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-path-splitter[path]',
  templateUrl: './path-splitter.component.html',
  styleUrls: ['./path-splitter.component.scss'],
})
export class PathSplitterComponent implements OnInit, OnChanges {
  @Input() path!: string;
  @Output() pathChange = new EventEmitter<string>();

  pathParts: {
    name: string;
    fullPath: string;
  }[] = [];

  ngOnInit() {
    this.updatePath();
  }

  ngOnChanges() {
    this.updatePath();
  }

  updatePath() {
    this.pathParts = [];
    if (this.path === '') {
      return;
    }
    const paths = this.path.split('/');
    const fullPathList = [];
    for (const path of paths) {
      fullPathList.push(path);
      this.pathParts.push({
        name: path,
        fullPath: fullPathList.join('/'),
      });
    }
  }

  pathClicked(fullPath: string) {
    this.pathChange.emit(fullPath);
  }
}

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-path-splitter[backend][path]',
  templateUrl: './path-splitter.component.html',
  styleUrls: ['./path-splitter.component.scss'],
})
export class PathSplitterComponent implements OnInit, OnChanges {
  @Input() backend!: string;
  @Input() path!: string;
  @Output() backendChange = new EventEmitter<string>();
  @Output() pathChange = new EventEmitter<string>();
  editMode = false;
  editingPath = '';

  @ViewChild('pathInput') pathInput: MatInput | undefined;

  constructor(private snackBar: MatSnackBar) {}

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

  pathCopy(fullPath: string) {
    navigator.clipboard.writeText('/' + fullPath);
    this.snackBar.open($localize`Path copied to clipboard`, undefined, {
      duration: 3000,
    });
  }

  pathEditClicked() {
    const backendIdentifier = this.backend ? this.backend + ':' : '/';
    this.editingPath = backendIdentifier + this.path;
    this.editMode = true;
    this.pathInput?.focus();
  }

  pathEditCancel() {
    this.editMode = false;
  }

  pathEditSave() {
    let newPath = this.editingPath.trim();
    // remove leading slash if present
    if (newPath.startsWith('/')) {
      newPath = newPath.substring(1);
      this.pathChange.emit(newPath);
      this.editMode = false;
      return;
    }
    // find the first slash or colons
    const firstSlashIndex = newPath.indexOf('/');
    const firstColonIndex = newPath.indexOf(':');
    if (firstSlashIndex === -1 && firstColonIndex === -1) {
      // no slash or colon found, treat as a relative path
      this.pathChange.emit(newPath);
      this.editMode = false;
      return;
    }
    // if a colon is found before the first slash, treat as a backend change
    if (
      firstColonIndex !== -1 &&
      (firstSlashIndex === -1 || firstColonIndex < firstSlashIndex)
    ) {
      const backend = newPath.substring(0, firstColonIndex);
      this.backendChange.emit(backend);
      const innerPath = newPath.substring(firstColonIndex + 1);
      this.pathChange.emit(innerPath);
      this.editMode = false;
      return;
    } else {
      // otherwise, treat as a path change
      this.pathChange.emit(newPath);
      this.editMode = false;
      return;
    }
  }
}

import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GetLibraryComponent } from './components/projects/get-library/get-library.component';
import { GetProjectComponent } from './components/projects/get-project/get-project.component';
import { ProjectsComponent } from './components/projects/projects.component';

const PROJECTS_VIEW = 'PROJECTS';
const ORDERS_VIEW = 'ORDERS';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('projectsCmp')
  projectsComponent!: ProjectsComponent;

  VIEWS_LIST = [PROJECTS_VIEW, ORDERS_VIEW];
  selectedView = '';
  viewLibraryTooltip = 'Ver biblioteca';
  addProjectTooltip = 'Crear obra';
  constructor(private dialog: MatDialog) { }

  ngAfterViewInit(): void {
    setTimeout(async () => {
      this.selectedView = PROJECTS_VIEW;
      // this.viewLibraryTooltip = await this.i18.t('button.viewLibrary');
      // this.addProjectTooltip = await this.i18.t('button.addProject');
    });
  }

  onAddClick = () => {
    if (this.selectedView === PROJECTS_VIEW) this.getProject();
    if (this.selectedView === ORDERS_VIEW) this.getOrder();
  };

  getProject = async (project: any = null) => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 'P',
      project
    };

    dialogConfig.height = '800px';
    dialogConfig.width = '1250px';
    dialogConfig.panelClass = 'custom-modal';
    const dialogRef = this.dialog.open(GetProjectComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(async (data) => {
      if (data.refresh) {
        await this.projectsComponent.loadProjects();
      }
    });
  };

  getOrder = () => { };

  viewLibrary = async (project: any = null) => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      project
    };

    dialogConfig.height = '800px';
    dialogConfig.width = '1080px';
    dialogConfig.panelClass = 'custom-modal';
    this.dialog.open(GetLibraryComponent, dialogConfig);
  };
}

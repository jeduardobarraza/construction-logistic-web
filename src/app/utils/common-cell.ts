export default class CommonCells {
  static getIconCellRenderer = (icon: string, color = '#673AB7') =>
    `<mat-icon class="mat-icon material-icons" style="color:${color};cursor:pointer; font-size:24px" role="img" aria-hidden="true">${icon}</mat-icon>`;

  static deleteCellRenderer = () =>
    this.getIconCellRenderer('clear', '#dc3545');

  static editCellRenderer = () => this.getIconCellRenderer('edit', 'goldenrod');

  static archiveCellRenderer = () =>
    this.getIconCellRenderer('system_update_alt', 'darkorange');

  static logisticCellRenderer = () =>
    this.getIconCellRenderer('login', 'green');

  static annulCellRenderer = () =>
    this.getIconCellRenderer('delete_forever', 'black');

  static checkCellRenderer = () =>
    this.getIconCellRenderer('rate_review', 'black');

  static duplicateCellRenderer = () =>
    this.getIconCellRenderer('insert_drive_file', 'black');

  static historyCellRenderer = () =>
    this.getIconCellRenderer('history', 'black');

  static viewCellRenderer = () => this.getIconCellRenderer('search', 'black');
}

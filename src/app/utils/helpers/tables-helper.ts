import { ColDef } from 'ag-grid-community';
import { get } from 'lodash';
import { ITableTranslateOptions } from 'src/app/interfaces/table-translate-options.interface';
import CommonCells from '../common-cell';

export default class TableHelper {
  static getFieldsColumns = async (fields: string[], tableProperties: any) => {
    const columnDefs: ColDef[] = [];
    console.log(fields);
    await fields.map(async (field) => {
      const headerName = field;
      const columnProperties = get(tableProperties, field, null);
      const column = {
        ...columnProperties,
        colId: field,
        headerName,
        field,
        resizable: true
      };
      columnDefs.push(column);
    });
    return columnDefs;
  };

  static getDeleteColumn = (colId = 'btnDelete', width = 56) => ({
    colId,
    width,
    resizable: true,
    cellRenderer: CommonCells.deleteCellRenderer
  });

  static getEditColumn = (colId = 'btnEdit', width = 56) => ({
    colId,
    width,
    resizable: true,
    cellRenderer: CommonCells.editCellRenderer
  });

  static getActionColumn = (colId: string, icon: string, width = 56) => {
    const cellRenderer = () => CommonCells.getIconCellRenderer(icon);
    return {
      colId,
      width,
      resizable: true,
      cellRenderer
    };
  };
}

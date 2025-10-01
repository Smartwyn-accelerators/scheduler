/**
 * Search criteria model for the Scheduler Library
 */
export interface ISearchField {
  field: string;
  value: any;
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between';
}

/**
 * List column configuration model
 */
export interface IListColumn {
  column: string;
  label: string;
  sort: boolean;
  filter: boolean;
  type: ListColumnType;
  searchColumn?: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  hidden?: boolean;
}

/**
 * List column types enum
 */
export enum ListColumnType {
  String = 'String',
  Number = 'Number',
  Date = 'Date',
  Boolean = 'Boolean',
  Custom = 'Custom'
}

/**
 * Association column interface
 */
export interface IAssociationColumn {
  sourceField: string;
  targetField: string;
  displayField: string;
  valueField: string;
}

import { ISaleUnit } from './saleUnit.interface';

export interface IConstruction {
  projectId: string;
  responsibleId: number;
  responsible: string;
  tlClientId: number;
  tlClientName: string;
  tlProjectId: string;
  tlProjectName: string;
  tlProjectAddress: string;
  tlProjectEmails: string;
  tlConfirmationNumber: '';
  userName: string;
  status: string;
  articles: string;
  detail: any[];
}

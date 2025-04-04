import { UserProps } from './User';

export interface TableProps {
    data: UserProps[];
    error?: string | null;
  }
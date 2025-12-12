export interface Alert {
  id: string;
  type: 'error' | 'success';
  message: string;
}

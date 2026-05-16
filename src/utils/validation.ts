import { MAX_NAME_LENGTH } from '../constants';

export function sanitizeName(input: string): string {
  return input.trim().replace(/<[^>]*>/g, '').slice(0, MAX_NAME_LENGTH);
}

export function validateAmount(value: string): boolean {
  if (!value) return false;

  const num = Number(value);

  return !Number.isNaN(num) && num >= 0 && Number.isFinite(num);
}

export function parseAmount(value: string): number {
  return Math.round(Number(value) * 100) / 100;
}

export function validateDate(value: string): boolean {
  if (!value) return false;

  const date = new Date(value);
  
  return !Number.isNaN(date.getTime());
}

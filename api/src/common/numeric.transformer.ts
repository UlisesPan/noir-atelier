import { ValueTransformer } from 'typeorm';

/** Postgres devuelve `numeric` como string para no perder precisión; lo exponemos como number. */
export const numericTransformer: ValueTransformer = {
  to: (value?: number | null) => value,
  from: (value?: string | null) => (value === null || value === undefined ? value : Number(value)),
};

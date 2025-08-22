import { timestamp } from 'drizzle-orm/pg-core';

function enumToPgEnum<T extends Record<string, any>>(
  myEnum: T,
): [T[keyof T], ...T[keyof T][]] {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return Object.values(myEnum).map((value: any) => `${value}`) as any;
}

export interface Translatable {
  oz: string;
  uz?: string | null;
  ru?: string | null;
  en?: string | null;
}

const dateColumns = {
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
};

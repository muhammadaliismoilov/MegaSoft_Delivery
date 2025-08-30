<<<<<<< HEAD
 import {
  pgTable,
  uuid,
  varchar,
  boolean,
  json,
  integer,
  date,
  smallint,
  pgEnum,
  timestamp,
} from 'drizzle-orm/pg-core';
=======
import { sql } from 'drizzle-orm';
import { decimal, pgEnum } from 'drizzle-orm/pg-core';
import { integer } from 'drizzle-orm/pg-core';
import { boolean, smallint, varchar, date, uuid, pgTable, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { DiscountEnum } from '../enums/base.enum';
>>>>>>> f514e25 (test)

// import { timestamp } from 'drizzle-orm/pg-core';
import { ImageTypeEnum, LanguageTypeEnum } from './enums/enums';
import { numeric } from 'drizzle-orm/pg-core';
function enumToPgEnum<T extends Record<string, any>>(
  myEnum: T,
): [T[keyof T], ...T[keyof T][]] {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return Object.values(myEnum).map((value: any) => `${value}`) as any;
}

const dateColumns = {
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
};

<<<<<<< HEAD
export const languageEnum = pgEnum('language_type_enum', LanguageTypeEnum);
export const imageEnum = pgEnum('image_type_enum', ImageTypeEnum);

// Restaurants
export const restaurants = pgTable('restaurants', {
  id: uuid('id').primaryKey(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id),
  title: json('title').notNull(),
  description: json('description').notNull(),
  addres: varchar('addres', { length: 255 }).notNull(),
  lat: numeric('lat').notNull(),
  lang: numeric('lang').notNull(),
  freeDelivery: boolean('free_delivery').notNull(),
  isOpen: boolean('is_open').notNull(),
  ...dateColumns,
});

////    Users
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 255 }).notNull(),
  ...dateColumns,
});
uuid;

// Organizations Products
export const organizationsProducts = pgTable('organizations_products', {
  id: uuid('id').primaryKey(),
  categorieId: uuid('categorie_id').references(() => categories.id),
  title: json('title').notNull(),
  organizationsId: uuid('organizations_id')
    .notNull()
    .references(() => organizations.id),
  imagePath: varchar('image_path', { length: 255 }).notNull(),
  description: json('description').notNull(),
  ...dateColumns,
});
// Workers
export const workers = pgTable('workers', {
  id: uuid('id').primaryKey(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id),
  username: varchar('username', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }).notNull(), // CHECK qo‘lda qo‘shiladi (admin, cashier, etc)
  ...dateColumns,
});

// Banners
export const banners = pgTable('banners', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id),
  name: varchar('name', { length: 255 }).notNull(),
  isActive: boolean('is_active').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  sequence: integer('sequence').notNull(),
  ...dateColumns,
});

// Categories
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: json('title').notNull(),
  sequence: integer('sequence').notNull(),
  image: varchar('image', { length: 255 }).notNull(),
  ...dateColumns,
});

// Organizations
export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: json('title').notNull(),
  imagePath: varchar('image_path', { length: 255 }).notNull(),
  ...dateColumns,
});



// Products
export const products = pgTable('products', {
  id: uuid('id').primaryKey(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id),
  categorieId: uuid('categorie_id')
    .notNull()
    .references(() => categories.id),
  title: json('title').notNull(),
  imagePath: varchar('image_path', { length: 255 }).notNull(),
  isAvalble: boolean('is_avalble').notNull(),
  newUntil: date('new_until').notNull(),
  ...dateColumns,
});

// Product Item Groups
export const productItemGroups = pgTable('product_item_groups', {
  id: uuid('id').primaryKey(),
  name: json('name').notNull(),
  createdAt: date('created_at').notNull(),
  updatedAt: date('update_at').notNull(),
});

// Product Items
export const productItems = pgTable('product_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id),
  productItemGroupId: uuid('product_item_group_id')
    .notNull()
    .references(() => productItemGroups.id),
  name: json('name').notNull(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id),
  ...dateColumns,
});

// Weights
export const weights = pgTable('weights', {
  id: uuid('id').primaryKey(),
  productId: uuid('product_id').references(() => products.id),
  productItemId: uuid('product_item_id').references(() => productItems.id),
  volume: varchar('volume', { length: 255 }).notNull(), // CHECK ('g', 'ml')
  ...dateColumns,
});

// Prices
export const prices = pgTable('prices', {
  id: uuid('id').primaryKey(),
  productId: uuid('product_id').references(() => products.id),
  productItemId: uuid('product_item_id').references(() => productItems.id),
  priceSum: integer('price_sum').notNull(),
  discounSum: integer('discoun_sum').notNull(),
  ...dateColumns,
});

// Banner Images
export const bannerImages = pgTable('banner_imges', {
  id: uuid('id').primaryKey().defaultRandom(),
  bannerId: uuid('banner_id')
    .notNull()
    .references(() => banners.id),
  sequence: integer('sequence').notNull(),
  imagePath: integer('image_path').notNull(),
  ...dateColumns,
});

// Orders
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id),
  totalPrice: integer('total_price').notNull(),
  amount: integer('amount').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  ...dateColumns,
});

// Work Days
export const workDays = pgTable('work_days', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id),
  dayOfWeek: varchar('day_of_week', { length: 255 }).notNull(), // CHECK ('1'..'7')
  openTime: timestamp('open_time', { precision: 0 }).notNull(),
  closeTime: timestamp('close_time', { precision: 0 }).notNull(),
  isClosed: boolean('is_closed').notNull().default(false),
  ...dateColumns,
});


=======
export const banners = pgTable('banners', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  title: varchar('title'),
  isActive: boolean('is_active').notNull().default(true),
  startDate: date('start_date', { mode: 'date' }),
  endDate: date('end_date', { mode: 'date' }),
  sequence: smallint('sequence').notNull(),
  ...dateColumns,
});

export const bannerImages = pgTable('banner_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  banner_id: uuid('banner_id').notNull(),
  lang: varchar('lang', { length: 2 }).notNull(), // 'oz', 'uz', 'ru', 'en'
  path: varchar('path').notNull(),
  ...dateColumns,
}, (table) => ({
  bannerLangUnique: uniqueIndex('banner_images_banner_id_lang_idx').on(table.banner_id, table.lang),
}));


const discountType = pgEnum("discount_type", enumToPgEnum(DiscountEnum))

export const products = pgTable("products", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  image: varchar("image"),
})

export const prices = pgTable(
  "prices",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    price: integer("price").notNull(),
    discountType: discountType("discount_type"),
    discountValue: decimal("discount_value"),
    lastPrice: boolean("last_price").default(false),
    ...dateColumns,
  },
  (table) => ({
    oneLastPricePerProduct: uniqueIndex("unique_last_price_per_product")
      .on(table.productId)
      .where(sql`${table.lastPrice} = true`),
  }),
)

export const weighs = pgTable(
  "weighs",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    weigh: integer("weigh").notNull(),
    ...dateColumns,
  },
  (table) => ({
    uniqueProductWeigh: uniqueIndex("unique_product_weigh").on(table.productId, table.weigh),
  }),
)
>>>>>>> f514e25 (test)

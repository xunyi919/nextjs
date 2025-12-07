import { integer, pgTable, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const postsTable = pgTable("posts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  content: text().notNull(),
  tag: text(),
  category: varchar({ length: 255 }).notNull(),
  authorId: integer()
    .notNull()
    .references(() => usersTable.id),
  published: boolean().default(false),
  isPublic: boolean().default(false),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const categoriesTable = pgTable("categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 100 }).notNull(),
  slug: varchar({ length: 100 }).notNull().unique(),
  description: text(),
});

// export const postCategoriesTable = pgTable("post_categories", {
//   postId: integer()
//     .notNull()
//     .references(() => postsTable.id),
//   categoryId: integer()
//     .notNull()
//     .references(() => categoriesTable.id),
// });

export const tagTable = pgTable("tags", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 100 }).notNull(),
  num: integer().notNull(),
});

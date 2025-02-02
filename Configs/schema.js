import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});


export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  projectId: integer("project_id"),
  categoryId: integer("category_id"),
  status: text("status").notNull().default('pending'),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  priority: text("priority").notNull().default('low'),
});

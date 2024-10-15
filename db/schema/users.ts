import vektorSchema from "@db/schema/schema";
import { relations } from "drizzle-orm";
import { integer, serial, text } from "drizzle-orm/pg-core";

import { fieldsOfStudyTable } from "@db/schema/fieldsOfStudy";
import { recieptsTable } from "@db/schema/reciepts";

export const usersTable = vektorSchema.table("users", {
	id: serial("id").primaryKey(),
	firstName: text("firstName").notNull(),
	lastName: text("lastName").notNull(),
	fieldOfStudyId: integer("fieldOfStudyId")
		.notNull()
		.references(() => fieldsOfStudyTable.id),
});

export const usersRelations = relations(usersTable, ({ one, many }) => ({
	fieldOfStudy: one(fieldsOfStudyTable, {
		fields: [usersTable.fieldOfStudyId],
		references: [fieldsOfStudyTable.id],
	}),
	reciepts: many(recieptsTable),
}));

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

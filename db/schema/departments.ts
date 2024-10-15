import { fieldsOfStudyTable } from "@db/schema/fieldsOfStudy";
import vektorSchema from "@db/schema/schema";
import { relations } from "drizzle-orm";
import { serial } from "drizzle-orm/pg-core";

export const cities = vektorSchema.enum("city", [
	"Trondheim",
	"Ås",
	"Bergen",
	"Tromsø",
]);

export const departmentsTable = vektorSchema.table("departments", {
	id: serial("id").primaryKey(),
	city: cities("city").notNull(),
});

export const departmentsRelations = relations(departmentsTable, ({ many }) => ({
	fieldsOfStudy: many(fieldsOfStudyTable),
}));

export type Department = typeof departmentsTable.$inferSelect;
export type NewDepartment = typeof departmentsTable.$inferInsert;

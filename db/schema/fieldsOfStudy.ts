import { departmentsTable } from "@db/schema/departments";
import vektorSchema from "@db/schema/schema";
import { relations } from "drizzle-orm";
import { integer, serial, text } from "drizzle-orm/pg-core";

export const fieldsOfStudyTable = vektorSchema.table("fieldsOfStudy", {
	id: serial("id").primaryKey(),
	studyCode: text("studyCode").notNull(),
	name: text("name").notNull(),
	departmentId: integer("departmentId")
		.notNull()
		.references(() => departmentsTable.id),
});

export const fieldsOfStudyRelations = relations(
	fieldsOfStudyTable,
	({ one, many }) => ({
		department: one(departmentsTable, {
			fields: [fieldsOfStudyTable.departmentId],
			references: [departmentsTable.id],
		}),
	}),
);

export type FieldOfStudy = typeof fieldsOfStudyTable.$inferSelect;
export type NewFieldOfStudy = typeof fieldsOfStudyTable.$inferInsert;

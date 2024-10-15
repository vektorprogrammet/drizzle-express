import { type NewUser, type User, usersTable } from "@db/schema/users";
import { database } from "@db/setup/queryPostgres";
import { type DatabaseResult, catchDatabase } from "@src/error/dbErrors";
import { eq } from "drizzle-orm";

export const getUsersFromId = async (
	id: number,
): Promise<DatabaseResult<User[]>> => {
	return catchDatabase(async () => {
		return await database
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, id));
	});
};
export const insertUsers = async (
	users: NewUser[],
): Promise<DatabaseResult<User[]>> => {
	return catchDatabase(async () => {
		return await database.insert(usersTable).values(users).returning();
	});
};

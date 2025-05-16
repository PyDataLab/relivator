import "server-only";
import { desc, eq } from "drizzle-orm";

import type { UserWithUploads } from "~/app/admin/summary/page.types";

import { db } from "~/db";
import { userTable, uploadsTable } from "~/db/schema";

export async function getUsersWithUploads(): Promise<UserWithUploads[]> {
  try {
    // Получаем пользователей с их загрузками через join
    const rows = await db
      .select({
        user: userTable,
        upload: uploadsTable,
      })
      .from(userTable)
      .leftJoin(uploadsTable, eq(userTable.id, uploadsTable.userId))
      .orderBy(desc(userTable.createdAt));

    // Группируем загрузки по пользователям
    const usersMap = new Map<string, UserWithUploads>();

    for (const row of rows) {
      const userId = row.user.id;
      if (!usersMap.has(userId)) {
        usersMap.set(userId, {
          ...row.user,
          uploads: [],
        });
      }
      if (row.upload) {
        usersMap.get(userId)!.uploads.push(row.upload);
      }
    }

    return Array.from(usersMap.values());
  } catch (error) {
    console.error("Failed to fetch users with uploads:", error);
    return [];
  }
}

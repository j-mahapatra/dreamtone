"use server";

import { db } from "@/lib/db";
import { checkAuth } from "./auth";
import { revalidatePath } from "next/cache";

export async function publishSong(songId: string, published: boolean) {
  await checkAuth();
  await db.song.update({
    where: {
      id: songId,
    },
    data: {
      published,
    },
  });

  revalidatePath("/create");
}

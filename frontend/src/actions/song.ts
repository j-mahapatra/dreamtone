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

export async function renameSong(songId: string, title: string) {
  const session = await checkAuth();
  await db.song.update({
    where: {
      id: songId,
      userId: session.user.id,
    },
    data: {
      title,
    },
  });

  revalidatePath("/create");
}

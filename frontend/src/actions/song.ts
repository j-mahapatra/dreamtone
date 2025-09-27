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

export async function updateSongLike(songId: string) {
  const session = await checkAuth();

  const existingLike = await db.like.findUnique({
    where: {
      userId_songId: {
        songId: songId,
        userId: session.user.id,
      },
    },
  });

  if (!existingLike) {
    await db.like.create({
      data: {
        userId: session.user.id,
        songId: songId,
      },
    });
  } else {
    await db.like.delete({
      where: {
        userId_songId: {
          songId: songId,
          userId: session.user.id,
        },
      },
    });
  }

  revalidatePath("/home");
}

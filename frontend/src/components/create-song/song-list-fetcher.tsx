import { getPresignedUrl } from "@/actions/aws";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import { SongList } from "./song-list";

export async function SongListFetcher() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const songs = await db.song.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      User: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const songsWithDetails = await Promise.all(
    songs.map(async (song) => {
      let thumbnail: string | null = null;

      const thumbnailS3Key = song.thumbnailS3Key;

      if (thumbnailS3Key) {
        thumbnail = await getPresignedUrl(thumbnailS3Key);
      }

      return {
        id: song.id,
        title: song.title,
        createdAt: song.createdAt,
        prompt: song.prompt,
        lyrics: song.lyrics,
        fullSongDescription: song.fullSongDescription,
        lyricsDescription: song.lyricsDescription,
        isInstrumental: song.isInstrumental,
        thumbnailUrl: thumbnail,
        playUrl: null,
        status: song.status,
        createdBy: song.User.name,
        published: song.published,
      };
    }),
  );

  return <SongList songs={songsWithDetails} />;
}

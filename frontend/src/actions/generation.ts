"use server";

import { inngest } from "@/inngest/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type GenerateRequest = {
  prompt?: string;
  lyrics?: string;
  fullSongDescription?: string;
  lyricsDescription?: string;
  instrumental?: boolean;
};

async function checkAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  return session;
}

export async function createSong(generateRequest: GenerateRequest) {
  const session = await checkAuth();

  await queueSong(generateRequest, 7.5, session.user.id);
  await queueSong(generateRequest, 15, session.user.id);

  revalidatePath("/create");
}

export async function queueSong(
  generateRequest: GenerateRequest,
  guidanceScale: number,
  userId: string,
) {
  let title = "Untitled";

  if (generateRequest.lyricsDescription) {
    title = generateRequest.lyricsDescription;
  }

  if (generateRequest.fullSongDescription) {
    title = generateRequest.fullSongDescription;
  }

  title = title.charAt(0).toUpperCase() + title.slice(1);

  const song = await db.song.create({
    data: {
      userId: userId,
      title: title,
      prompt: generateRequest.prompt,
      lyrics: generateRequest.lyrics,
      fullSongDescription: generateRequest.fullSongDescription,
      lyricsDescription: generateRequest.lyricsDescription,
      isInstrumental: generateRequest.instrumental,
      guidanceScale: guidanceScale,
      audioDuration: 180,
    },
  });

  await inngest.send({
    name: "generate-song-event",
    data: {
      songId: song.id,
      userId: song.userId,
    },
  });
}

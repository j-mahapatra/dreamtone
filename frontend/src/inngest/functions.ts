import { db } from "@/lib/db";
import { inngest } from "./client";
import { env } from "@/env";
import { removeNullAndUndefinedKeys } from "@/lib/helpers";

type EventDataType = { songId: string; userId: string };

type RequestBody = {
  guidance_scale: number | null;
  infer_step: number | null;
  audio_duration: number | null;
  seed: number | null;
  prompt?: string | null;
  lyrics?: string | null;
  full_song_description?: string | null;
  lyrics_description?: string | null;
  instrumental: boolean | null;
};

type ResponseDataType = {
  s3_filekey: string;
  cover_image_s3_filekey: string;
  categories: string[];
};

export const generateSong = inngest.createFunction(
  {
    id: "generate-song",
    concurrency: {
      limit: 1,
      key: "event.data.userId",
    },
    onFailure: async ({ event }) => {
      await db.song.update({
        where: {
          id: event?.data?.event?.data?.songId,
        },
        data: {
          status: "failed",
        },
      });
    },
  },
  { event: "generate-song-event" },
  async ({ event, step }) => {
    const { songId } = event.data as EventDataType;

    const { userId, credits, body, endpoint } = await step.run(
      "check-credits",
      async () => {
        const song = await db.song.findUniqueOrThrow({
          where: {
            id: songId,
          },
          select: {
            User: {
              select: {
                id: true,
                credits: true,
              },
            },
            prompt: true,
            lyrics: true,
            fullSongDescription: true,
            lyricsDescription: true,
            isInstrumental: true,
            guidanceScale: true,
            inferStep: true,
            audioDuration: true,
            seed: true,
          },
        });

        let body: RequestBody | null = null;
        let endpoint = "";

        const commonParams = {
          guidance_scale: song?.guidanceScale,
          infer_step: song?.inferStep,
          audio_duration: song?.audioDuration,
          seed: song?.seed,
          instrumental: song?.isInstrumental,
        };

        if (song.fullSongDescription) {
          endpoint = env.GENERATE_FROM_DESCRIPTION_MODAL_ENDPOINT;

          body = {
            full_song_description: song.fullSongDescription,
            ...commonParams,
          };
        } else if (song.lyrics && song.prompt) {
          endpoint = env.GENERATE_FROM_LYRICS_MODAL_ENDPOINT;
          body = {
            lyrics: song.lyrics,
            prompt: song.prompt,
            ...commonParams,
          };
        } else if (song.lyricsDescription && song.prompt) {
          endpoint = env.GENERATE_FROM_LYRICS_DESCRIPTION_MODAL_ENDPOINT;
          body = {
            lyrics_description: song.lyricsDescription,
            prompt: song.prompt,
            ...commonParams,
          };
        }

        return {
          userId: song.User.id,
          credits: song.User.credits,
          body: removeNullAndUndefinedKeys(body as Record<string, unknown>),
          endpoint,
        };
      },
    );

    if (credits > 0) {
      await step.run("set-song-status-to-processing", async () => {
        return await db.song.update({
          where: {
            id: songId,
          },
          data: {
            status: "processing",
          },
        });
      });

      const response = await step.fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Modal-Key": env.MODAL_KEY,
          "Modal-Secret": env.MODAL_SECRET,
        },
      });

      await step.run("update-song-result-in-db", async () => {
        const data = (
          response.ok ? await response.json() : null
        ) as ResponseDataType | null;

        const dataToUpdate = response.ok
          ? {
              status: "processed",
              s3Key: data?.s3_filekey,
              thumbnailS3Key: data?.cover_image_s3_filekey,
            }
          : { status: "failed" };
        await db.song.update({
          where: {
            id: songId,
          },
          data: dataToUpdate,
        });
        if (data?.categories?.length && data?.categories?.length > 0) {
          await db.song.update({
            where: {
              id: songId,
            },
            data: {
              categories: {
                connectOrCreate: data.categories.map((category) => ({
                  where: {
                    name: category,
                  },
                  create: {
                    name: category,
                  },
                })),
              },
            },
          });
        }
      });

      return await step.run("deduct-credits", async () => {
        return await db.user.update({
          where: {
            id: userId,
          },
          data: {
            credits: {
              decrement: 1,
            },
          },
        });
      });
    } else {
      await step.run("set-song-status-to-no-credits", async () => {
        return await db.song.update({
          where: {
            id: songId,
          },
          data: {
            status: "no-credits",
          },
        });
      });
    }
  },
);

import { getPresignedUrl } from "@/actions/aws";
import SongCard from "@/components/home/song-card";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Globe2, Music } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function CreatePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const userId = session.user.id;

  const songs = await db.song.findMany({
    where: {
      published: true,
    },
    include: {
      User: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
      categories: true,
      likes: userId
        ? {
            where: {
              userId: userId,
            },
          }
        : false,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  const songsWithUrls = await Promise.all(
    songs.map(async (song) => {
      const thumbnailUrl = song.thumbnailS3Key
        ? await getPresignedUrl(song.thumbnailS3Key)
        : null;

      return {
        ...song,
        thumbnailUrl,
      };
    }),
  );

  const lastOneYear = new Date();
  lastOneYear.setDate(lastOneYear.getDate() - 360);

  const trendingSongs = songsWithUrls
    .filter((song) => {
      return song.createdAt >= lastOneYear;
    })
    .slice(0, 10);

  const trendingSongIds = new Set(trendingSongs.map((song) => song.id));

  const categorizedSongs = songsWithUrls
    .filter(
      (song) => !trendingSongIds.has(song.id) && song.categories.length > 0,
    )
    .reduce(
      (acc, song) => {
        const primaryCategory = song.categories[0];

        if (primaryCategory) {
          const primaryCategoryName = primaryCategory.name;
          acc[primaryCategoryName] ??= [];

          if (acc[primaryCategoryName].length < 10) {
            acc[primaryCategoryName].push(song);
          }
        }

        return acc;
      },
      {} as Record<string, typeof songsWithUrls>,
    );

  if (
    trendingSongs.length === 0 &&
    Object.keys(categorizedSongs).length === 0
  ) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 text-center">
        <Music className="text-muted-foreground size-20" />
        <h1 className="mt-4 text-2xl font-bold tracking-tight">
          No Songs Found
        </h1>
        <p className="text-muted-foreground mt-2">
          No songs have been published yet. You can publish a song by going to
          the &quot;Create Song&quot; page.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center space-x-2">
        <Globe2 />
        <h2 className="text-2xl font-bold tracking-tight">Discover Music</h2>
      </div>
      {trendingSongs.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-2 text-xl font-semibold">Trending</h3>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {trendingSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      )}
      {Object.entries(categorizedSongs)
        .slice(0, 5)
        .map(([category, songs]) => (
          <div key={category} className="mt-5">
            <h2 className="mb-2 text-xl font-semibold">{category}</h2>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {songs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}

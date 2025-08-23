-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 100;

-- CreateTable
CREATE TABLE "public"."song" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "s3Key" TEXT,
    "thumbnailS3Key" TEXT,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "isInstrumental" BOOLEAN NOT NULL DEFAULT false,
    "prompt" TEXT,
    "lyrics" TEXT,
    "fullSongDescription" TEXT,
    "lyricsDescription" TEXT,
    "guidanceScale" DOUBLE PRECISION,
    "inferStep" INTEGER,
    "audioDuration" DOUBLE PRECISION,
    "seed" DOUBLE PRECISION,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "listenCount" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."like" (
    "userId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "like_pkey" PRIMARY KEY ("userId","songId")
);

-- CreateTable
CREATE TABLE "public"."category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_CategoryToSong" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToSong_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "song_s3Key_idx" ON "public"."song"("s3Key");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "public"."category"("name");

-- CreateIndex
CREATE INDEX "_CategoryToSong_B_index" ON "public"."_CategoryToSong"("B");

-- AddForeignKey
ALTER TABLE "public"."song" ADD CONSTRAINT "song_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."like" ADD CONSTRAINT "like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."like" ADD CONSTRAINT "like_songId_fkey" FOREIGN KEY ("songId") REFERENCES "public"."song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CategoryToSong" ADD CONSTRAINT "_CategoryToSong_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CategoryToSong" ADD CONSTRAINT "_CategoryToSong_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

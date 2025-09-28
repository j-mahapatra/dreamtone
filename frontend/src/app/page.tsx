import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Music2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import heroImage from "/public/images/hero-image.jpg";

const navbarLinks = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Testimonials", href: "#testimonials" },
];
export default function DreamtoneLandingPage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen w-full flex-col items-center">
      <header className="flex h-14 w-full items-center px-4 lg:px-6">
        <Link className="flex items-center justify-center" href="#">
          <Music className="text-primary h-6 w-6" />
          <span className="ml-2 text-lg font-bold">Dreamtone</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {navbarLinks.map((link) => (
            <Link
              key={link.name}
              className="text-sm font-medium underline-offset-4 hover:underline"
              href={link.href}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <Link href="/auth/sign-in" className="ml-4 sm:ml-6">
          <Button size="sm" className="cursor-pointer">
            Sign In
          </Button>
        </Link>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-16 lg:py-20 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-center text-3xl font-bold tracking-tighter sm:text-5xl md:text-left xl:text-6xl/none">
                    Create Your Next Masterpiece with AI
                  </h1>
                  <p className="text-muted-foreground max-w-[600px] text-center md:text-left md:text-xl">
                    Dreamtone is an AI music generator that turns your ideas
                    into professional-quality songs. No musical experience
                    required.
                  </p>
                </div>
                <div className="flex flex-col justify-center gap-2 min-[400px]:flex-row md:justify-start">
                  <Link
                    className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none"
                    href="/home"
                  >
                    <Music2 className="mr-2 size-4" />
                    Create Your Music Now
                  </Link>
                </div>
              </div>
              <Image
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                src={heroImage}
                width={550}
                height={550}
              />
            </div>
          </div>
        </section>

        <section
          id="features"
          className="bg-muted w-full py-12 md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Elevate Your Music Creation
                </h2>
                <p className="text-muted-foreground max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides a comprehensive suite of features to
                  help you create music without limits.
                </p>
                <div className="bg-muted-foreground/10 mt-5 inline-block rounded-lg px-3 py-1 text-sm">
                  Key Features
                </div>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-6 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">High-Quality Compositions</h3>
                <p className="text-muted-foreground text-sm">
                  Generate songs up to 3 minutes long with crystal-clear sound
                  quality.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Customizable Lyrics</h3>
                <p className="text-muted-foreground text-sm">
                  Create music just by providing description of the song or
                  provide the lyrics yourself and let AI do the magic.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">AI Generated Thumbnails</h3>
                <p className="text-muted-foreground text-sm">
                  Captivating thumbnails are auto-generated for you based on
                  your music.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Create Your Song in Three Simple Steps
                </h2>
                <p className="text-muted-foreground max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our intuitive process makes music creation accessible to
                  everyone.
                </p>
                <div className="bg-muted-foreground/10 mt-5 inline-block rounded-lg px-3 py-1 text-sm">
                  How It Works
                </div>
              </div>
            </div>
            <div className="mx-auto grid gap-6 py-6 sm:grid-cols-1 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>1. Input Lyrics or Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Choose between providing lyrics or a theme-based description
                    to guide the AI.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>2. Customize Your Song</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Personalize your music by selecting the genre, mood, and
                    instruments.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>3. Generate and Share</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Create your unique song in under a minute and share it with
                    the world.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section
          id="testimonials"
          className="bg-muted w-full py-12 md:py-24 lg:py-32"
        >
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                What Creators Are Saying
              </h2>
              <p className="text-muted-foreground mx-auto max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Thousands of creators trust our AI music generator for their
                projects.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <Card>
                <CardContent className="h-36 p-6">
                  <div className="flex items-start">
                    <Avatar>
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <p className="text-sm font-bold">Sarah Chen</p>
                      <p className="text-muted-foreground text-xs">
                        Content Creator
                      </p>
                    </div>
                  </div>
                  <blockquote className="text-foreground mt-4 text-sm">
                    {`This AI music generator has transformed my workflow. I can
                    create professional AI-generated music for my videos in
                    minutes!`}
                  </blockquote>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="h-36 p-6">
                  <div className="flex items-start">
                    <Avatar>
                      <AvatarFallback>DM</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <p className="text-sm font-bold">David Miller</p>
                      <p className="text-muted-foreground text-xs">
                        Game Developer
                      </p>
                    </div>
                  </div>
                  <blockquote className="text-foreground mt-4 text-sm">
                    {`The quality of this AI music generator is incredible.
                    Perfect for my indie game development projects. Saves me so
                    much time and money!`}
                  </blockquote>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Create?
              </h2>
              <p className="text-muted-foreground mx-auto max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Sign up and start generating your own music today.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Link href="/auth/sign-up">
                <Button className="cursor-pointer">Sign Up</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex w-full shrink-0 flex-col items-center justify-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-muted-foreground text-xs">
          {`© ${new Date().getFullYear()} Dreamtone. All rights reserved.`}
        </p>
      </footer>
    </div>
  );
}

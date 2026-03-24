import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/home/HeroSection";
import { Announcements } from "@/components/home/Announcements";
import { EventsPreview } from "@/components/home/EventsPreview";
import { LatestSermon } from "@/components/home/LatestSermon";
import { getCachedEvents, getLatestSermon, getFeaturedRecaps } from "@/lib/cache";
import { getSiteMedia } from "@/app/actions/content";
import { RecapsPreview } from "@/components/home/RecapsPreview";

export default async function Home() {
  const events = await getCachedEvents();
  const latestSermon = await getLatestSermon();
  const featuredRecaps = await getFeaturedRecaps();
  const slides = await prisma.homeSlide.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" }
  });

  const media = await getSiteMedia([
    "home_events_preview_bg",
    "home_latest_sermon_bg"
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection initialSlides={slides} />
      <Announcements />
      {latestSermon && (
        <LatestSermon 
          sermon={latestSermon as any} 
          bgImage={media["home_latest_sermon_bg"]}
        />
      )}
      <EventsPreview 
        events={events} 
        bgImage={media["home_events_preview_bg"]}
      />
      <RecapsPreview recaps={featuredRecaps} />
    </div>
  );
}

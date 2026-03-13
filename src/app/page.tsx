import { HeroSection } from "@/components/home/HeroSection";
import { Announcements } from "@/components/home/Announcements";
import { EventsPreview } from "@/components/home/EventsPreview";
import { LatestSermon } from "@/components/home/LatestSermon";
import { getCachedEvents, getLatestSermon } from "@/lib/cache";

export default async function Home() {
  const events = await getCachedEvents();
  const latestSermon = await getLatestSermon();

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <Announcements />
      {latestSermon && <LatestSermon sermon={latestSermon as any} />}
      <EventsPreview events={events} />
    </div>
  );
}

import { HeroSection } from "@/components/home/HeroSection";
import { Announcements } from "@/components/home/Announcements";
import { EventsPreview } from "@/components/home/EventsPreview";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <Announcements />
      <EventsPreview />
    </div>
  );
}

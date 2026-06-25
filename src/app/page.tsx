import { Header } from "@/components/header";
import SmoothScrollHero from "@/components/ui/smooth-scroll-hero";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Divider } from "@/components/divider";
import { Gallery } from "@/components/gallery";
import { Reviews } from "@/components/reviews";
import { Story } from "@/components/story";
import { Booking } from "@/components/booking";
import { Hours } from "@/components/hours";
import { Footer } from "@/components/footer";

export default function Page() {
  return (
    <>
      <Header />
      <main id="main">
        <SmoothScrollHero
          scrollHeight={1500}
          desktopImage="/images/barber-provincie-hero-desktop.png"
          mobileImage="/images/barber-provincie-hero-mobile.png"
          initialClipPercentage={25}
          finalClipPercentage={75}
        />
        <Hero />
        <Services />
        <Divider />
        <Gallery />
        <Divider />
        <Reviews />
        <Divider />
        <Story />
        <Divider />
        <Booking />
        <Divider />
        <Hours />
      </main>
      <Footer />
    </>
  );
}

import { Header } from "@/components/header";
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

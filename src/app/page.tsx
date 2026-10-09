import { FeaturedCollection } from "@/components/home/FeaturedCollection/FeaturedCollection";
import { Hero } from "@/components/home/Hero/Hero";
import { VyroLabSection } from "@/components/home/VyroLab/VyroLabSection";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.page}>
      <Hero />
      <FeaturedCollection />
      <VyroLabSection />
    </div>
  );
}

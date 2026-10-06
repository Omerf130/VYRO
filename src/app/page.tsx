import { Hero } from "@/components/home/Hero/Hero";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.page}>
      <Hero />
    </div>
  );
}

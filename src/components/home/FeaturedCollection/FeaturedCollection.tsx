import { Container } from "@/components/ui/Container/Container";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import {
  featuredCollectionDescription,
  featuredProducts,
} from "@/data/featured-collection";
import { FeaturedProductItem } from "./FeaturedProductItem";
import styles from "./FeaturedCollection.module.scss";

export function FeaturedCollection() {
  return (
    <section
      className={styles.section}
      aria-labelledby="featured-collection-heading"
    >
      <Container variant="wide" className={styles.inner}>
        <SectionHeading
          className={styles.heading}
          overline={
            <span className={styles.eyebrowLabel}>FEATURED COLLECTION</span>
          }
          title={
            <span id="featured-collection-heading">
              BUILT TO
              <br />
              MOVE DIFFERENT.
            </span>
          }
          description={featuredCollectionDescription}
        />

        <ul className={styles.grid}>
          {featuredProducts.map((product) => (
            <li key={product.id} className={styles.gridItem}>
              <FeaturedProductItem product={product} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

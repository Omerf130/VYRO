import Image from "next/image";
import type { FeaturedProduct } from "@/data/featured-collection";
import styles from "./FeaturedCollection.module.scss";

type FeaturedProductItemProps = {
  product: FeaturedProduct;
};

export function FeaturedProductItem({ product }: FeaturedProductItemProps) {
  const descriptionLines = product.description.split("\n");

  return (
    <article
      className={styles.product}
      data-accent={product.id}
      aria-labelledby={`featured-${product.id}-title`}
    >
      <div className={styles.visual}>
        <div className={styles.composition}>
          <Image
            src={product.backImageSrc}
            alt=""
            width={product.backImageWidth}
            height={product.backImageHeight}
            className={styles.effectBack}
            aria-hidden
            sizes="(max-width: 767px) 95vw, (max-width: 1023px) 48vw, 32vw"
          />
          <div className={styles.shoeWrap}>
            <Image
              src={product.imageSrc}
              alt={product.imageAlt}
              width={product.imageWidth}
              height={product.imageHeight}
              className={styles.shoe}
              sizes="(max-width: 767px) 92vw, (max-width: 1023px) 45vw, 28vw"
            />
          </div>
        </div>
      </div>

      <div className={styles.meta}>
        <p className={styles.index}>{product.index}</p>
        <h3 className={styles.name} id={`featured-${product.id}-title`}>
          {product.name}
        </h3>
        <p className={styles.blurb}>
          {descriptionLines.map((line, lineIndex) => (
            <span key={line}>
              {lineIndex > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </p>
        <span className={styles.explore} aria-disabled="true">
          EXPLORE →
        </span>
      </div>
    </article>
  );
}

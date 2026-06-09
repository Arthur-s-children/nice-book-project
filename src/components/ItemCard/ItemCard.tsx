import styles from './ItemCard.module.scss';

export const ItemCard = () => {
  return (
    <div className={styles.item_card}>
      <h1 className={styles.title}>
        Chip War. The Fight for the World's Most Critical Technology
      </h1>
      <p className={styles.paragraph}>Chris Miller</p>

      <div className={styles.book_grid}>
        <div className={styles.image_container}>
          <picture>
            {/* desktop */}
            <source
              media="(min-width: 1200px)"
              srcSet="./images/Book_cover_image_tablet.png"
            />
            {/* tablet */}
            <source
              media="(min-width: 640px)"
              srcSet="./images/Book_cover_image_tablet.png"
            />
            {/* mobile */}
            <img
              src="./images/Book_cover_image_mobile.png"
              alt="BookImage"
              className={styles.image}
            />
          </picture>
        </div>

        <section className={styles.category_block}>
          <div className={styles.category}>
            <h5 className={styles.block_label_gray}>Category</h5>

            <button className={styles.btn_category}>Tech/Business</button>
          </div>

          <div className={styles.languages}>
            <h5 className={styles.block_label_gray}>Select language</h5>

            <div className={styles.btnLang}>
              <button className={styles.btn_lang_ua}>UA</button>

              <button className={styles.btn_lang_eng}>ENG</button>
            </div>
          </div>

          <div className={styles.price_container}>
            <div className={styles.price}>
              <span className={styles.new_price}>₴258</span>

              <span className={styles.old_price}>₴540</span>
            </div>

            <div className={styles.actions}>
              <button className={styles.btn_add}>Add to cart</button>

              <button
                className={styles.btn_favorite}
                aria-label="Favorite"
              >
                <img
                  src="/icons/heart.svg"
                  alt=""
                  className={styles.icon_heart}
                />
              </button>
            </div>
          </div>

          <table className={styles.characteristics}>
            <tbody>
              <tr>
                <td>Author</td>
                <td>Chris Miller</td>
              </tr>
              <tr>
                <td>Cover type</td>
                <td>Hardcover</td>
              </tr>
              <tr>
                <td>Number of pages</td>
                <td>432</td>
              </tr>
              <tr>
                <td>Year of publication</td>
                <td>2024</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className={styles.about}>
          <h3 className={styles.section_title}>About</h3>

          <h5 className={styles.block_label_black}>
            An epic account of the decades-long battle to control the world's
            most critical resource—microchip technology
          </h5>
          <p className={styles.paragraph}>
            Power in the modern world - military, economic, geopolitical - is
            built on a foundation of computer chips. America has maintained its
            lead as a superpower because it has dominated advances in computer
            chips and all the technology that chips have enabled. (Virtually
            everything runs on chips: cars, phones, the stock market, even the
            electric grid.) Now that edge is in danger of slipping, undermined
            by the naïve assumption that globalising the chip industry and
            letting players in Taiwan, Korea and Europe take over manufacturing
            serves America's interests. Currently, as Chip War reveals, China,
            which spends more on chips than any other product, is pouring
            billions into a chip-building Manhattan Project to catch up to the
            US.
          </p>

          <p className={styles.paragraph}>
            In Chip War economic historian Chris Miller recounts the fascinating
            sequence of events that led to the United States perfecting chip
            design, and how faster chips helped defeat the Soviet Union (by
            rendering the Russians’ arsenal of precision-guided weapons
            obsolete). The battle to control this industry will shape our
            future. China spends more money importing chips than buying oil, and
            they are China's greatest external vulnerability as they are
            fundamentally reliant on foreign chips. But with 37 per cent of the
            global supply of chips being made in Taiwan, within easy range of
            Chinese missiles, the West's fear is that a solution may be close at
            hand.
          </p>
        </section>

        <section className={styles.characteristics_section}>
          <h3 className={styles.section_title}>Characteristics</h3>

          <table className={styles.characteristics}>
            <tbody>
              <tr>
                <td>Author</td>
                <td>Chris Miller</td>
              </tr>
              <tr>
                <td>Cover type</td>
                <td>Hardcover</td>
              </tr>
              <tr>
                <td>Number of pages</td>
                <td>432</td>
              </tr>
              <tr>
                <td>Year of publication</td>
                <td>2024</td>
              </tr>
              <tr>
                <td>Publication</td>
                <td>Nash Format</td>
              </tr>
              <tr>
                <td>Format</td>
                <td>140x210mm</td>
              </tr>
              <tr>
                <td>Language</td>
                <td>UA</td>
              </tr>
              <tr>
                <td>Illustrations</td>
                <td>No illustrations</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

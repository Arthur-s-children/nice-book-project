import styles from './RightsPage.module.scss';

export const RightsPage = () => {
  return (
    <section className={styles.rights}>
      <div className={`${styles['rights__container']}`}>
        <aside className={styles['rights__aside']}>
          <h1 className={styles['rights__title']}>Terms & Conditions</h1>
        </aside>

        <div className={styles['rights__content']}>
          <section className={styles['rights__section']}>
            <h2>Welcome to NiceBoooks</h2>
            <p>
              Welcome to NiceBoooks, your online destination for discovering and
              exploring books in various formats, including printed books,
              eBooks, and audiobooks. By accessing or using our website, you
              agree to comply with these Terms & Conditions.
            </p>
          </section>

          <section className={styles['rights__section']}>
            <h2>User Accounts</h2>
            <p>
              Users may create an account to access additional features, such as
              saving favorite books, managing their shopping cart, and tracking
              orders. You are responsible for maintaining the confidentiality of
              your account information and password.
            </p>
          </section>

          <section className={styles['rights__section']}>
            <h2>Products and Availability</h2>
            <p>
              NiceBoooks offers a selection of books across multiple categories
              and formats. While we strive to keep all information accurate and
              up to date, product availability, pricing, and descriptions may
              change without prior notice.
            </p>
          </section>

          <section className={styles['rights__section']}>
            <h2>Orders and Payments</h2>
            <p>
              By placing an order through NiceBoooks, you agree to provide
              accurate and complete information. All purchases are subject to
              availability and confirmation. We reserve the right to refuse or
              cancel orders if necessary.
            </p>
          </section>

          <section className={styles['rights__section']}>
            <h2>Intellectual Property</h2>
            <p>
              All content available on NiceBoooks, including text, images,
              graphics, logos, and design elements, is protected by intellectual
              property laws. Unauthorized use, reproduction, or distribution of
              any content is prohibited.
            </p>
          </section>

          <section className={styles['rights__section']}>
            <h2>Privacy and Personal Data</h2>
            <p>
              We respect your privacy and are committed to protecting your
              personal information. Any data collected through the website is
              used solely to provide and improve our services, process orders,
              and enhance your user experience.
            </p>
          </section>

          <section className={styles['rights__section']}>
            <h2>Third-Party Links</h2>
            <p>
              Our website may contain links to external websites or services.
              NiceBooks is not responsible for the content, policies, or
              practices of third-party resources.
            </p>
          </section>

          <section className={styles['rights__section']}>
            <h2>Limitation of Liability</h2>
            <p>
              NiceBoooks shall not be held liable for any direct, indirect,
              incidental, or consequential damages resulting from the use or
              inability to use the website and its services.
            </p>
          </section>

          <section className={styles['rights__section']}>
            <h2>Changes to These Terms</h2>
            <p>
              We reserve the right to update or modify these Terms & Conditions
              at any time. Continued use of the website after changes are
              published constitutes acceptance of the revised terms.
            </p>
          </section>

          <section className={styles['rights__section']}>
            <h2>Contact Us</h2>
            <p>
              If you have any questions regarding these Terms & Conditions,
              please contact our support team through the contact form available
              on the website.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
};

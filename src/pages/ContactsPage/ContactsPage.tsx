import React from 'react';
import './ContactsPage.scss';

export const ContactsPage: React.FC = () => {
  return (
    <div className="contacts-page">
      <div className="contacts-page__content">
        <div className="contacts-page__info">
          <h1 className="contacts-page__title">Contact information</h1>

          <ul className="contacts-page__list">
            <li className="contacts-page__item">
              <strong>Phone:</strong>{' '}
              <a href="tel:+11234567890">+1 (123) 456-7890</a>
            </li>
            <li className="contacts-page__item">
              <strong>Email:</strong>{' '}
              <a href="mailto:info@consultagency.com">info@consultagency.com</a>
            </li>
            <li className="contacts-page__item">
              <strong>Address:</strong> 123 Business Street, Suite 100, City,
              State, ZIP
            </li>
            <li className="contacts-page__item">
              <strong>Website:</strong>{' '}
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
              >
                #
              </a>
            </li>
          </ul>

          <div className="contacts-page__hours">
            <h2 className="contacts-page__section-title">HOURS OF OPERATION</h2>
            <p className="contacts-page__hours-text">
              Monday - Friday: 9:00 – 18:00
            </p>
            <p className="contacts-page__hours-text">Saturday: 10:00 – 16:00</p>
            <p className="contacts-page__hours-text">Sunday: Closed</p>
          </div>
        </div>

        <div className="contacts-page__map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12094.252274718426!2d-74.0059413!3d40.7127837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
            className="contacts-page__map"
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map Manhattan"
          />
        </div>
      </div>
    </div>
  );
};

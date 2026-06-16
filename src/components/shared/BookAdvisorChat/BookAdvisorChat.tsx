import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BookAdvisorChat.scss';
import { categoryStructure } from '../../constants/searchCategories.ts';
import { genreIcons } from './genreIcons.ts';
import { useTranslation } from 'react-i18next';
import { useBookAdvisor } from '../../../hooks/useBookAdvisor.ts';
import { useBooks } from '../../../hooks/useBooks.ts';
import { getImageUrl } from '../../../services/getImageUrl.ts';

interface RecommendedBook {
  id: string;
  slug: string;
  name: string;
  reason: string;
}

type Step =
  | 'idle'
  | 'ask_genre'
  | 'ask_last_book'
  | 'loading'
  | 'result'
  | 'error';

interface Message {
  from: 'bot' | 'user';
  text: string;
  time?: string;
}

function getTime() {
  return new Date().toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function BookAdvisorChat() {
  const { data: allBooks = [] } = useBooks();
  const advisorMutation = useBookAdvisor();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<{
    id: string;
    nameKey: string;
    keywords: string[];
    icon: string;
  } | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [recommendedBooks, setRecommendedBooks] = useState<RecommendedBook[]>(
    [],
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const murkoAvatar = getImageUrl('murko-avatar.png');

  const messageSound = useRef(
    new Audio(`${import.meta.env.BASE_URL}sounds/assistant-message.wav`),
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = (text: string) => {
    setMessages((prev) => [...prev, { from: 'bot', text, time: getTime() }]);
    messageSound.current.volume = 0.25;
    messageSound.current.currentTime = 0;
    messageSound.current.play().catch(() => {});
  };

  const addUserMessage = (text: string) => {
    setMessages((prev) => [...prev, { from: 'user', text, time: getTime() }]);
  };

  const advisorGenres = categoryStructure.flatMap((category) =>
    category.subcategories.map((subcategory) => ({
      ...subcategory,
      icon: genreIcons[subcategory.id] ?? '📖',
    })),
  );

  const handleOpen = () => {
    setIsOpen(true);
    if (step === 'idle') {
      setStep('ask_genre');
      setTimeout(() => {
        addBotMessage('Привіт! Я Мурко 🐾');
        setTimeout(() => {
          addBotMessage(
            'Я обожнюю книги і знаю, як знайти саме ту, яка подарує незабутні враження. Допоможу підібрати ідеальну книгу для вас!',
          );
          setTimeout(() => {
            addBotMessage('Який жанр вам найближчий?');
          }, 2200);
        }, 1500);
      }, 500);
    }
  };

  const handleReset = () => {
    setStep('ask_genre');
    setMessages([]);
    setSelectedGenre(null);
    setInputValue('');
    setRecommendedBooks([]);
    setTimeout(() => {
      addBotMessage('Спробуємо ще раз! 🐾');
      setTimeout(() => {
        addBotMessage('Передивляюсь книжкові полиці..');
        setTimeout(() => {
          addBotMessage('Який жанр вам найближчий?');
        }, 1700);
      }, 1200);
    }, 800);
  };

  const handleGenreSelect = (genre: {
    id: string;
    nameKey: string;
    keywords: string[];
    icon: string;
  }) => {
    setSelectedGenre(genre);
    addUserMessage(`${genre.icon} ${t(genre.nameKey)}`);
    setStep('ask_last_book');
    setTimeout(() => {
      addBotMessage(
        'Чудовий вибір! 😊 Назвіть будь-яку книгу, яку ви нещодавно читали — постараюсь не повторюватись. Або натисніть «Пропустити».',
      );
    }, 400);
  };

  const handleLastBookSubmit = async (skip = false) => {
    const lastBook = skip ? '' : inputValue.trim();
    addUserMessage(skip ? 'Пропустити' : lastBook);
    setInputValue('');
    await fetchAndRecommend(selectedGenre!, lastBook);
  };

  const fetchAndRecommend = async (
    genre: {
      id: string;
      nameKey: string;
      keywords: string[];
      icon: string;
    },
    lastBook: string,
  ) => {
    setStep('loading');
    addBotMessage('Шукаю найкращі книги для вас... ⏳');

    try {
      const books = allBooks
        .filter((book) =>
          book.category?.some((cat) =>
            genre.keywords.some((keyword) =>
              cat.toLowerCase().includes(keyword.toLowerCase()),
            ),
          ),
        )
        .slice(0, 10);

      if (books.length === 0) {
        setStep('result');
        setMessages((prev) => prev.filter((m) => !m.text.includes('Шукаю')));
        addBotMessage(
          'На жаль, за цим жанром поки немає книг у каталозі. Спробуйте інший жанр!',
        );
        return;
      }

      const fnData = await advisorMutation.mutateAsync({
        genre: t(genre.nameKey),
        lastBook,
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          author: book.author,
          slug: book.slug,
          description: book.description.slice(0, 200),
          price: book.price_discount ?? book.price_regular,
        })),
      });

      const recommended: RecommendedBook[] = fnData?.books ?? [];

      setStep('result');
      setRecommendedBooks(recommended);

      setMessages((prev) => [
        ...prev.filter((m) => !m.text.includes('Шукаю')),
        {
          from: 'bot',
          text:
            recommended.length > 0 ?
              'Ось що я підібрав для вас 👇'
            : 'На жаль, не вдалось підібрати книги. Спробуйте інший жанр!',
          time: getTime(),
        },
      ]);
    } catch (err) {
      console.error(err);
      setStep('error');
      const errText = err instanceof Error ? err.message : String(err);
      setMessages((prev) => [
        ...prev.filter((m) => !m.text.includes('Шукаю')),
        {
          from: 'bot',
          text: `Упс, щось пішло не так 😕\n\n${errText}`,
          time: getTime(),
        },
      ]);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          className="book-advisor__trigger"
          onClick={handleOpen}
          aria-label="Порадитись з Мурком"
        >
          <img
            className="book-advisor__trigger-avatar"
            src={murkoAvatar}
            alt="Мурко"
          />
          <span className="book-advisor__trigger-label">
            Порадитись з AI Мурком
          </span>
        </button>
      )}

      {isOpen && (
        <div className="book-advisor">
          <div className="book-advisor__header">
            <div className="book-advisor__header-info">
              <img
                className="book-advisor__avatar"
                src={murkoAvatar}
                alt="Мурко"
              />
              <div>
                <div className="book-advisor__name">Мурко 🐾</div>
                <div className="book-advisor__status">книжковий порадник</div>
              </div>
            </div>
            <button
              className="book-advisor__close"
              onClick={() => setIsOpen(false)}
              aria-label="Закрити"
            >
              ✕
            </button>
          </div>

          <div className="book-advisor__messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`book-advisor__message book-advisor__message--${msg.from}`}
              >
                {msg.from === 'bot' && (
                  <img
                    className="book-advisor__msg-avatar"
                    src={murkoAvatar}
                    alt="Мурко"
                  />
                )}
                <div className="book-advisor__msg-bubble">
                  <span className="book-advisor__msg-text">{msg.text}</span>
                  {msg.time && (
                    <span className="book-advisor__msg-time">{msg.time}</span>
                  )}
                </div>
              </div>
            ))}

            {step === 'ask_genre' && messages.length >= 3 && (
              <div className="book-advisor__chips">
                {advisorGenres.map((genre) => (
                  <button
                    key={genre.id}
                    className="book-advisor__chip"
                    onClick={() => handleGenreSelect(genre)}
                  >
                    {genre.icon} {t(genre.nameKey)}
                  </button>
                ))}
              </div>
            )}

            {step === 'ask_last_book' && (
              <div className="book-advisor__input-row">
                <input
                  className="book-advisor__input"
                  placeholder="Напишіть відповідь..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' &&
                    inputValue.trim() &&
                    handleLastBookSubmit(false)
                  }
                  autoFocus
                />
                <button
                  className="book-advisor__send"
                  onClick={() =>
                    inputValue.trim() && handleLastBookSubmit(false)
                  }
                  disabled={!inputValue.trim()}
                  aria-label="Надіслати"
                >
                  ➤
                </button>
                <button
                  className="book-advisor__skip"
                  onClick={() => handleLastBookSubmit(true)}
                >
                  Пропустити
                </button>
              </div>
            )}

            {step === 'loading' && (
              <div className="book-advisor__typing">
                <img
                  className="book-advisor__msg-avatar"
                  src={murkoAvatar}
                  alt="Мурко"
                />
                <div className="book-advisor__typing-dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            {step === 'result' && recommendedBooks.length > 0 && (
              <div className="book-advisor__recommendations">
                {recommendedBooks.map((book) => (
                  <Link
                    key={book.slug}
                    to={`/products/${book.slug}`}
                    className="book-advisor__rec-card"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="book-advisor__rec-name">{book.name}</span>
                    <span className="book-advisor__rec-reason">
                      {book.reason}
                    </span>
                    <span className="book-advisor__rec-link">
                      Переглянути →
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {(step === 'result' || step === 'error') && (
              <button
                className="book-advisor__reset"
                onClick={handleReset}
              >
                🔄 Підібрати ще раз
              </button>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="book-advisor__footer">
            🐾 Мурко читає тисячі книг, щоб знайти найкращу для вас
          </div>
        </div>
      )}
    </>
  );
}

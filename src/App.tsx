import { BooksSwiper } from './components/shared/BooksSwiper';

const newBooksPlaceholders = Array.from({ length: 10 }, (_, index) => ({
  id: `new-${index + 1}`,
  title: `Нова книга ${index + 1}`,
}));

// Масив-плейсхолдер для другого свайпера ("Вам може сподобатись")
const allBooksPlaceholders = Array.from({ length: 12 }, (_, index) => ({
  id: `all-${index + 1}`,
  title: `Книга з бібліотеки ${index + 1}`,
}));

function App() {
  return (
    <>
      <h1>Hello</h1>
      <BooksSwiper
        title="New"
        books={newBooksPlaceholders}
      />
      <BooksSwiper
        title="Like"
        books={allBooksPlaceholders}
      />
    </>
  );
}

export default App;

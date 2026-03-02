import { CTKRProvider, useCTKR } from './ctkr/context/CTKRContext';
import { UserProfile } from './components/UserProfile';
import { PostForm } from './components/PostForm';
import { PostList } from './components/PostList';

const AppContent = () => {
  const { isInitialized } = useCTKR();

  if (!isInitialized) {
    return (
      <main className="container">
        <h1>CTKR Blog</h1>
        <p>Initializing CTKR blog...</p>
      </main>
    );
  }

  return (
    <main className="container">
      <header>
        <h1>CTKR Blog</h1>
        <UserProfile />
      </header>

      <section className="create-section">
        <PostForm />
      </section>

      <section className="posts-section">
        <PostList />
      </section>
    </main>
  );
};

const App = () => {
  return (
    <CTKRProvider>
      <AppContent />
    </CTKRProvider>
  );
};

export default App;

import AppRouter from './routes/AppRouter';
import ToastProvider from './components/toast/ToastProvider';

function App() {
  return (
    <ToastProvider>
      <div className="h-screen flex">
        <AppRouter />
      </div>
    </ToastProvider>
  );
}

export default App;

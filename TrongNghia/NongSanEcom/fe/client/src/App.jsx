import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import RoutesConfig from './routes/RoutesConfig'
import { useUser } from './UserContext'
import Spinner from './components/Spinner'

function App() {
  const { loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" type="leaf" text="Đang tải..." />
      </div>
    );
  }

  return (
    <>
      <RoutesConfig />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </>
  )
}

export default App

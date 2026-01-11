import { BrowserRouter,Routes,Route } from "react-router-dom";
import Body from "./assets/components/Body";
import Login from "./assets/components/Login";
import { Provider } from 'react-redux'
import Store from '../src/assets/utils/Store'
import 'react-toastify/dist/ReactToastify.css';
import Profile from "./assets/components/Profile";
import Feed from "./assets/components/Feed";
import Connection from "./assets/components/Connection"
import Request from "./assets/components/Request";
import Chat from "./assets/components/Chat";
import About from "./assets/components/About";
import EmailVerification from "./assets/components/EmailVerification";
import Matches from "./assets/components/Matches";
import AlumniExplorer from "./assets/components/AlumniExplorer";
import AIAssistant from "./assets/components/AI/AIAssistant";
import AdminLogin from "./assets/components/AdminLogin";
import AdminDashboard from "./assets/components/AdminDashboard";
import ForgotPassword from "./assets/components/ForgotPassword";
import ResetPassword from "./assets/components/ResetPassword";

function App(){
  return(
      <>

     <Provider store={Store}>
      <BrowserRouter basename="/">
       <Routes>
          <Route path="/" element={<Body/>}>   
              <Route path="login" element={<Login/>}/>
              <Route path="verify-email" element={<EmailVerification/>}/>
              <Route path="Profile" element={<Profile/> }/>
              <Route path="/feed" element={<Feed/> }/>
              <Route path="matches" element={<Matches/> }/>
              <Route path="alumni" element={<AlumniExplorer/> }/>
              <Route path="ai-assistant" element={<AIAssistant/> }/>
              <Route path="Connection" element={<Connection/> }/>
              <Route path="Request" element={<Request/>}/>
              <Route path="Chat/:toUserId" element={<Chat/>}/>
              <Route path="about" element={<About/>}/>
          </Route>
          {/* Public Routes - Outside Body to avoid auth checks */}
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/reset-password/:token" element={<ResetPassword/>}/>
          {/* Admin Routes - Outside Body to have full control */}
          <Route path="/admin/login" element={<AdminLogin/>}/>
          <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
       </Routes>
      </BrowserRouter>
      </Provider>


      </>
  );
}
export default App;
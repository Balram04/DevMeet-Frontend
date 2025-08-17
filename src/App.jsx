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

function App(){
  return(
      <>

     <Provider store={Store}>
      <BrowserRouter basename="/">
       <Routes>
          <Route path="/" element={<Body/>}>   
              <Route path="login" element={<Login/>}/>
              <Route path="Profile" element={<Profile/> }/>
              <Route path="/feed" element={<Feed/> }/>
              <Route path="Connection" element={<Connection/> }/>
              <Route path="Request" element={<Request/>}/>
              <Route path="Chat/:toUserId" element={<Chat/>}/>
          </Route>
       </Routes>
      </BrowserRouter>
      </Provider>


      </>
  );
}
export default App;
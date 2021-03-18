
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';

import Footer from './Components/Footer';
import Navbar from './Components/Navbar';
import Player from './Components/Player';



import injectContext from './store/appContext';
import Chat from './Views/Chat';
import Feed from './Views/Feed';
import Friends from './Views/Friends';
import Home from './Views/Home';
import Login from './Views/Login';
import NotFound from './Views/NotFound';
import OtherProfile from './Views/OtherProfile';
import Profile from './Views/Profile';

import Token from './Views/Token';

function App() {
  return (
    <>
      <div>

        <BrowserRouter>
          <Navbar />
          
          <div className="container-fluid">
            
            <Switch>
              <Route exact path="/tokenlogin2171" component={Token} />
              <Route exact path="/profile/:slug" component={OtherProfile} />
              <Route exact path="/chats/:id" component={Chat} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/chats" component={Chat} />
              <Route exact path="/people" component={Friends} />
              <Route exact path="/feed/" component={Feed} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/" component={Home} />
              <Route component={NotFound} />
            </Switch>
          </div>

          <Footer />

        </BrowserRouter>

      </div>
    </>
  );
}

export default injectContext(App);

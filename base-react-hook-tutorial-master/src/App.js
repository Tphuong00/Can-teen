import './App.scss';
import React from 'react';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {ToastContainer} from 'react-toastify';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import Introduces from './components/Introduce/Introduce';
import BuyingGuide from './components/Footer/FooterPage/BuyingGuide';
import Gift from './components/Footer/FooterPage/Gift';
import MenberPolicy from './components/Footer/FooterPage/MenberPolicy';
import PaymentPolicy from './components/Footer/FooterPage/PaymentPolicy';
import PaymentGuide from './components/Footer/FooterPage/Paymentguide';
import Security from './components/Footer/FooterPage/Security';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Reservation from './components/Reservation/Reservation';
import Contact from './components/Contact/Contact';
import Profile from './components/Profile/profile';
import News from './components/news/news';
import NewsDetail from './components/news/newsDetail';
import Menu from './components/Menu-items/Menu';
import ProductDetail from './components/Menu-items/productDetail';


const App =(props) => {
  return(
      <Router >
        <div className="main-container">
          <Header />
          <span className="content-container">
            <Routes>
              <Route path='/home' element={<Home />} />
              <Route path='/' element={<Home />} />
              <Route path="/introduce" element={<Introduces />} />
              <Route path = "/login" element={<Login />} />
              <Route path = "/register" element={<Register />} />
              <Route path="/buying-guide" element={<BuyingGuide/>} />
              <Route path="/payment-guide" element={<PaymentGuide/>} />
              <Route path="/menber-policy" element={<MenberPolicy/>} />
              <Route path="/payment-policy" element={<PaymentPolicy/>} />
              <Route path="/gift" element={<Gift/>} />
              <Route path="/security" element={<Security/>} />
              <Route path="/reservation"element={<Reservation/>} />
              <Route path="/contact" element={<Contact/>} /> 
              <Route path="/profile/*" element={<Profile />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:slug" element={<NewsDetail/>} /> 
              <Route path="/menu" element={<Menu />} />
              <Route path="/:category" element={<Menu />} />
              <Route path="/:category/:slug" element={<ProductDetail />} />
              <Route path="*" element={<div>404 not found</div>} />
            </Routes>
          </span>
          {<Footer />}

          <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          />
        </div>
    </Router>
    // <div>Hello</div>
  )
}

export default App;
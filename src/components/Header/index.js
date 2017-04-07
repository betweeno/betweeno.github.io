import React from 'react';
import HeaderImage from '~/src/assets/img/chatbot-main.png'
import './Header.scss'

const Header = () => {
  return (
    <div id="header" className="container">
      <img src={HeaderImage} alt=""/>
    </div>
  )
}

export default Header

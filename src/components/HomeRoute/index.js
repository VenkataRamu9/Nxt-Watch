import {Component} from 'react'
import {IoMdClose} from 'react-icons/io'

import Header from '../Header'
import SearchVideos from '../SearchVideos'
import CartContext from '../../context/CartContext'

import {
  HomeContainer,
  HomeSideContainer,
  BannerImage,
  HomeStickyContainer,
  CloseButton,
  ModalContainer,
  GetItNowButton,
  BannerImageContainer,
} from './styledComponents'

import SideBar from '../SideBar'

class HomeRoute extends Component {
  state = {isBannerVisible: true}

  onCloseBanner = () => {
    this.setState({isBannerVisible: false})
  }

  renderHomeVideos = () => <SearchVideos />

  render() {
  const {isBannerVisible} = this.state

  return (
    <CartContext.Consumer>
      {value => {
        const {isDarkTheme} = value
        const bgColor = isDarkTheme ? '#181818' : '#f9f9f9'

        return (
          <HomeContainer data-testid="home" bgColor={bgColor}>
            <Header />
            <HomeStickyContainer>
              <HomeSideContainer>
                <SideBar />
                <div style={{width: '100%'}}>
                  {isBannerVisible && (
                    <BannerImageContainer data-testid="banner">
                      <ModalContainer>
                        <BannerImage
                          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
                          alt="nxt watch logo"
                        />
                        <p>Buy Nxt Watch Premium</p>
                        <GetItNowButton>GET IT NOW</GetItNowButton>
                      </ModalContainer>
                      <CloseButton
                        type="button"
                        data-testid="close"
                        onClick={this.onCloseBanner}
                      >
                        <IoMdClose size={20} />
                      </CloseButton>
                    </BannerImageContainer>
                  )}
                  {this.renderHomeVideos()}
                </div>
              </HomeSideContainer>
            </HomeStickyContainer>
          </HomeContainer>
        )
      }}
    </CartContext.Consumer>
  )
}

}

export default HomeRoute

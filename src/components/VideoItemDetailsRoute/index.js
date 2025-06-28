import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import ReactPlayer from 'react-player'

import {
  AiOutlineLike,
  AiOutlineDislike,
  AiFillLike,
  AiFillDislike,
} from 'react-icons/ai'
import {RiPlayListAddFill} from 'react-icons/ri'

import CartContext from '../../context/CartContext'
import Header from '../Header'
import SideBar from '../SideBar'

import {
  HomeContainer,
  ProductsLoaderContainer,
  VideoDetailsSideContainer,
  VideoDetailsTitle,
  VideoDetailsTextContainer,
  ViewsDetailsContainer,
  LikesContainer,
  ViewsText,
  IconContainer,
  HorizontalLine,
  ChannelLogo,
  ChannelContainer,
  ChannelDetailsContainer,
  LogoContainer,
  NotFoundContainer,
  Image,
  Heading,
  Desc,
  NavLink,
  Retry,
} from './styledComponents'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class VideoDetails extends Component {
  state = {
    videoDetails: [],
    apiStatus: apiStatusConstants.initial,
    isVideoSaved: false,
    isLiked: false,
    isDisliked: false,
  }

  componentDidMount() {
    this.getVideoDetails()
  }

  getVideoDetails = async () => {
    const {match} = this.props
    const {id} = match.params

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/videos/${id}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }

    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const data = await response.json()
        const video = data.video_details
        const updatedData = {
          id: video.id,
          publishedAt: video.published_at,
          description: video.description,
          title: video.title,
          videoUrl: video.video_url,
          viewCount: video.view_count,
          thumbnailUrl: video.thumbnail_url,
          channel: {
            name: video.channel.name,
            profileImageUrl: video.channel.profile_image_url,
            subscriberCount: video.channel.subscriber_count,
          },
        }

        const {savedVideos} = this.context
        const isSaved = savedVideos.some(
          savedVideo => savedVideo.id === updatedData.id,
        )

        this.setState({
          videoDetails: updatedData,
          apiStatus: apiStatusConstants.success,
          isVideoSaved: isSaved,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSpecificVideoDetails = () => (
    <CartContext.Consumer>
      {value => {
        const {videoDetails, isVideoSaved, isLiked, isDisliked} = this.state
        const {
          id,
          channel,
          description,
          viewCount,
          videoUrl,
          title,
          publishedAt,
        } = videoDetails
        const {name, profileImageUrl, subscriberCount} = channel
        const {addToSaveVideos, removeSaveVideos, savedVideos} = value

        const handleSave = () => {
          if (isVideoSaved) {
            removeSaveVideos(id)
          } else {
            addToSaveVideos({...videoDetails, videoSaved: true})
          }
          this.setState(prev => ({isVideoSaved: !prev.isVideoSaved}))
        }

        const handleLike = () => {
          this.setState(prev => ({isLiked: !prev.isLiked, isDisliked: false}))
        }

        const handleDislike = () => {
          this.setState(prev => ({
            isDisliked: !prev.isDisliked,
            isLiked: false,
          }))
        }

        const likeColor = isLiked ? '#2563eb' : '#64748b'
        const dislikeColor = isDisliked ? '#2563eb' : '#64748b'
        const savedColor = isVideoSaved ? '#4f46e5' : '#181818'

        return (
          <div data-testid="videoItemDetails">
            <Header />
            <HomeContainer>
              <SideBar />
              <VideoDetailsSideContainer>
                <ReactPlayer
                  url={videoUrl}
                  controls
                  width="90%"
                  height="500px"
                />
                <VideoDetailsTextContainer>
                  <VideoDetailsTitle>{title}</VideoDetailsTitle>
                  <ViewsDetailsContainer>
                    <ViewsText>{viewCount} views</ViewsText>
                    <ViewsText>{publishedAt}</ViewsText>
                    <LikesContainer>
                      <IconContainer
                        type="button"
                        color={likeColor}
                        onClick={handleLike}
                      >
                        {isLiked ? <AiFillLike /> : <AiOutlineLike />}
                        <ViewsText color={likeColor}>Like</ViewsText>
                      </IconContainer>
                      <IconContainer
                        type="button"
                        color={dislikeColor}
                        onClick={handleDislike}
                      >
                        {isDisliked ? <AiFillDislike /> : <AiOutlineDislike />}
                        <ViewsText color={dislikeColor}>Dislike</ViewsText>
                      </IconContainer>
                      <IconContainer
                        type="button"
                        color={savedColor}
                        onClick={handleSave}
                      >
                        <RiPlayListAddFill />
                        <ViewsText color={savedColor}>
                          {savedVideos.some(v => v.id === id)
                            ? 'Saved'
                            : 'Save'}
                        </ViewsText>
                      </IconContainer>
                    </LikesContainer>
                  </ViewsDetailsContainer>
                  <HorizontalLine />
                  <ChannelContainer>
                    <LogoContainer>
                      <ChannelLogo src={profileImageUrl} alt="channel logo" />
                    </LogoContainer>
                    <ChannelDetailsContainer>
                      <ViewsText>{name}</ViewsText>
                      <ViewsText>{subscriberCount} Subscribers</ViewsText>
                      <ViewsText>{description}</ViewsText>
                    </ChannelDetailsContainer>
                  </ChannelContainer>
                </VideoDetailsTextContainer>
              </VideoDetailsSideContainer>
            </HomeContainer>
          </div>
        )
      }}
    </CartContext.Consumer>
  )

  renderLoadingView = () => (
    <ProductsLoaderContainer data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </ProductsLoaderContainer>
  )

  renderFailureView = () => (
    <NotFoundContainer>
      <Image
        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png"
        alt="failure view"
      />
      <Heading>Oops! Something Went Wrong</Heading>
      <Desc>
        We are having some trouble to complete your request. Please try again.
      </Desc>
      <NavLink>
        <Retry type="button" onClick={this.getVideoDetails}>
          Retry
        </Retry>
      </NavLink>
    </NotFoundContainer>
  )

  renderAllVideos = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSpecificVideoDetails()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderAllVideos()}</>
  }
}

VideoDetails.contextType = CartContext

export default VideoDetails

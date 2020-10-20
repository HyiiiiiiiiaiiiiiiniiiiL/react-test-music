import React ,{useState,useEffect,useRef,useCallback} from 'react'
import {connect} from 'react-redux'
import {CSSTransition} from 'react-transition-group'

import {getSingerInfo,changeEnterLoading} from './store/action'
import Loading from '../../baseUI/loading'
import {Container,ImgWrapper,CollectButton,BgLayer,SongListWrapper} from './style'
import Header from '../../baseUI/header/index'
import Scroll from '../../baseUI/scroll/index'
import SongsList from '../SongList'
import {HEADER_HEIGHT} from '../../api/config'

function Singer(props){
    const [showStatus,setShowStatus] = useState(true)

    const {artist:immutableArtist,songs:immutableSongs,loading} = props
    const {getSingerDataDispatch} = props

    const artist = immutableArtist.toJS()
    const songs = immutableSongs.toJS()

    const collectButton = useRef()
    //背景图片ref
    const imageWrapper = useRef()
    //歌曲列表的高度
    const songScrollWrapper = useRef()
    const songScroll = useRef()
    const header = useRef()
     //半个列表的位置
    const layer = useRef()

    //记录图片的默认初始高度
    const initialHeight = useRef(0)


    //列表距收藏按钮的高度
    const OFFSET =5

    useEffect(()=>{
      const id = props.match.params.id
      getSingerDataDispatch(id)
    },[getSingerDataDispatch, props.match.params.id])

    useEffect(()=>{
      let h = imageWrapper.current.offsetHeight;
      songScrollWrapper.current.style.top = `${h - OFFSET}px`
      initialHeight.current = h
      layer.current.style.top =`${h-OFFSET}px`
      songScroll.current.refresh()
    },[])

    const setShowStatusFalse=useCallback(()=>{
      setShowStatus(false)
    },[])

    const handleScroll = pos=>{
      //pos值记录的是歌曲列表当前的滑动上下左右位置 默认值{x:0,y:0}
      let height = initialHeight.current
      const newY = pos.y
      const imageDOM = imageWrapper.current
      const buttonDOM = collectButton.current
      const headerDOM = header.current
      const layerDOM = layer.current
      const minScrollY = -(height - OFFSET) + HEADER_HEIGHT

      const percent = Math.abs(newY/height)
      //percent默认是0 ，往下拉newY逐渐变大，然后newY/height的值变大

      if(newY>0){
        //往下拉列表的时候
        imageDOM.style["transform"] = `scale(${1+percent})`
        buttonDOM.style["transform"] = `translate3d(0,${newY}px,0)`
        layerDOM.style.top = `${height-OFFSET+newY}px`
      }else if(newY >= minScrollY){
        // 列表往上拉但是还没到头部的位置这个过程
        layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`
        layerDOM.style.zIndex =1
         imageDOM.style.paddingTop = "75%"
         imageDOM.style.height =0
         imageDOM.style.zIndex = -1

        buttonDOM.style["transform"] = `translate3d(0,${newY}px,0)`
        buttonDOM.style["opacity"] = `${1-percent*2}`
      }else if(newY<minScrollY){
        //列表网上往上拉到了头部的位置并超出头部的位置
        layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`
        layerDOM.style.zIndex = 1
        headerDOM.style.zIndex = 100
        imageDOM.style.height = `${HEADER_HEIGHT}px`
        imageDOM.style.paddingTop =0
        imageDOM.style.zIndex =99
      }
    }

    return <CSSTransition
    in={showStatus}
    timeout={300}
    classNames="fly"
    appear={true}
    unmountOnExit
    onExited={()=>props.history.goBack()}
    >
        <Container>
        { loading ? (<Loading></Loading>) : null}
            <Header handleClick={setShowStatusFalse} title={artist.name} ref={header}></Header>
            <ImgWrapper bgUrl={artist.picUrl} ref={imageWrapper}>
                <div className="filter"></div>
            </ImgWrapper>
            <CollectButton ref={collectButton}>
                <i className="iconfont">&#xe62d;</i>
                <span className="text"> 收藏 </span>
            </CollectButton>
             <BgLayer ref={layer}></BgLayer>
            <SongListWrapper ref={songScrollWrapper}>
              <Scroll ref={songScroll} onScroll={handleScroll}>
              <SongsList songs={songs} showCollect={false}></SongsList>
               </Scroll>
            </SongListWrapper>
        </Container>
    </CSSTransition>
}


const mapStateToProps=state=>({
  artist:state.getIn(["singerInfo","artist"]),
  songs:state.getIn(["singerInfo",'songsOfArtist']),
  loading:state.getIn(["singerInfo","loading"])
})

const mapDispatchToProps = dispatch=>{
  return {
    getSingerDataDispatch(id){
      dispatch(changeEnterLoading(true))
      dispatch(getSingerInfo(id))
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(React.memo(Singer))
import React,{useState} from 'react'
import {Container} from './style'
import {CSSTransition} from 'react-transition-group'
import Header from '../../baseUI/header'
import Scroll from '../../baseUI/scroll/index'
import {TopDesc} from './style.js'

const currentAlbum = {
    creator: {
      avatarUrl: "http://p1.music.126.net/O9zV6jeawR43pfiK2JaVSw==/109951164232128905.jpg",
      nickname: "浪里推舟"
    },
    coverImgUrl: "http://p2.music.126.net/ecpXnH13-0QWpWQmqlR0gw==/109951164354856816.jpg",
    subscribedCount: 2010711,
    name: "听完就睡，耳机是天黑以后柔软的梦境",
    tracks:[
      {
        name: "我真的受伤了",
        ar: [{name: "张学友"}, {name: "周华健"}],
        al: {
          name: "学友 热"
        }
      },
      {
        name: "我真的受伤了",
        ar: [{name: "张学友"}, {name: "周华健"}],
        al: {
          name: "学友 热"
        }
      },
      {
        name: "我真的受伤了",
        ar: [{name: "张学友"}, {name: "周华健"}],
        al: {
          name: "学友 热"
        }
      },
      {
        name: "我真的受伤了",
        ar: [{name: "张学友"}, {name: "周华健"}],
        al: {
          name: "学友 热"
        }
      },
      {
        name: "我真的受伤了",
        ar: [{name: "张学友"}, {name: "周华健"}],
        al: {
          name: "学友 热"
        }
      },
      {
        name: "我真的受伤了",
        ar: [{name: "张学友"}, {name: "周华健"}],
        al: {
          name: "学友 热"
        }
      },
      {
        name: "我真的受伤了",
        ar: [{name: "张学友"}, {name: "周华健"}],
        al: {
          name: "学友 热"
        }
      },
      {
        name: "我真的受伤了",
        ar: [{name: "张学友"}, {name: "周华健"}],
        al: {
          name: "学友 热"
        }
      },
      {
        name: "我真的受伤了",
        ar: [{name: "张学友"}, {name: "周华健"}],
        al: {
          name: "学友 热"
        }
      },
      {
        name: "我真的受伤了",
        ar: [{name: "张学友"}, {name: "周华健"}],
        al: {
          name: "学友 热"
        }
      },
    ]
  }

function Album(props){
    const [showStatus,setShowStatus] = useState(true)

    const handleBack=()=>{
        setShowStatus(false)
    }
    return <CSSTransition
    in={showStatus}
    timeout={300}
    classNames="fly"
    appear={true}
    unmountOnExit
    onExited={props.history.goBack}
    >
         <Container>
        <Header title="返回"  handleClick={handleBack}/>
        <Scroll bounceTop={false}>
            <TopDesc className="top-desc">
                <div className="top-back">返回</div>
                <div className="content"></div>
                <div className="bottom-tool">
                    <ul>
                        <li>评论</li>
                        <li>点赞</li>
                        <li>收藏</li>
                        <li>更多</li>
                    </ul>
                </div>
            </TopDesc>
        </Scroll>
    </Container>
    </CSSTransition>
}

export default React.memo(Album)
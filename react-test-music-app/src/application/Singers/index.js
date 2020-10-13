//cSpell:word horizen
import React ,{useState,useRef,useEffect}from 'react';
import Horizen from '../../baseUI/horizen-item'
import {categoryTypes, alphaTypes} from '../../api/config'
import {NavContainer} from './style'
import Scroll  from "../../baseUI/scroll/index"
import {List,ListItem,ListContainer} from  './style.js'
import {
  getSingerList,
  getHotSingerList,
  changePageCount,
  refreshMoreSingerList,
  changePullUpLoading,
  changePullDownLoading,
  refreshMoreHotSingerList
} from './store/actionCreators';
import {connect} from 'react-redux'
import { forceCheck } from 'react-lazyload';
import Loading from '../../baseUI/loading'
function Singers(props) {
  const [category,setCategory] = useState('')
  const [alpha,setAlpha] = useState('')
  const listRef = useRef(null)

  const {singerList,enterLoading,pullUpLoading,pullDownLoading,pageCount} = props

const {getHotSingerDispatch,updateDispatch,pullDownRefreshDispatch,pullUpRefreshDispatch} = props

useEffect(()=>{
  getHotSingerDispatch()
},[getHotSingerDispatch])

const renderSingerList=()=>{
  const list = singerList ? singerList.toJS(): [];
return(
  <div ref={listRef}>
  <List>
    {
        list.map ((item, index) => {
          return (
            <ListItem key={item.accountId+""+index}>
              <div className="img_wrapper">
                <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music"/>
              </div>
              <span className="name">{item.name}</span>
            </ListItem>
          )
        })
      }
  </List>
  </div>
)

}


  let handleUpdateAlpha=(val)=>{
    setAlpha(val)
    updateDispatch(category,val)
  }
  let handleUpdateCategory = (val)=>{
    setCategory(val)
    updateDispatch(category,alpha)
  }
  const handlePullUp = () => {
    pullUpRefreshDispatch(category, alpha, category === '', pageCount);
  };

  const handlePullDown = () => {
    pullDownRefreshDispatch(category, alpha);
  };
  return  (
    <NavContainer>
    <Horizen list={categoryTypes} title={"分类 (默认热门):"} handleClick={(val)=>handleUpdateCategory(val)} oldVal={category}></Horizen>
    <Horizen list={alphaTypes} title={"首字母:"} handleClick={val=>handleUpdateAlpha(val)} oldVal={alpha}></Horizen>
    <ListContainer>
      <Scroll pullUp={handlePullUp} pullDown={handlePullDown} pullUpLoading={pullUpLoading} pullDownLoading={pullDownLoading} onScroll={forceCheck}>
        {renderSingerList()}
      </Scroll>
      <Loading show={enterLoading}></Loading>
    </ListContainer>
    </NavContainer>
  )
}


const mapStateToProps=(state)=>({
  singerList:state.getIn(['singers','singerList']),
  enterLoading:state.getIn(['singers','enterLoading']),
  pullUpLoading:state.getIn(['singers','pullUpLoading']),
  pullDownLoading:state.getIn(['singers','pullDownLoading']),
  pageCount:state.getIn(['singers','pageCount'])
})
const mapDispatchToProps=(dispatch)=>{
  return {
    getHotSingerDispatch(){
      dispatch(getHotSingerList())
    },
    updateDispatch(alpha){
      dispatch(changePageCount(0));
      dispatch(getSingerList(alpha));
    },
    pullUpRefreshDispatch(alpha,hot,count){
      dispatch(changePullUpLoading(true))
      dispatch(changePageCount(count+1))
      if(hot){
          dispatch(refreshMoreHotSingerList())
      }else{
         dispatch(refreshMoreSingerList(alpha))
      }
    },
    pullDownRefreshDispatch(category,alpha){
      dispatch(changePullDownLoading(true))
      dispatch(changePageCount(0))
      if(category ==='' && alpha===''){
        dispatch(getHotSingerList())
      }else{
        dispatch(getSingerList(alpha))
      }
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Singers);
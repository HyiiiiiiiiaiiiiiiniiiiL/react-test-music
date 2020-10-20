//cSpell:word horizen
import React ,{useRef,useEffect,useContext}from 'react';
import Horizen from '../../baseUI/horizen-item'

import {renderRoutes} from 'react-router-config'
import {categoryTypes, alphaTypes} from '../../api/config'
import {NavContainer} from './style'
import Scroll  from "../../baseUI/scroll/index"
import {CategoryDataContext} from './data'
import { CHANGE_CATEGORY, CHANGE_ALPHA} from './data';
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
  const listRef = useRef(null)
  const {data, dispatch} = useContext(CategoryDataContext);
  const {category,alpha} = data.toJS()

  const {singerList,enterLoading,pullUpLoading,pullDownLoading,pageCount} = props

const {getHotSingerDispatch,updateDispatch,pullDownRefreshDispatch,pullUpRefreshDispatch} = props

const enterDetail=(id)=>{
  props.history.push(`/singers/${id}`)
}

useEffect(()=>{
  if(!singerList.size){
    getHotSingerDispatch()
  }
},[getHotSingerDispatch, singerList.size])

const renderSingerList=()=>{
  const list = singerList ? singerList.toJS(): [];
return(
  <div ref={listRef}>
  <List>
    {
        list.map ((item, index) => {
          return (
            <ListItem key={item.accountId+""+index} onClick={()=>enterDetail(item.id)}>
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
    dispatch({type: CHANGE_ALPHA, data: val})
    updateDispatch(category,val)
  }
  let handleUpdateCategory = (val)=>{
    dispatch({type: CHANGE_CATEGORY, data: val})
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
    {renderRoutes(props.route.routes)}
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
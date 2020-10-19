//reducer
import {fromJS} from 'immutable'
import { getAlbumDetailRequest } from '../../api/request'

const defaultState=fromJS({
    currentAlbum:{},
    enterLoading:false
})

export const reducer =(state=defaultState,action)=>{
    switch (action.type) {
        case CHANGE_CURRENT_ALBUM:
            return state.set('currentAlbum',action.data)
        case CHANGE_ENTER_LOADING:
            return state.set('enterLoading',action.data)
        default:
            return state
    }
}




//constants
export const CHANGE_CURRENT_ALBUM = 'album/CHANGE_CURRENT_ALBUM';
export const CHANGE_ENTER_LOADING = 'album/CHANGE_ENTER_LOADING';


//actionCreators

const changeCurrentAlbum=(data)=>({
    type:CHANGE_CURRENT_ALBUM,
    data:fromJS(data)
})

export const changeEnterLoading=(data)=>({
    type:CHANGE_ENTER_LOADING,
    data
})

export const getAlbumList=(id)=>{
    return dispatch=>{
        getAlbumDetailRequest(id).then(res=>{
            let data = res.playlist
            dispatch(changeCurrentAlbum(data))
            dispatch(changeEnterLoading(false))
        }).catch(()=>{
            console.log(" 获取album数据失败")
        })
    }
}

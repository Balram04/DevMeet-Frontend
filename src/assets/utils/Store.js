import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import feedReducer from './feedSlice'
import connectionReducer from './connectionSlice'
import requestReducer from './requesSlice'

 const Store = configureStore({
  reducer: { 
    user:userReducer,
    feed:feedReducer,
    connection: connectionReducer,
    requests :requestReducer
  },
})

export default Store;
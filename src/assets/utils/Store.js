import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import feedReducer from './feedSlice'
import connectionReducer from './connectionSlice'
import requestReducer from './requesSlice'
import adminReducer from './adminSlice'

 const Store = configureStore({
  reducer: { 
    user:userReducer,
    feed:feedReducer,
    connection: connectionReducer,
    requests :requestReducer,
    admin: adminReducer
  },
})

export default Store;
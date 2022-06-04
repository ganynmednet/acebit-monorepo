import reducer from './reducers/reducer'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({ reducer: reducer })

export default store
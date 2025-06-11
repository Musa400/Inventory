import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Products from '../compountes/Product/Product'
import AddProduct from '../compountes/Product/AddProudct'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route element={<Products/>} path='/'/>
      <Route element={<AddProduct/>} path='/add-product'/>

      
    </Routes>
    
    
    </BrowserRouter>
  )
}

export default App
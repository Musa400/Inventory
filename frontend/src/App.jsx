import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Products from '../compountes/Product/Product'
import AddProduct from '../compountes/Product/AddProudct'
import Stock from '../compountes/Product/Stock'
import Sales from '../compountes/Product/Sale'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route element={<Products/>} path='/'/>
      <Route element={<AddProduct/>} path='/add-product'/>
      <Route element={<Stock/>} path='/stock'/>
      <Route element={<Sales/>} path='/sale'/>

      
    </Routes>
    
    
    </BrowserRouter>
  )
}

export default App
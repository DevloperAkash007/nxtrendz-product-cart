import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  removeCartItem = id => {
    const {cartList} = this.state
    const newCartList = cartList.filter(cart => cart.id !== id)
    this.setState({cartList: newCartList})
  }

  incrementCartItemQuantity = id => {
    this.setState(prevState => ({
      cartList: prevState.cartList.map(cart => {
        if (cart.id === id) {
          const quantityValue = cart.quantity + 1
          return {...cart, quantity: quantityValue}
        }
        return cart
      }),
    }))
  }

  decrementCartItemQuantity = id => {
    const {cartList} = this.state
    const product = cartList.find(item => item.id === id)
    const {quantity} = product
    if (quantity > 1) {
      this.setState(prevState => ({
        cartList: prevState.cartList.map(cart => {
          if (cart.id === id) {
            const quantityValue = cart.quantity - 1
            return {...cart, quantity: quantityValue}
          }
          return cart
        }),
      }))
    } else {
      this.removeCartItem(id)
    }
  }

  //   TODO: Add your code for remove all cart items, increment cart item quantity, decrement cart item quantity, remove cart item

  addCartItem = product => {
    const {cartList} = this.state
    const existingProduct = cartList.find(each => {
      if (each.id === product.id) {
        return true
      }
      return false
    })

    if (existingProduct === undefined) {
      this.setState(prevState => ({cartList: [...prevState.cartList, product]}))
    }

    if (existingProduct !== undefined) {
      this.setState(prevState => ({
        cartList: prevState.cartList.map(item => {
          if (product.id === item.id) {
            const quantity = existingProduct.quantity + product.quantity

            return {...existingProduct, quantity}
          }
          return item
        }),
      }))
    }
  }

  render() {
    const {cartList} = this.state

    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          removeAllCartItems: this.removeAllCartItems,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/products" component={Products} />
          <ProtectedRoute
            exact
            path="/products/:id"
            component={ProductItemDetails}
          />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </CartContext.Provider>
    )
  }
}

export default App

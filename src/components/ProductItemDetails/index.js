// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'
import './index.css'

const apiConstants = {
  intial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarProductsData: [],
    quantity: 1,
    apiStatus: apiConstants.intial,
  }
  componentDidMount() {
    this.getProductData()
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    style: data.style,
    title: data.title,
    totalReviews: data.total_reviews,
  })
  getProductData = async () => {
    const {match} = this.props

    const {params} = match
    const {id} = params
    this.setState({
      apiStatus: apiConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearers ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedData = this.getFormattedData(fetchedData)
      const updatedsimilarProductsData = fetchedData.similar_products.map(
        eachObject => this.getFormattedData(eachObject),
      )

      this.setState({
        similarProductsData: updatedsimilarProductsData,
        productData: updatedData,
        apiStatus: apiConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiConstants.failure,
      })
      ///
    }
  }

  onDecreamentQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }

  onInreamentQuantity = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))
  }

  renderLoaderView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderProductDetailsView = () => {
    const {productData, quantity, similarProductsData} = this.state
    const {
      availability,
      brand,
      description,
      id,
      imageUrl,
      price,
      rating,
      totalReviews,
      title,
    } = productData
    return (
      <div className="product-detials-success-view">
        <div className="product-details-container">
          <img src={imageUrl} className="update-product-image" alt="product" />
          <div className="product-details-data">
            <h1 className="update-product-title">{title}</h1>
            <p className="update-product-price">Rs: {price}/-</p>
            <div className="ratings-reviews-container">
              <div className="ratings-container">
                <p className="rating-count">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="total-review">{totalReviews} Reviews</p>
            </div>
            <p className="update-product-description">{description}</p>
            <p className="update-product-availability">
              Available: {availability}
            </p>
            <p className="update-product-brand">Brand:{brand}</p>
            <hr />
            <div className="quantity-container">
              <button
                className="decreament-btn"
                type="button"
                onClick={this.onDecreamentQuantity}
                data-testid="minus"
              >
                <BsDashSquare className="icon" />
              </button>

              <p className="quantity">{quantity}</p>
              <button
                className="increament-btn"
                type="button"
                onClick={this.onInreamentQuantity}
                data-testid="plus"
              >
                <BsPlusSquare className="icon" />
              </button>
            </div>
            <button className="addto-cart-btn">ADD TO CART</button>
          </div>
        </div>
        <h1 className="similar-product-heading">Similar Product</h1>
        <ul className="similar-products-list">
          {similarProductsData.map(eachSimilarProduct => (
            <SimilarProductItem
              eachSimilarProductdetails={eachSimilarProduct}
              key={eachSimilarProduct.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="failure-image"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button>Continue Shopping</button>
      </Link>
    </div>
  )

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiConstants.success:
        return this.renderProductDetailsView()
      case apiConstants.failure:
        return this.renderFailureView()
      case apiConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-detials-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails

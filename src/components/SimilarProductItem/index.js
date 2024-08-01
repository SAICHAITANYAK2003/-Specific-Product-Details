// Write your code here
import './index.css'
const SimilarProductItem = props => {
  const {eachSimilarProductdetails} = props
  const {imageUrl, brand, title, price, rating} = eachSimilarProductdetails
  return (
    <li className="similar-products-container">
      <img
        src={imageUrl}
        className="similar-products-image"
        alt={`similar product ${title}`}
      />
      <p className="similar-product-title">{title}</p>
      <p className="similar-product-brand">by {brand}</p>

      <p className="similar-product-price">Rs {price}/-</p>
      <div className="rating-container">
        <p className="rating-count">{rating}</p>
        <img
          src="https://assets.ccbp.in/frontend/react-js/star-img.png"
          alt="star"
          className="star-image"
        />
      </div>
    </li>
  )
}

export default SimilarProductItem

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import {Link} from 'react-router-dom'
import './ProductListing.css'

const productData = [
  {
    id: 1,
    title: 'Belt',
    img: 'https://live.staticflickr.com/7376/16529891306_3fed99f91c_b.jpg',
    price: '£12',
  },
  {
    id: 2,
    title: 'Jacket',
    img: 'https://c2.staticflickr.com/8/7769/17963181310_29566ea829_b.jpg',
    price: '£100',
  },
  {
    id: 3,
    title: 'Shoes',
    img: 'https://live.staticflickr.com/7671/17278913184_95385f21c7_b.jpg',
    price: '£75',
  },
]

const getProducts = () => {
  return productData.map(({id, title, img, price}) => (
    <Link to={`/app/productDetails/${id}`} key={id}>
      <h3>{title}</h3>
      <img src={img} alt={title} className="product-image" />
      <p>{price}</p>
    </Link>
  ))
}

const ProductListing: React.FC = () => {
  return <section className="product-list">{getProducts()}</section>
}

export default ProductListing

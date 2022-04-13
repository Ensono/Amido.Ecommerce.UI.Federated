/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import {useParams} from 'react-router-dom'
import './ProductDetails.css'

const productData = [
  {
    id: 1,
    title: 'Belt',
    img: 'https://live.staticflickr.com/7376/16529891306_3fed99f91c_b.jpg',
    price: '£12',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam blandit augue non ligula tincidunt vulputate. In nisl ipsum, volutpat sed risus ut, accumsan vehicula justo. Curabitur eleifend erat in leo luctus euismod. Morbi tempor libero ipsum, tincidunt fringilla lectus iaculis ac. Integer molestie nunc purus, eget ornare libero posuere eget. Aliquam erat volutpat. Mauris ut diam ipsum. Aenean eu commodo magna, nec pretium mi. Donec varius consectetur nulla, vitae ornare odio mattis sit amet.',
  },
  {
    id: 2,
    title: 'Jacket',
    img: 'https://c2.staticflickr.com/8/7769/17963181310_29566ea829_b.jpg',
    price: '£100',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in mi nibh. Sed bibendum dignissim massa, quis dignissim velit congue in. Curabitur interdum interdum turpis, vitae pretium dui sollicitudin gravida. Duis nec lobortis ex, nec sodales massa. In vel justo semper mauris scelerisque condimentum non nec velit. Nullam iaculis, neque sed lobortis auctor, sapien enim luctus justo, vel faucibus turpis ipsum eget nunc. Ut nec venenatis mauris, ut malesuada ante. Ut molestie diam elit, ut tristique ligula cursus at. Donec laoreet orci est, id posuere mi vulputate in.',
  },
  {
    id: 3,
    title: 'Shoes',
    img: 'https://live.staticflickr.com/7671/17278913184_95385f21c7_b.jpg',
    price: '£75',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tristique, dolor quis ornare dignissim, libero nisl vulputate nulla, id sodales eros nisi a nunc. Sed ac tortor at turpis rhoncus rutrum. Curabitur nibh tellus, blandit id dignissim eget, molestie vitae leo. Aliquam fringilla gravida nulla quis viverra. Proin iaculis cursus metus, quis sodales neque bibendum non. Phasellus eu pellentesque leo. Donec congue vulputate risus, eget pellentesque purus ultricies vel. Proin varius vitae turpis eget luctus. Fusce porttitor massa neque, in auctor velit convallis eu. Ut porttitor ut dui eget fermentum. Mauris rhoncus, velit vel feugiat sollicitudin, nunc sapien accumsan ex, a iaculis nulla purus non orci. Sed ultricies in tellus eu mollis.',
  },
]

const getProduct = (productId: number) => {
  return productData
    .filter(({id}) => id === productId)
    .map(({id, title, img, price, description}) => (
      <section className="product" key={id}>
        <h3>{title}</h3>
        <img src={img} alt={title} className="product-image" />
        <p>{description}</p>
        <p>{price}</p>
      </section>
    ))
}

const ProductListing: React.FC = () => {
  const {id} = useParams()
  const sanitisedId = Number(id)

  return id ? (
    <>{getProduct(sanitisedId)}</>
  ) : (
    <section>
      <p>Error retreving your product</p>
    </section>
  )
}

export default ProductListing

import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useProduct } from "../../context/ProductContext";
import { useDispatch } from "react-redux";
import { addCartThunk } from "../../redux/slices/cartSlice";
import { toast } from "react-toastify";
import RatingStars from "./RatingStars";
import Button from "./Button";
import { BsLightningChargeFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { setCheckoutItems } from "../../redux/slices/checkoutSlice";
import WishlistButton from "./wishlistButton";
import { API_CONFIG } from "../../config/app";

export default function SingleProduct({ product = {}, avgRating = '' }) {

  //PRODUCT IMAGE LINK
  const images = Array.isArray(product.images) && product.images.length > 0
  ? product.images
  : product.image
  ? [product.image]
  : ["https://via.placeholder.com/400"];
  
  const [mainImage, setMainImage] = useState(images[0])
  const {handleAddToCart} = useProduct()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  

  const changeMainImage = (e , i) => {
    const img = resolveImageUrl(e.target.src)
    setMainImage(img)
  }

    useEffect(() => {
    setMainImage(images[0]);
  }, [product, images]);


  const addToCart = () => {
    
    dispatch(addCartThunk({ productId: product._id, quantity: 1 })).unwrap()
    toast.success('Product added to cart')
  }

const handleBuyNow = () => {
  dispatch(setCheckoutItems([
    {
      product: {
        _id: product._id,
        name: product.name,
        images: product.images,
      },
      quantity: 1,
      basePrice: product.originalPrice,      // authoritative price
      finalUnitPrice: product.sellingPrice,  // UI only
      itemTotal: product.sellingPrice,
    }
  ]));

  navigate("/checkout?mode=buynow");
};


const resolveImageUrl = (image, baseUrl = API_CONFIG.imageURL2) => {
    if (!image) return "";

    // Case 1: S3 or Cloudinary object
    if (typeof image === "object" && image.url) {
      // If already absolute (S3), return as-is
      return image.url.startsWith("http")
        ? image.url
        : `${baseUrl}${image.url}`
    }

    // Case 2: Old string path
    if (typeof image === "string") {
      return image.startsWith("http") ? image : `${baseUrl}${image}` ?? `${baseUrl}${image.url}`;
    }

    return "";
  };


  return (
    <div className="w-full max-w-360 mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="flex flex-col items-center relative">
        <div >
          <WishlistButton productId={product._id} heartClass="w-7 h-7" className="absolute top-10 right-10" />
        </div>
        <img
          
          src={ resolveImageUrl(mainImage)}
          alt={product.name || "product"}
          className="w-[380px] h-[420px] object-contain rounded-lg mb-6"
        />

        <div className="flex gap-4 mt-4">
          {images.map((img, i) => (
            <img
              key={i}
              onClick={(e, i)=> changeMainImage(e , i)}
              src={ resolveImageUrl(img)}
              alt={`${product.name || "thumb"}-${i}`}
              className="w-16 h-16 object-contain cursor-pointer border rounded-md p-1"
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold leading-snug">{product.name}</h2>

        <p className="text-3xl font-bold price">Rs. {product.sellingPrice ?? "-"} 
          {product.originalPrice && (
             <span className=" ml-3 line-through old-price">
            Rs. {product.originalPrice}
          </span>
        )}
        </p>

        <p className="text-sm text-gray-600 leading-relaxed max-w-lg">{product.shortDescription}</p>

        <div className="mt-4 flex flex-col gap-3 text-sm helper space-y-1">
          <p><span className="font-semibold">CATEGORY:</span> {product.categoryId?.name ?? "-"}</p>
          <p><span className="font-semibold">BRAND:</span> <span className="text-green-600">{product.brandName ?? "-"}</span></p>
          {avgRating > 0 && (
            <div className="flex">
        <RatingStars avg={avgRating} /> <span className="ml-2 text-sm helper">
  {avgRating.toFixed(1)} ({product.ratings?.length})
</span>
      </div>
          )}
          
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={()=>addToCart()} icon={<ShoppingCart />} type="button" variant={'custom'} className='flex-1'>
             ADD TO CART
          </Button>

          <Button type="button" onClick={handleBuyNow} icon={<BsLightningChargeFill/>} variant={'warning'} className='flex-1'>
             BUY NOW
          </Button>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-2">DESCRIPTION</h3>
          <p className="text-sm helper leading-relaxed max-w-2xl">{product.description}</p>
        </div>
      </div>
    </div>
  );
}
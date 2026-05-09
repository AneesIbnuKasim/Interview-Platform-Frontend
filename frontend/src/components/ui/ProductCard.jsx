import { memo } from "react";
import RatingStars from "./RatingStars";
import { useDispatch } from "react-redux";
import { setCheckoutItems } from "../../redux/slices/checkoutSlice";
import { addCartThunk } from "../../redux/slices/cartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import WishlistButton from "./wishlistButton";
import { toggleWishlistThunk } from "../../redux/slices/wishlistSlice";
import formatImageUrl from "../../utils/formatImageUrl";

const ProductCard = memo(({ product, handleClick=()=>console.log('clicked'), buttons=false, buttonText= ['ADD TO CART', 'BUY NOW'], wishlistPage=false }) => {
  const {
    _id,
    name,
    brandName,
    description,
    images,
    sellingPrice,
    originalPrice,
    ratings,
    avgRating,
    discount,
  } = product;

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // useEffect(())

    const addToCart = () => {
      dispatch(addCartThunk({ productId:_id, quantity: 1 })).unwrap()
      if (wishlistPage) {
        dispatch(toggleWishlistThunk({productId: _id}))
        toast.success('Product moved to cart')
      }
      else toast.success('Product added to cart')
    }
  const handleBuyNow = async() => {
    if (wishlistPage) {
      try {
        const res = await dispatch(toggleWishlistThunk({productId: _id})).unwrap()
      toast.success('Product removed from wishlist!')
      } catch (error) {
        toast.error(error?.message)
      }
    }
    else {
      dispatch(setCheckoutItems([
      {
        product: {
          _id,
          name,
          images,
        },
        quantity: 1,
        basePrice: originalPrice, 
        finalUnitPrice: sellingPrice, 
        itemTotal: sellingPrice,
      }
    ]));
    navigate("/checkout?mode=buynow");
    }
  };
  

  return (
    <div className=" min-h-100 rounded-xl border border-card-theme p-4 shadow-md hover:shadow-xl transition-all cursor-pointer
    bg-card card">
      
      {/* --- TOP BADGE + WISHLIST ICON --- */}
      <div className="flex items-start justify-between">
        <WishlistButton productId={_id} />
        {originalPrice && (
          <span className="bg-green-500 text-white text-xs font-medium px-3 py-0.5 rounded-md">
            {(((originalPrice-sellingPrice)/originalPrice)*100).toFixed()}% OFF
          </span>
        )}
      </div>
      <div onClick={()=>handleClick(_id)}>
      {/* --- PRODUCT IMAGE --- */}
      <div className="w-full flex justify-center my-4">
        <img
          src={ formatImageUrl(images[0])}
          alt={name}
          className="h-40 object-contain"
        />
      </div>

      {/* --- PRODUCT TITLE --- */}
      <h3 className="font-semibold text-[15px] leading-tight product-title">
        {name}
      </h3>
      <span className="helper leading-tight">
        {brandName}
      </span>

      {/* --- RATING --- */}
      {avgRating > 0 && (
            <div className="flex mt-1">
        <RatingStars avg={avgRating} /> <span className="ml-2 text-sm text-gray-600">
  {avgRating.toFixed(1)} ({ratings?.length}) </span>
  </div> ) }

      {/* --- PRICE SECTION --- */}
      <div className="flex items-center gap-2 mt-1">
        <span className="font-semibold text-lg">Rs. {sellingPrice}</span>

        {originalPrice && (
          <span className="text-gray-400 line-through text-sm">
            Rs. {originalPrice}
          </span>
        )}
      </div>
</div>

      {/* BUTTONS */}
             {buttons  && buttonText && (
               <div className="flex gap-2 mt-6">
          <button onClick={()=>addToCart()} type="button" className='flex-1 outline-none text-xs px-3 py-2 text-white rounded-lg bg-violet-500 hover:bg-violet-700 whitespace-nowrap'>
             {buttonText[0]}
          </button>
          <button onClick={handleBuyNow} type="button" className='flex-1 text-xs outline-none px-4 py-2 text-white rounded-lg bg-yellow-500 hover:bg-yellow-700 whitespace-nowrap '>
             {buttonText[1]}
          </button>
        </div>
             )}
    </div>
  );
})

export default ProductCard
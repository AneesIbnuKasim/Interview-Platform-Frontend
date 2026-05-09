import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlistThunk } from "../../redux/slices/wishlistSlice";

const WishlistButton = ({productId, className='', heartClass=''}) => {
  const dispatch = useDispatch();
  const ids = useSelector(state => state.wishlist.ids);

  const isWishlisted = ids.includes(productId);

  const handleClick = (e) => {
    e.stopPropagation();
    dispatch(toggleWishlistThunk({productId}));
  };

  return (
    <button
      onClick={(e)=>handleClick(e, productId)}
      className={`${className}`}
    >
      <Heart
        className={`w-5 h-5 transition hover:fill-red-500 hover:text-red-500 ${heartClass} ${
          isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
        }`}
      />
    </button>
  );
};

export default WishlistButton;
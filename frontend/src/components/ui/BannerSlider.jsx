import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { getBannerLink } from "../../utils/bannerLink";
import formatImageUrl from "../../utils/formatImageUrl";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const BannerSlider = ({ banners = [] }) => {
  const navigate = useNavigate();
return (
    <>
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      loop
      className="w-full h-[500px] rounded-xl"
    >
      {banners.map((banner) => {
        const link = getBannerLink(banner);

        return (
          <SwiperSlide key={banner._id}>
            <img
              src= {formatImageUrl(banner.image)}
              alt={banner.title}
              onClick={() => navigate(link)}
              className="w-full h-full object-fill cursor-pointer"
            />
            {banner.linkType === 'product' && (
                <button
      onClick={(e) => {
        e.stopPropagation();
        navigate(link);
      }}
      className="absolute bottom-15 left-100 bg-white text-black px-4 py-2 rounded-lg shadow hover:bg-gray-100"
    >
      Shop Now
    </button>
            )}
          </SwiperSlide>
        )
    })}
    </Swiper>
    </>
    )
};

export default BannerSlider;
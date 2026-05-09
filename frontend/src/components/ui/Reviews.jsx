// ReviewsList.jsx
import React from "react";
import { Star } from "lucide-react";
import RatingStars from "./RatingStars";

export function ReviewsList({ reviews = [], avgRating }) {

  return (
    <div className="flex flex-col gap-6 mb-10">
      <div className="flex">
        <RatingStars avg={avgRating} /> <span className="ml-2 text-sm helper">
  {avgRating.toFixed(1)} ({reviews?.length})
</span>
      </div>
      {reviews.map((r, i) => (
        <div
          key={i}
          className=" rounded-xl p-6 shadow-xl bg-card flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-inner-card flex justify-center items-center text-xl"> {r.name.slice(0,2).toUpperCase()}</div>
            <div>
              <h4 className="font-semibold text-base">{r.name}</h4>
              {/* <p className="text-sm text-gray-500">{r.location}</p> */}
            </div>
          </div>

          <p className="helper text-[15px] leading-relaxed">{r.review}</p>

          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={18}
                  className={s <= r.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}
                />
              ))}
            </div>

            {/* <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1"><ThumbsUp size={16}/> {r.likes}</div>
              <div className="flex items-center gap-1"><MessageCircle size={16}/> {r.comments}</div>
            </div> */}
          </div>
        </div>
      ))}
    </div>
  );
}





// Usage Example
// import { ReviewsList } from "./ReviewsList";
// import { ReviewForm } from "./ReviewForm";
//
// <ReviewsList reviews={reviews} />
// <ReviewForm onSubmitReview={handleReviewSubmit} />
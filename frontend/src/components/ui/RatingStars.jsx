import { Star, StarHalf } from "lucide-react"

const RatingStars = ({ avg, size = 18 }) => (
  <div className="flex items-center">
    {[1, 2, 3, 4, 5].map((s) => {
      if (s <= Math.floor(avg))
        return <Star key={s} size={size} className="fill-yellow-500 text-yellow-500" />

      if (s === Math.ceil(avg) && avg % 1 !== 0)
        return <StarHalf key={s} size={size} className="fill-yellow-500 text-yellow-500" />

      return <Star key={s} size={size} className="text-gray-300" />
    })}
  </div>
)

export default RatingStars
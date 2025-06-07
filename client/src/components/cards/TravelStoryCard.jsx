import React from "react";
import moment from "moment";
import { FaHeart } from "react-icons/fa6";
import { GrMapLocation } from "react-icons/gr";

const TravelStoryCard = ({
  imgUrl,
  title,
  date,
  story,
  visitedLocation,
  isFavourite,
  onFavouriteClick,
  onClick,
}) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer relative group">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={imgUrl}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
          onClick={onClick}
        />

        {/* Favorite Button */}
        <button
          onClick={onFavouriteClick}
          className="absolute top-3 right-3 w-10 h-10 bg-white/70 backdrop-blur-md flex items-center justify-center rounded-full shadow hover:scale-110 transition"
        >
          <FaHeart
            className={`text-lg transition-colors ${
              isFavourite ? "text-red-500" : "text-gray-400"
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4" onClick={onClick}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-xs text-gray-500">
              {date ? moment(date).format("Do MMM YYYY") : "-"}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {story?.slice(0, 100) || "No story available."}
        </p>

        {Array.isArray(visitedLocation) && visitedLocation.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-cyan-700 bg-cyan-100 rounded-full px-3 py-1 mt-4 w-fit">
            <GrMapLocation className="text-base" />
            <span>{visitedLocation.join(", ")}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelStoryCard;

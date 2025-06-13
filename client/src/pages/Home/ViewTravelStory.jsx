import React from "react";
import moment from "moment"; // Import moment.js
import { GrMapLocation } from "react-icons/gr";
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from "react-icons/md";

// Alternative to moment.js (Optional)
// import dayjs from "dayjs";

const ViewTravelStory = ({ storyInfo,onClose,  onEditClick, onDeleteClick }) => {
  // Example with dayjs (replace moment with dayjs)
  // const formattedDate = dayjs(storyInfo?.visitedDate).format("DD MMM YYYY");

  return (
    <div className="relative">
      {/* Close and action buttons */}
      <div className="flex items-center justify-end">
        <div>
          <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
            <button className="btn-small" onClick={onEditClick}>
              <MdUpdate className="text-lg" />
              UPDATE STORY
            </button>

            <button className="btn-small btn-delete" onClick={onDeleteClick}>
              <MdDeleteOutline className="text-lg" />
              DELETE STORY
            </button>

            <button onClick={onClose} aria-label="Close story view">
              <MdClose className="text-xl text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Story details */}
      <div>
        <div className="flex-1 flex flex-col gap-2 py-4">
          <h1 className="text-2xl text-slate-950">{storyInfo?.title}</h1>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              {storyInfo?.visitedDate
                ? moment(storyInfo.visitedDate).format("DD MMM YYYY")
                : "No date available"}
            </span>

            <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded px-2 py-1">
			<GrMapLocation className="text-sm" />
               {storyInfo &&
               storyInfo.visitedLocation.map((item, index) =>
                storyInfo.visitedLocation.length == index + 1
                ? `${item}`
                : `${item},`
                )
                }

            
            </div>
          </div>
        </div>

        {/* Story image */}
        {storyInfo?.imageUrl ? (
          <img
            src={storyInfo.imageUrl}
            alt="selected"
            className="w-full h-[300px] object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-[300px] flex items-center justify-center bg-gray-200 rounded-lg">
            <span>No Image Available</span>
          </div>
        )}

        {/* Story content */}
        <div className="mt-4">
          <p className="text-sm text-slate-950 leading-6 text-justify whitespace-pre-line">
            {storyInfo?.story || "No story content available"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewTravelStory;
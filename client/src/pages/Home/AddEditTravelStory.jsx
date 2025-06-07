
import React, { useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { MdAdd, MdUpdate, MdClose, MdDeleteOutline } from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector";
import ImageSelector from "../../components/Input/ImageSelector";
import TagInput from "../../components/Input/TagInput";
import axiosInstance from "../../utils/axiosinstance";
import uploadImage from "../../utils/uploadImage";

// Image Imports (Ensure these exist)
import ADD_STORY_IMG from "../../assets/images/add-story.png";
import NO_SEARCH_DATA_IMG from "../../assets/images/no-search-data.png";
import NO_FILTER_DATA_IMG from "../../assets/images/no-filter-data.png";

// ✅ Email Validation Function
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// ✅ Get Initials from Name
export const getInitials = (name) => {
  if (!name) return "";
  const words = name.split(" ");
  let initials = "";
  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }
  return initials.toUpperCase();
};

// ✅ Get Empty Card Message Based on Filter Type
export const getEmptyCardMessage = (filterType) => {
  switch (filterType) {
    case "search":
      return "Oops! No stories matching your search.";
    case "date":
      return "No stories found in the given date range.";
    default:
      return `Start creating your first Travel Story! Click the 'Add' button to jot down your thoughts, ideas, and memories. Let's get started!`;
  }
};

// ✅ Get Empty Card Image Based on Filter Type
export const getEmptyCardImg = (filterType) => {
  switch (filterType) {
    case "search":
      return NO_SEARCH_DATA_IMG;
    case "date":
      return NO_FILTER_DATA_IMG;
    default:
      return ADD_STORY_IMG;
  }
};

// ✅ AddEditTravelStory Component
const AddEditTravelStory = ({ storyInfo, type, 
	onClose, getAllTravelStories }) => {
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
  const [story, setStory] = useState(storyInfo?.story || "");
  const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
  const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null);
  const [error, setError] = useState("");

  // ✅ Add New Travel Story
  const addNewTravelStory = async () => {
    try {
      let imageUrl = "";
      if (storyImg) {
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post("/add-travel-story", {
        title,
        story,
        imageUrl,
        visitedLocation,
        visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
      });

      if (response.data && response.data.story) {
        toast.success("Story Added Successfully");
        getAllTravelStories(); // Refresh stories
        onClose(); // Close modal/form
      }
    } catch (error) {
      setError(error.response?.data?.message || "An unexpected error occurred. Please try again.");
    }
  };

  // ✅ Update Travel Story
  const updateTravelStory = async () => {
    const storyId = storyInfo._id;
    try {
      let imageUrl = storyInfo.imageUrl || "";
      let postData = {
        title,
        story,
        imageUrl,
        visitedLocation,
        visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
      };

      if (typeof storyImg === "object") {
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";
        postData.imageUrl = imageUrl;
      }

      const response = await axiosInstance.put(`/edit-story/${storyId}`, postData);

      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");
        getAllTravelStories(); // Refresh stories
        onClose(); // Close modal/form
      }
    } catch (error) {
      setError(error.response?.data?.message || "An unexpected error occurred. Please try again.");
    }
  };

  // ✅ Handle Click (Add or Update)
  const handleAddOrUpdateClick = () => {
    if (!title) {
      setError("Please enter the title.");
      return;
    }
    if (!story) {
      setError("Please enter the story.");
      return;
    }
    setError("");
    type === "edit" ? updateTravelStory() : addNewTravelStory();
  };

  // ✅ Delete Story Image and Update Story
  const handleDeleteStoryImg = async () => {
    try {
      const deleteImgRes = await axiosInstance.delete("/delete-image", {
        params: { imageUrl: storyInfo.imageUrl },
      });

      if (deleteImgRes.data) {
        const storyId = storyInfo._id;
        const postData = {
          title,
          story,
          visitedLocation,
          visitedDate: moment().valueOf(),
          imageUrl: "",
        };

        await axiosInstance.put(`/edit-story/${storyId}`, postData);
        setStoryImg(null);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add"? "Add Story" : "Update Story"}
        </h5>
		<div>
        <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
          {type === 'add' ? 
            <button className="btn-small" onClick={handleAddOrUpdateClick}>
              <MdAdd className="text-lg" /> ADD STORY
            </button>:<>
			<button className="btn-small" onClick={handleAddOrUpdateClick}>
              <MdUpdate className="text-lg" /> UPDATE STORY
            </button>

			<button className="btn-small btn-delete" onClick={onClose}>
				<MdDeleteOutline className="text-lg"/>DELETE
			</button>

			</>}
          
          <button className="" onClick={onClose}>
            <MdClose className="text-xl text-slate-400" />
          </button>
		  </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-x5 pt-2 text-right">{error}</p>}

      {/* Story Form */}
      <div>
        <div className="flex-1 flex flex-col gap-2 pt-4">
          <label className="input-label">TITLE</label>
          <input
            type="text"
            className="text-2xl text-slate-950 outline-none"
            placeholder="A day at Mulanje Mountain"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="my-3">
            <DateSelector date={visitedDate} setDate={setVisitedDate} />
          </div>

          <ImageSelector image={storyImg} setImage={setStoryImg} handleDeleteImg={handleDeleteStoryImg} />
           <div className="flex flex-col gap-2 mt-4">
          <label className="input-label">STORY</label>
          <textarea
		  type="text"
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            placeholder="your story"
            rows={10}
            value={story}
            onChange={(e) => setStory(e.target.value)}
          />
		  </div>
        <di className="pt-3">
          <label className="input-label">VISITED LOCATIONS</label>
          <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
         </di>
		</div>
      </div>
    </div>
  );
};

export default AddEditTravelStory;

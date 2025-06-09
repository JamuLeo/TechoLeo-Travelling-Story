import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../utils/axiosinstance";
import TravelStoryCard from "../../components/cards/TravelStoryCard";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";
import EmptyCard from "../../components/cards/EmptyCard";
import EmptyImg from "../../assets/images/add-story.png";

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddEditModal, setOpenAddEditModal] = useState({ isShown: false, type: "Add", data: null });
  const [openViewModal, setOpenViewModal] = useState({ isShown: false, data: null });

  useEffect(() => {
    getAllTravelStories();
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data?.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories");
      if (response.data?.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("Unexpected error occurred. Please try again");
    }
  };

  const updateIsFavourite = async (storyData) => {
    try {
      const response = await axiosInstance.put(`/update-is-favourite/${storyData._id}`, {
        isFavourite: !storyData.isFavourite,
      });
      if (response.data?.story) {
        toast.success("Story updated successfully");
        getAllTravelStories();
      }
    } catch (error) {
      console.log("Unexpected error occurred. Please try again");
    }
  };

  const deleteTravelStory = async (data) => {
    try {
      await axiosInstance.delete(`/delete-story/${data._id}`);
      toast.error("Story deleted successfully");
      setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
      getAllTravelStories();
    } catch (error) {
      console.log("Unexpected error occurred. Please try again");
    }
  };

  return (
    <>
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allStories.length > 0 ? (
            allStories.map((item) => (
              <TravelStoryCard
                key={item._id}
                imgUrl={item.imageUrl}
                title={item.title}
                story={item.story}
                date={item.visitedDate}
                visitedLocation={item.visitedLocation}
                isFavourite={item.isFavourite}
                onClick={() => setOpenViewModal({ isShown: true, data: item })}
                onFavouriteClick={() => updateIsFavourite(item)}
              />
            ))
          ) : (
            <div className="col-span-full">
              <EmptyCard
                imgSrc={EmptyImg}
                message="No stories yet Click the + button !"
                subMessage="Click the + button to share your first travel experience."
              />
            </div>
          )}
        </div>
      </div>

      
      <Modal isOpen={openAddEditModal.isShown}
	  onRequestClose={()=>{}}
	  style={{
		overlay:{
			backgroundColor:"rgba(0,0,0,0,2)",
			zIndex:999
		}
	  }}
	  appElement={document.getElementById("root")}
	   className="model-box">
        <AddEditTravelStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => {setOpenAddEditModal
			({ isShown: false, type: "add", data: null });
		  }}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>

	  <button
        className="w-16 h-16 flex items-center justify-center rounded-full  bg-primary hover:bg-cyan-400   fixed right-10 bottom-10 "
        onClick={() => setOpenAddEditModal({ isShown: true, type: "add", data: null })}
      >
        <MdAdd className="text-[28px] text-white" />
      </button>

	  <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />

      <Modal isOpen={openViewModal.isShown} className="model-box">
        <ViewTravelStory
          onClose={() => setOpenViewModal({ isShown: false })}
          onEditClick={() => {
            setOpenViewModal({ isShown: false });
            setOpenAddEditModal({ isShown: true, type: "Edit", data: openViewModal.data });
          }}
          onDeleteClick={() => deleteTravelStory(openViewModal.data)}
          storyInfo={openViewModal.data}
        />
      </Modal>

      

     
    </>
  );
};

export default Home;
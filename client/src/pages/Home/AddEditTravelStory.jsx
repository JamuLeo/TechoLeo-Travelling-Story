import moment from 'moment';
import React, { useState, useEffect, useRef } from 'react';
import {
	MdAdd,
	MdClose,
	MdDeleteOutline,
	MdUpdate,
	MdOutlineDateRange,
} from 'react-icons/md';
import { FaRegFileImage } from 'react-icons/fa';
import { GrMapLocation } from 'react-icons/gr';
import { toast } from 'react-toastify';
import { DayPicker } from 'react-day-picker';

import axiosInstance from '../../utils/axiosInstance';
import uploadImage from '../../utils/uploadImage';

/* ─────────────────────────────────────────
   INLINE COMPONENT: DateSelector
   ───────────────────────────────────────── */
const DateSelector = ({ date, setDate }) => {
	const [openDatePicker, setOpenDatePicker] = useState(false);

	return (
		<div>
			<button
				className="inline-flex items-center gap-2 text-[13px] font-medium text-sky-600 bg-sky-200/40 hover:bg-sky-200/70 rounded px-2 py-1 cursor-pointer"
				onClick={() => setOpenDatePicker(true)}
			>
				<MdOutlineDateRange className="text-lg" />
				{date ? moment(date).format('Do MMM YYYY') : moment().format('Do MMM YYYY')}
			</button>

			{openDatePicker && (
				<div className="p-5 bg-sky-50/80 rounded-lg relative pt-9">
					<button
						className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-100 hover:bg-sky-100 absolute top-2 right-2"
						onClick={() => setOpenDatePicker(false)}
					>
						<MdClose className="text-lg text-sky-600" />
					</button>

					<DayPicker
						captionLayout="dropdown-buttons"
						mode="single"
						selected={date}
						onSelect={setDate}
						pagedNavigation
					/>
				</div>
			)}
		</div>
	);
};

/* ─────────────────────────────────────────
   INLINE COMPONENT: ImageSelector
   ───────────────────────────────────────── */
const ImageSelector = ({ image, setImage, handleDeleteImg }) => {
	const inputRef = useRef(null);
	const [previewUrl, setPreviewUrl] = useState(null);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) setImage(file);
	};

	const chooseFile = () => inputRef.current.click();

	const removeImage = () => {
		setImage(null);
		handleDeleteImg();
	};

	useEffect(() => {
		if (typeof image === 'string') {
			setPreviewUrl(image);
		} else if (image) {
			setPreviewUrl(URL.createObjectURL(image));
		} else {
			setPreviewUrl(null);
		}

		return () => {
			if (previewUrl && typeof previewUrl === 'string' && !image) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [image]);

	return (
		<div>
			<input
				type="file"
				accept="image/*"
				ref={inputRef}
				onChange={handleImageChange}
				className="hidden"
			/>

			{!image ? (
				<button
					className="w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/50"
					onClick={chooseFile}
				>
					<div className="w-14 h-14 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100">
						<FaRegFileImage className="text-xl text-cyan-500" />
					</div>
					<p className="text-sm text-slate-500">Browse image files to upload</p>
				</button>
			) : (
				<div className="w-full relative">
					<img
						src={previewUrl}
						alt="Selected"
						className="w-full h-[300px] object-cover rounded-lg"
					/>
					<button
						className="btn-small btn-delete absolute top-2 right-2"
						onClick={removeImage}
					>
						<MdDeleteOutline className="text-lg" />
					</button>
				</div>
			)}
		</div>
	);
};

/* ─────────────────────────────────────────
   INLINE COMPONENT: TagInput
   ───────────────────────────────────────── */
const TagInput = ({ tags, setTags }) => {
	const [inputValue, setInputValue] = useState('');

	const addTag = () => {
		if (inputValue.trim()) {
			setTags([...tags, inputValue.trim()]);
			setInputValue('');
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') addTag();
	};

	const removeTag = (tagToRemove) =>
		setTags(tags.filter((tag) => tag !== tagToRemove));

	return (
		<div>
			{tags.length > 0 && (
				<div className="flex items-center gap-2 flex-wrap mt-2">
					{tags.map((tag, idx) => (
						<span
							key={idx}
							className="flex items-center gap-2 text-sm text-cyan-600 bg-cyan-200/40 px-3 py-1 rounded"
						>
							<GrMapLocation className="text-sm" /> {tag}
							<button onClick={() => removeTag(tag)}>
								<MdClose />
							</button>
						</span>
					))}
				</div>
			)}

			<div className="flex items-center gap-4 mt-3">
				<input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Add Location"
					className="text-sm bg-transparent border px-3 py-2 rounded outline-none"
				/>
				<button
					className="w-8 h-8 flex items-center justify-center rounded border border-cyan-500 hover:bg-cyan-500"
					onClick={addTag}
				>
					<MdAdd className="text-2xl text-cyan-500 hover:text-white" />
				</button>
			</div>
		</div>
	);
};

/* ─────────────────────────────────────────
   MAIN COMPONENT: AddEditTravelStory
   ───────────────────────────────────────── */
const AddEditTravelStory = ({
	storyInfo,
	type,
	onClose,
	getAllTravelStories,
}) => {
	const [title, setTitle] = useState(storyInfo?.title || '');
	const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
	const [story, setStory] = useState(storyInfo?.story || '');
	const [visitedLocation, setVisitedLocation] = useState(
		storyInfo?.visitedLocation || []
	);
	const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null);
	const [error, setError] = useState('');

	/* ---------- CRUD HELPERS ---------- */
	const addNewTravelStory=async()=>{
    try{
      let imageUrl = ""
      if(storyImg){
        const imageUploadRes = await uploadImage(storyImg)
        imageUrl = imageUploadRes.imageUrl || ""
      }
      const response = await axiosInstance.post("/add-travel-story",{
        title,
        story,
        imageUrl:imageUrl || "",
        visitedLocation,
        visitedDate:visitedDate ? moment(visitedDate).valueOf():moment().valueOf()
      })
      if(response.data && response.data.story){
        console.log("added story",response.data)
        toast.success("Story added successfully")
        getAllTravelStories()
        onClose()
      }

    }catch(error){
      if(error.response && error.response.data && error.response.message){
        setError(error.response.data.message)
      }else{
        setError("Something went wrong")
      }
    }
  }

	const updateTravelStory = async () => {
		const storyId = storyInfo._id;
		try {
			let imageUrl = storyInfo.imageUrl || '';
			if (typeof storyImg === 'object') {
				const { imageUrl: url } = await uploadImage(storyImg);
				imageUrl = url;
			}

			const res = await axiosInstance.put(`/edit-story/${storyId}`, {
				title,
				story,
				imageUrl,
				visitedLocation,
				visitedDate: visitedDate
					? moment(visitedDate).valueOf()
					: moment().valueOf(),
			});

			if (res.data?.story) {
				toast.success('Story updated successfully');
				getAllTravelStories();
				onClose();
			}
		} catch (err) {
			const msg = err.response?.data?.message || 'Unexpected error.';
			setError(msg);
		}
	};

	const handleSave = () => {
		if (!title) return setError('Please enter a title');
		if (!story) return setError('Please enter a story');
		setError('');
		type === 'edit' ? updateTravelStory() : addNewTravelStory();
	};

	const handleDeleteStoryImg = async () => {
		await axiosInstance.delete('/delete-image', {
			params: { imageUrl: storyInfo.imageUrl },
		});
		const storyId = storyInfo._id;
		await axiosInstance.put(`/edit-story/${storyId}`, {
			title,
			story,
			visitedLocation,
			visitedDate: moment().valueOf(),
			imageUrl: '',
		});
		setStoryImg(null);
	};

	/* ---------- RENDER ---------- */
	return (
		<div className="relative w-full max-w-4xl mx-auto p-4">
			{/* HEADER */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
				<h5 className="text-xl font-medium text-slate-700">
					{type === 'add' ? 'Add Story' : 'Update Story'}
				</h5>

				<button
					className="absolute top-2 right-2 text-slate-700 p-2 rounded-full sm:block xl:hidden"
					onClick={onClose}
				>
					<MdClose className="text-2xl" />
				</button>

				{/* ACTION BUTTONS */}
				<div className="w-full sm:w-auto">
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-cyan-50/50 p-2 rounded-lg">
						{type === 'add' ? (
							<button
								className="btn-small w-full sm:w-auto flex items-center justify-center gap-2"
								onClick={handleSave}
							>
								<MdAdd className="text-lg" /> ADD STORY
							</button>
						) : (
							<>
								<button
									className="btn-small w-full sm:w-auto flex items-center justify-center gap-2"
									onClick={handleSave}
								>
									<MdUpdate className="text-lg" /> UPDATE STORY
								</button>
								<button
									className="btn-small btn-delete w-full sm:w-auto flex items-center justify-center gap-2"
									onClick={onClose}
								>
									<MdDeleteOutline className="text-lg" /> DELETE
								</button>
							</>
						)}
						<button className="hidden sm:block" onClick={onClose}>
							<MdClose className="text-xl text-slate-400" />
						</button>
					</div>

					{error && (
						<p className="text-red-500 text-xs pt-2 text-left sm:text-right">
							{error}
						</p>
					)}
				</div>
			</div>

			{/* FORM */}
			<div className="space-y-6">
				{/* TITLE */}
				<div className="flex flex-col gap-2">
					<label className="input-label">TITLE</label>
					<input
						type="text"
						className="text-xl sm:text-2xl text-slate-950 outline-none w-full p-2 bg-slate-50 rounded"
						placeholder="A Day at Great Wall"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>

				{/* DATE */}
				<DateSelector date={visitedDate} setDate={setVisitedDate} />

				{/* IMAGE */}
				<ImageSelector
					image={storyImg}
					setImage={setStoryImg}
					handleDeleteImg={handleDeleteStoryImg}
				/>

				{/* STORY */}
				<div className="flex flex-col gap-2">
					<label className="input-label">STORY</label>
					<textarea
						className="text-sm text-slate-950 outline-none bg-slate-50 p-4 rounded min-h-[200px] w-full"
						placeholder="Your Story"
						rows={10}
						value={story}
						onChange={(e) => setStory(e.target.value)}
					/>
				</div>

				{/* LOCATIONS */}
				<label className="input-label block mb-2">VISITED LOCATIONS</label>
				<TagInput tags={visitedLocation} setTags={setVisitedLocation} />
			</div>
		</div>
	);
};

export default AddEditTravelStory;

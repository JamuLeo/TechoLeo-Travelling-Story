import React from 'react';
import PropTypes from 'prop-types'; // For prop validation

const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <img 
        src={imgSrc || 'default-image-path'} // Provide a default image if imgSrc is not passed
        alt="No notes" 
        className="w-24" 
      />
      <p className="w-1/2 text-sm font-medium text-slate-700 text-center leading-7 mt-5 truncate">
        {message}
      </p>
    </div>
  );
};

// Prop validation (optional, but recommended)
EmptyCard.propTypes = {
  imgSrc: PropTypes.string,
  message: PropTypes.string.isRequired,
};

export default EmptyCard;

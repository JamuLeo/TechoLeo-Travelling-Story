import React from "react";
import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ userInfo, onLogout }) => {
  if (!userInfo) return null;

  const initials = getInitials(userInfo.fullName || "U");

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 transition">
      {/* Avatar */}
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 text-slate-950 font-medium ">
        {initials}
      </div>

      {/* User Info */}
      <div className="flex flex-col">
        <p className="text-sm font-semibold text-gray-800">
          {userInfo.fullName || "Unnamed User"}
        </p>

        <button
          className="text-xs text-cyan-600 hover:underline hover:text-cyan-800 transition"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;

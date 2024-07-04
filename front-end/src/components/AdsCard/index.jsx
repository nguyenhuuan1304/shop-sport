import React from "react";

export default function AdsCard({ Icon, title, description }) {
  return (
    <div className="bg-red-100 p-3 rounded-lg w-80 h-auto">
      <div className="flex flex-row gap-2 items-center">
        <div>
          <Icon
            size={30}
            className="bg-red-500 p-1 rounded-full overflow-hidden text-white"
          />
        </div>
        <span className="text-xl">{title}</span>
      </div>
      <p className="text-sm mt-2 pb-5">{description}</p>
    </div>
  );
}

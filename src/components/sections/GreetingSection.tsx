import React from "react";

export const GreetingSection: React.FC = () => {
  return (
    <section className="w-full flex items-center justify-center flex-col gap-6">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="flex items-center gap-3">
            <span className="font-default-bold text-2xl">김 재 권</span>
            <span className="text-gray-400 text-xl"> | </span>
            <span className="font-default-bold text-2xl">김 지 현</span>
          </div>
        </div>
      </div>
    </section>
  );
};

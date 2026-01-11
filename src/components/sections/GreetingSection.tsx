import React from "react";

export const GreetingSection: React.FC = () => {
  return (
    <section className="w-full flex items-center justify-center flex-col gap-6">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="flex items-center gap-3">
            <span className="font-default-bold text-2xl">김재권</span>
            <span className="text-gray-400 text-xl">|</span>
            <span className="font-default-bold text-2xl">김지현</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-base leading-relaxed">
          <p>
            <span className="text-primary font-default-bold text-lg">지</span>금처럼 서로를 아끼며,
          </p>
          <p>
            <span className="text-primary font-default-bold text-lg">현</span>실보다 더 따뜻한 사랑을 꿈꿔왔습니다.
          </p>
          <p>
            <span className="text-primary font-default-bold text-lg">재</span>밌는 순간을 함께하고,
          </p>
          <p>
            <span className="text-primary font-default-bold text-lg">권</span>할 수 있는 사랑으로 하나 되려 합니다.
          </p>
        </div>
        <div className="mt-2 pt-6 border-t border-gray-200 w-full">
          <p className="text-sm text-gray-600 leading-relaxed">새로운 인연의 시작에 귀한 걸음을 부탁드립니다.</p>
        </div>
      </div>
    </section>
  );
};

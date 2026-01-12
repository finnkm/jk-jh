import React from "react";

export const InvitationSection: React.FC = () => {
  return (
    <section className="w-full flex items-center justify-center flex-col">
      <div className="flex flex-col items-center gap-8 text-center max-w-2xl">
        {/* 초대 문구 */}
        <div className="flex flex-col items-center gap-4 text-base leading-relaxed text-gray-700">
          <p className="font-light">
            <span className="text-primary font-medium text-lg">지</span>금처럼 서로를 아끼며,
          </p>
          <p className="font-light">
            <span className="text-primary font-medium text-lg">현</span>실보다 더 따뜻한 사랑을 꿈꿔왔습니다.
          </p>
          <p className="font-light">
            <span className="text-primary font-medium text-lg">재</span>밌는 순간을 함께하고,
          </p>
          <p className="font-light">
            <span className="text-primary font-medium text-lg">권</span>할 수 있는 사랑으로 하나 되려 합니다.
          </p>
        </div>

        {/* 구분선 */}
        <div className="w-16 h-px bg-gray-200 my-4"></div>

        {/* 마무리 문구 */}
        <p className="text-sm text-gray-600 leading-relaxed font-light italic">
          새로운 인연의 시작에
          <br />
          귀한 걸음을 부탁드립니다.
        </p>
      </div>
    </section>
  );
};

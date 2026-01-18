import React from "react";
import { Bus, Car, Train } from "lucide-react";
import { NaverMap } from "../NaverMap";

export const LocationSection: React.FC = () => {
  return (
    <section className="w-full flex items-center justify-center flex-col bg-primary/5 gap-6 py-6 px-4">
      <div className="flex flex-col items-center gap-2 mb-2">
        <h2 className="font-default-bold text-xl">Location</h2>
      </div>
      <div className="flex flex-col items-center gap-3 text-center max-w-md">
        <div className="flex flex-col items-center gap-1">
          <p className="text-base font-medium">{import.meta.env.VITE_LOCATION_NAME}</p>
          <p className="text-sm text-gray-600">{import.meta.env.VITE_ADDRESS}</p>
        </div>
      </div>
      <div className="w-full max-w-2xl">
        <NaverMap />
      </div>
      <div className="w-full max-w-2xl">
        <div className="flex flex-col gap-6">
          {/* 자가용 */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-default-bold text-lg text-gray-800">자가용</h3>
            </div>
            <div className="flex flex-col gap-3 text-sm text-gray-700 pl-11">
              <div>
                <p className="font-medium mb-1 text-gray-800">네비게이션</p>
                <p className="text-gray-600 leading-relaxed">"더베네치아" 또는 "한국루터회관" 입력</p>
              </div>
              <div className="h-px bg-gray-100"></div>
              <div>
                <p className="font-medium mb-1 text-gray-800">주차 안내</p>
                <p className="text-gray-600 leading-relaxed">루터회관 지하주차장 이용, 주차요원의 안내를 받으세요.</p>
              </div>
            </div>
          </div>

          {/* 지하철 */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Train className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-default-bold text-lg text-gray-800">지하철</h3>
            </div>
            <div className="flex flex-col gap-3 text-sm text-gray-700 pl-11">
              <div>
                <p className="font-medium mb-1 text-gray-800">2호선 잠실역</p>
                <p className="text-gray-600 leading-relaxed">⑧번 출구 하차 도보 2분거리</p>
              </div>
              <div className="h-px bg-gray-100"></div>
              <div>
                <p className="font-medium mb-1 text-gray-800">8호선 잠실역</p>
                <p className="text-gray-600 leading-relaxed">⑨번 출구 하차 도보 1분거리</p>
              </div>
            </div>
          </div>

          {/* 버스 */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bus className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-default-bold text-lg text-gray-800">버스</h3>
            </div>
            <div className="flex flex-col gap-4 text-sm text-gray-700 pl-11">
              <p className="font-medium text-gray-800">잠실역 정류장 하차</p>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="font-medium text-xs mb-1.5 text-gray-500 uppercase tracking-wide">간선버스</p>
                  <p className="text-gray-700 leading-relaxed">302, 303, 320, 341, 342</p>
                </div>
                <div>
                  <p className="font-medium text-xs mb-1.5 text-gray-500 uppercase tracking-wide">지선버스</p>
                  <p className="text-gray-700 leading-relaxed">
                    2412, 2415, 3215, 3216, 3313, 3315, 3318, 3319, 3411, 3412, 3413, 3414, 4318, 4319
                  </p>
                </div>
                <div>
                  <p className="font-medium text-xs mb-1.5 text-gray-500 uppercase tracking-wide">좌석버스</p>
                  <p className="text-gray-700 leading-relaxed">
                    500-1, 1000, 1001, 1007, 1007-1, 1009, 1100, 1112, 1115, 1115-6, 1115-7, 1117, 1200, 1650, 1670,
                    1700, 2000, 5600, 5800, 6900, 7007, 8001, 8002, 9005
                  </p>
                </div>
                <div>
                  <p className="font-medium text-xs mb-1.5 text-gray-500 uppercase tracking-wide">공항버스</p>
                  <p className="text-gray-700 leading-relaxed">6006</p>
                </div>
                <div>
                  <p className="font-medium text-xs mb-1.5 text-gray-500 uppercase tracking-wide">일반버스</p>
                  <p className="text-gray-700 leading-relaxed">30-1, 30-3, 30-5, 70</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

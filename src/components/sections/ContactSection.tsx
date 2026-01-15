import React, { useState } from "react";
import { MessageSquareMore, Phone } from "lucide-react";
import flowerIcon from "@/assets/flower-icon.svg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CONTACTS = {
  groom: {
    name: import.meta.env.VITE_GROOM_NAME,
    phone: import.meta.env.VITE_GROOM_PHONE,
    mother: {
      name: import.meta.env.VITE_GROOM_MOTHER_NAME,
      phone: import.meta.env.VITE_GROOM_MOTHER_PHONE,
    },
  },
  bride: {
    name: import.meta.env.VITE_BRIDE_NAME,
    phone: import.meta.env.VITE_BRIDE_PHONE,
    father: {
      name: import.meta.env.VITE_BRIDE_FATHER_NAME,
      phone: import.meta.env.VITE_BRIDE_FATHER_PHONE,
    },
    mother: {
      name: import.meta.env.VITE_BRIDE_MOTHER_NAME,
      phone: import.meta.env.VITE_BRIDE_MOTHER_PHONE,
    },
  },
};

export const ContactSection: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePhoneCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleSMS = (phone: string) => {
    window.location.href = `sms:${phone}`;
  };

  return (
    <section className="w-full flex items-center justify-center flex-col gap-6">
      <div className="w-full max-w-2xl">
        {/* 신랑 */}
        <div className="flex items-start justify-between gap-4 mb-6 text-gray-700">
          <div className="flex-1 text-left">
            <p className="leading-relaxed flex justify-between items-center">
              <span className="flex items-center gap-1">
                <img src={flowerIcon} alt="flower" className="w-4 h-4" />
                {import.meta.env.VITE_GROOM_FATHER_NAME} • {import.meta.env.VITE_GROOM_MOTHER_NAME}
              </span>
              <span>의 아들</span>
            </p>
            <p className=" mt-1 flex justify-between items-center">
              <span>신랑</span>
              <span className=" text-black">{import.meta.env.VITE_GROOM_SHORT_NAME}</span>
            </p>
          </div>
        </div>

        {/* 디바이더 */}
        <div className="h-px w-full bg-gray-200 my-6"></div>

        {/* 신부 */}
        <div className="flex items-start justify-between gap-4 text-gray-700">
          <div className="flex-1 text-left">
            <p className="leading-relaxed flex justify-between items-center">
              <span>
                {import.meta.env.VITE_BRIDE_FATHER_NAME} • {import.meta.env.VITE_BRIDE_MOTHER_NAME}
              </span>
              <span>의 딸</span>
            </p>
            <p className="mt-1 flex justify-between items-center">
              <span>신부</span>
              <span className="text-black">{import.meta.env.VITE_BRIDE_SHORT_NAME}</span>
            </p>
          </div>
        </div>

        {/* 연락하기 버튼 */}
        <div className="mt-8 flex justify-center">
          <Button className="w-full" onClick={() => setIsDialogOpen(true)}>
            연락하기
          </Button>
        </div>
      </div>

      {/* 연락처 선택 Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>연락하기</DialogTitle>
            <DialogDescription>연락 방법을 선택해주세요.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-6 py-4">
            {[
              { title: "신랑", contacts: [CONTACTS.groom, CONTACTS.groom.mother] },
              { title: "신부", contacts: [CONTACTS.bride, CONTACTS.bride.father, CONTACTS.bride.mother] },
            ].map((section, sectionIndex) => (
              <React.Fragment key={section.title}>
                {sectionIndex > 0 && <div className="h-px w-full bg-gray-200"></div>}
                <div className="flex flex-col gap-4">
                  <p className="text-sm font-semibold text-gray-700">{section.title}</p>
                  {section.contacts.map((contact) => (
                    <div key={contact.name} className="flex flex-col gap-2">
                      <p className="text-sm font-medium">{contact.name}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => handlePhoneCall(contact.phone)}>
                          <Phone className="w-4 h-4" />
                          전화
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={() => handleSMS(contact.phone)}>
                          <MessageSquareMore className="w-4 h-4" />
                          문자
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            ))}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

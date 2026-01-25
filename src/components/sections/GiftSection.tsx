import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const ACCOUNTS = {
  groom: {
    name: import.meta.env.VITE_GROOM_NAME,
    bank: import.meta.env.VITE_GROOM_BANK,
    account: import.meta.env.VITE_GROOM_ACCOUNT,
    mother: {
      name: import.meta.env.VITE_GROOM_MOTHER_NAME,
      bank: import.meta.env.VITE_GROOM_MOTHER_BANK,
      account: import.meta.env.VITE_GROOM_MOTHER_ACCOUNT,
    },
  },
  bride: {
    name: import.meta.env.VITE_BRIDE_NAME,
    bank: import.meta.env.VITE_BRIDE_BANK,
    account: import.meta.env.VITE_BRIDE_ACCOUNT,
    mother: {
      name: import.meta.env.VITE_BRIDE_MOTHER_NAME,
      bank: import.meta.env.VITE_BRIDE_MOTHER_BANK,
      account: import.meta.env.VITE_BRIDE_MOTHER_ACCOUNT,
    },
  },
};

export const GiftSection: React.FC = () => {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const handleCopyAccount = async (account: string) => {
    try {
      await navigator.clipboard.writeText(account);
      setCopiedAccount(account);
      setTimeout(() => setCopiedAccount(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <section className="w-full flex items-center justify-center flex-col gap-6 px-4">
      <div className="flex flex-col items-center gap-2 mb-4">
        <h2 className="font-default-bold text-xl">Contribution</h2>
      </div>
      <div className="flex flex-col items-center gap-2 text-center max-w-md">
        <p className="text-sm text-gray-600 leading-relaxed">
          참석이 어려우신 분들을 위해 기재했습니다.
          <br />
          너그러운 마음으로 양해 부탁드립니다.
        </p>
      </div>
      <div className="w-full max-w-2xl">
        <Accordion type="single" collapsible className="w-full">
          {/* 신랑측 */}
          <AccordionItem value="groom">
            <AccordionTrigger className="text-base">신랑측에게</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-4 pt-2">
                {[ACCOUNTS.groom, ACCOUNTS.groom.mother].map((account) => (
                  <div key={account.name} className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-gray-700">{account.name}</p>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">{account.bank}</p>
                        <p className="text-sm font-medium mt-1">{account.account}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopyAccount(account.account)}
                        className="shrink-0"
                      >
                        {copiedAccount === account.account ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 신부측 */}
          <AccordionItem value="bride">
            <AccordionTrigger className="text-base">신부측에게</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-4 pt-2">
                {[ACCOUNTS.bride, ACCOUNTS.bride.mother].map((account) => (
                  <div key={account.name} className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-gray-700">{account.name}</p>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">{account.bank}</p>
                        <p className="text-sm font-medium mt-1">{account.account}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopyAccount(account.account)}
                        className="shrink-0"
                      >
                        {copiedAccount === account.account ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import useDiscordWebhook from "@/hooks/useDiscordWebhook";

type payload = {
  name: string;
  content: string;
};

export const MessageSection: React.FC = () => {
  const [payload, setPayload] = useState<payload>({
    name: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);

  const { send } = useDiscordWebhook();

  const disabled = loading || !payload.name || !payload.content;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (disabled) return;

    setLoading(true);

    const messagePayload: string = `새로운 축하 메시지가 도착했습니다.\n\n작성자: ${payload.name}\n\n내용: ${payload.content}`;

    try {
      await send({ content: messagePayload });
    } catch (error) {
      toast.error("메시지 전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }

    toast("축하 메시지가 성공적으로 전송되었습니다!");

    setPayload({ name: "", content: "" });
    setLoading(false);
  };

  return (
    <section className="w-full flex items-center justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>축하메세지를 남겨보세요</CardTitle>
          <CardDescription>남겨주신 메시지는 신랑신부에게 즉시 전달됩니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">이름</Label>
                {loading ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
                  <Input
                    id="name"
                    type="text"
                    placeholder="이름을 입력하세요."
                    required
                    maxLength={20}
                    value={payload.name}
                    onChange={(e) => setPayload({ ...payload, name: e.target.value })}
                  />
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">축하 메시지</Label>
                {loading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <Textarea
                    id="message"
                    placeholder="메시지를 입력하세요."
                    required
                    maxLength={200}
                    value={payload.content}
                    onChange={(e) => setPayload({ ...payload, content: e.target.value })}
                  />
                )}
                <p className="text-muted-foreground text-sm">
                  [{payload.content.length}/200] 최대 200자까지 입력할 수 있습니다.
                </p>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" disabled={disabled} onClick={handleSubmit}>
            {loading && <Spinner />}
            축하 메시지 보내기
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
};

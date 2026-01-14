import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import useDiscordWebhook from "@/hooks/useDiscordWebhook";
import type { MessageRequest, MessageResponse } from "@/hooks/useFirebaseDatabase";
import { useFirebaseDatabase } from "@/hooks/useFirebaseDatabase";

const preventSpaceInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === " ") {
    e.preventDefault();
  }
};

export const MessageSection: React.FC = () => {
  const [payload, setPayload] = useState<MessageRequest>({
    name: "",
    content: "",
    password: "",
    createdAt: 0,
  });
  const [messages, setMessages] = useState<MessageResponse[]>([]);

  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [deleteMessageAction, setDeleteMessageAction] = useState<string | undefined>(undefined);

  const { addMessage, subscribeToMessages, deleteMessage } = useFirebaseDatabase();
  const { send } = useDiscordWebhook();

  useEffect(() => {
    // 실시간 감지 시작
    const unsubscribe = subscribeToMessages((data) => {
      setMessages(data); // 자동 업데이트!
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, []);

  const disabled = loading || !payload.name || !payload.content || !payload.password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (disabled) return;

    setLoading(true);

    try {
      await addMessage({
        name: payload.name.trim(),
        content: payload.content.trim(),
        password: payload.password.trim(),
        createdAt: Date.now(),
      });
      toast.success("축하 메시지가 성공적으로 등록되었습니다!");
      setPayload({ name: "", content: "", password: "", createdAt: 0 });
    } catch (error) {
      toast.error("메시지 등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
      console.error(error);
    } finally {
      setLoading(false);
      send({ content: "누군가 축하 메시지 남기기를 시도했습니다." });
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deleteMessageAction) return;

    setLoading(true);

    try {
      await deleteMessage(deleteMessageAction, password);
      setDeleteMessageAction(undefined);
    } catch (error) {
      toast.error("[삭제에 실패했습니다] 비밀번호를 확인해주세요.");
    } finally {
      setPassword("");
      setLoading(false);
    }
  };

  return (
    <>
      <section className="w-full flex items-center justify-center bg-primary/5 flex-col p-4 gap-2">
        축하 메시지를 남겨보세요
        <div className="flex flex-col gap-2 w-full">
          <div className="gap-2 flex-row flex">
            {loading ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <Input
                id="name"
                type="text"
                placeholder="이름"
                required
                maxLength={20}
                value={payload.name}
                onChange={(e) => setPayload({ ...payload, name: e.target.value })}
                onKeyDown={preventSpaceInput}
              />
            )}
            {loading ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <Input
                id="password"
                type="password"
                placeholder="비밀번호"
                required
                maxLength={20}
                value={payload.password}
                onChange={(e) => setPayload({ ...payload, password: e.target.value.replace(/[^a-zA-Z0-9]/g, "") })}
              />
            )}
          </div>

          {loading ? (
            <Skeleton className="h-16 w-full" />
          ) : (
            <Textarea
              id="message"
              placeholder="메시지를 입력하세요."
              required
              maxLength={50}
              value={payload.content}
              onChange={(e) => setPayload({ ...payload, content: e.target.value })}
            />
          )}
          <p className="text-muted-foreground text-sm">
            [{payload.content.length}/50] 최대 50자까지 입력할 수 있습니다.
          </p>
          <Button type="submit" className="w-full" disabled={disabled} onClick={handleSubmit}>
            {loading && <Spinner />}
            축하 메시지 남기기
          </Button>
        </div>
        {messages.length > 0 && (
          <div className="w-full flex flex-col gap-2">
            <div className="w-full flex items-center justify-center">
              <p className="py-5">💐 축하 메시지 💐</p>
            </div>
            {messages.map((message: MessageResponse) => (
              <Item key={message.id} variant="outline">
                <ItemContent>
                  <ItemTitle>
                    {message.name} ({format(new Date(message.createdAt), "yyyy-MM-dd")})
                  </ItemTitle>
                  <ItemDescription>{message.content}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button variant="outline" size="sm" onClick={() => setDeleteMessageAction(message.id)}>
                    삭제
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </div>
        )}
      </section>
      {deleteMessageAction && (
        <Dialog open={Boolean(deleteMessageAction)} onOpenChange={() => setDeleteMessageAction(undefined)}>
          <DialogContent className="sm:max-w-[425px] z-105">
            <DialogHeader>
              <DialogTitle>비밀번호로 보호된 글 입니다.</DialogTitle>
              <DialogDescription>비밀번호를 입력력해 주세요.</DialogDescription>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호"
                required
                maxLength={20}
                value={password}
                onChange={(e) => setPassword(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
              />
            </DialogHeader>
            <DialogFooter>
              <Button type="submit" onClick={handleDelete}>
                삭제하기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

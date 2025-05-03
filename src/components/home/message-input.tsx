"use client";
import { useEffect } from "react";
import { Laugh, Mic, Plus, Send, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import React, { useState } from "react";
import { Button } from "../ui/button";
import MessageControls from "../ui/select";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useConversationStore } from "@/store/chat-store";
import toast from "react-hot-toast";
import useComponentVisible from "@/hooks/useComponentVisible";
import EmojiPicker, { Theme } from "emoji-picker-react";
import MediaDropdown from "./media-dropdown";

const MessageInput = () => {
  const [msgText, setMsgText] = useState("");
  const [hiddenFrom, setHiddenFrom] = useState<Id<"users">[]>([]);
  const sendTextMsg = useMutation(api.messages.sendTextMessage);
  const me = useQuery(api.users.getMe);
  const { selectedConversation } = useConversationStore();
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const [groupMembers, setGroupMembers] =
    useState<{ id: Id<"users">; name: string | undefined }[]>();
  const users = useQuery(api.users.getGroupMembers, {
      conversationId: selectedConversation!._id,
    });
   

    useEffect(() => {
      if (!users || !selectedConversation?.isGroup) return;
    
      const groupMembers = users.map((user) => ({
        id: user._id,
        name: user.name ?? undefined,
      }));
    
      setGroupMembers(groupMembers);
    }, [users, selectedConversation]);
    

  if (!users) return  <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-gray-400" />;
  const handleSendTextMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendTextMsg({
        content: msgText,
        conversation: selectedConversation!._id,
        sender: me!._id,
        hiddenFrom: hiddenFrom,
      });
      setMsgText("");
      setHiddenFrom([]);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-gray-primary p-2 flex gap-4 items-center">
      <div className="relative flex gap-2 ml-2">
        <div ref={ref} onClick={() => setIsComponentVisible(true)}>
          {isComponentVisible && (
            <EmojiPicker
              theme={Theme.AUTO}
              onEmojiClick={(emojiObject) => {
                setMsgText((prev) => prev + emojiObject.emoji);
              }}
              style={{
                position: "absolute",
                bottom: "1.5rem",
                left: "1rem",
                zIndex: 50,
              }}
            />
          )}
          <Laugh className="text-gray-600 dark:text-gray-400" />
        </div>

        <MediaDropdown />
      </div>
      <form onSubmit={handleSendTextMsg} className="w-full flex gap-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Type a message"
            className="py-2 text-sm w-full rounded-lg shadow-sm bg-gray-tertiary focus-visible:ring-transparent"
            value={msgText}
            onChange={(e) => setMsgText(e.target.value)}
          />
        </div>
        <div className="mr-4 flex items-center gap-3">
          {msgText.length > 0 ? (
            <>
              {selectedConversation!.isGroup && (
                <MessageControls
                  msgText={msgText}
                  groupMembers={groupMembers!}
                  onSubmit={(blocked) => {
                    console.log("Blocked user IDs:", blocked);
                    setHiddenFrom(blocked);
                  }}
                />
              )}
              <Button
                type="submit"
                size={"sm"}
                className="bg-transparent text-foreground hover:bg-transparent"
              >
                <Send />
              </Button>
            </>
          ) : (
            <Button
              type="submit"
              size={"sm"}
              className="bg-transparent text-foreground hover:bg-transparent"
            >
              <Mic />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
export default MessageInput;

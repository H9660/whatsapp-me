"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, X } from "lucide-react";
import MessageInput from "./message-input";
import MessageContainer from "./message-container";
import ChatPlaceHolder from "@/components/home/chat-placeholder";
import GroupMembersDialog from "./group-members-dialog";
import { useState } from "react";
import { useConversationStore } from "@/store/chat-store";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConvexAuth } from "convex/react";

const RightPanel = () => {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const [isOpen, setIsOpen] = useState(false);
  const me = useQuery(api.users.getMe);
  const handleConfirm = () => {
    const conversationId = selectedConversation?._id;
    if (!conversationId) return;
  
    window.open(`/video-call?conversationId=${conversationId}&&userId=${me!._id}`, "_blank");
    setIsOpen(false);
  };
  console.log(isAuthenticated);
  const { selectedConversation, setselectedConversation } =
    useConversationStore();
  if (isLoading) return null;
  if (!selectedConversation) return <ChatPlaceHolder />;

  const conversationName =
    selectedConversation.groupName || selectedConversation.name;
  const conversationImage =
    selectedConversation.groupImage || selectedConversation.image;
  const isGroup = selectedConversation.isGroup;

  return (
    <div className="w-3/4 flex flex-col">
      <div className="w-full sticky top-0 z-50">
        {/* Header */}
        <div className="flex justify-between bg-gray-primary p-3">
          <div className="flex gap-3 items-center">
            <Avatar>
              <AvatarImage
                src={conversationImage || "/placeholder.png"}
                className="object-cover"
              />
              <AvatarFallback>
                <div className="animate-pulse bg-gray-tertiary w-full h-full rounded-full" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p>{conversationName}</p>
              {isGroup && (
                <GroupMembersDialog
                  selectedConversation={selectedConversation}
                />
              )}
            </div>
          </div>

          {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0 bg-[url('/whatsapp-bg.png')] bg-cover opacity-10"></div>

          <div className="relative z-10 bg-white rounded-2xl shadow-xl w-80 p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Confirm Video Call
            </h2>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to join the video call?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-black"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-sm bg-green-600 text-white hover:bg-green-700 rounded-lg"
              >
                Yes, go now
              </button>
            </div>
          </div>
        </div>
      )}

          <div className="flex items-center gap-7 mr-5">
            <button onClick={() => setIsOpen(true)} className="p-1">
              <Video size={23} />
            </button>
            <X
              size={16}
              className="cursor-pointer"
              onClick={() => setselectedConversation(null)}
            />
          </div>
        </div>
      </div>
      {/* CHAT MESSAGES */}
      <MessageContainer />

      {/* INPUT */}
      <MessageInput />
    </div>
  );
};
export default RightPanel;

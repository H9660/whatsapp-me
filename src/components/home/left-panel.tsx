"use client";
import { ListFilter, Search } from "lucide-react";
import { Input } from "../ui/input";
import ThemeSwitch from "./theme-switch";
import Conversation from "./conversation";
import { UserButton } from "@clerk/nextjs";
import UserListDialog from "./user-list-dialog";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConversationStore } from "@/store/chat-store";
import { useEffect } from "react";

const LeftPanel = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const conversations = useQuery(
    api.conversations.getMyConversations,
    isAuthenticated ? undefined : "skip"
  );

  const { selectedConversation, setselectedConversation } = useConversationStore();

  useEffect(() => {
    const conversationIds = conversations?.map((conversation) => conversation._id);
    if (
      selectedConversation &&
      conversationIds &&
      !conversationIds.includes(selectedConversation._id)
    ) {
      setselectedConversation(null);
    }
  }, [conversations, selectedConversation, setselectedConversation]);

  if (isLoading) return null;

  return (
    <div className="w-full sm:w-1/4 flex flex-col border-r border-gray-300 dark:border-gray-600 h-screen bg-background dark:bg-[#121b22]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background dark:bg-[#121b22]">
        {/* Header Content */}
        <div className="flex justify-between items-center p-3 bg-background dark:bg-[#121b22]">
          <UserButton />
          <div className="font-semibold px-6 py-2 rounded-full text-black dark:text-white">
            WhatsApp
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && <UserListDialog />}
            <ThemeSwitch />
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 flex items-center">
          <div className="relative h-10 mx-3 flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 z-10"
              size={18}
            />
            <Input
              type="text"
              placeholder="Search or start a new chat"
              className="pl-10 py-2 text-sm w-full rounded bg-white text-black dark:bg-[#1f2c33] dark:text-gray-200 focus-visible:ring-transparent"
            />
          </div>
          <ListFilter className="text-gray-500 dark:text-gray-400 cursor-pointer" />
        </div>
      </div>

      {/* Scrollable Chat List */}
      <div className="flex-1 overflow-y-auto bg-background dark:bg-[#121b22]">
        {conversations?.length ? (
          conversations.map((conversation) => (
            <Conversation key={conversation._id} conversation={conversation} />
          ))
        ) : (
          <div className="text-center text-gray-600 dark:text-gray-500 text-sm mt-3 px-2">
            <p>No conversations yet</p>
            <p>We understand you&apos;re an introvert, but you&apos;ve got to start somewhere 😊</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftPanel;

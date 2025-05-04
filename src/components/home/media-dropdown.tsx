import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@radix-ui/react-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ImageIcon, Plus, Video } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import MessageControls from "../ui/select";
import { Id } from "../../../convex/_generated/dataModel";
import ReactPlayer from "react-player";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConversationStore } from "@/store/chat-store";
import toast from "react-hot-toast";
const MediaDropdown = () => {
  const imageInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const [hiddenFrom, setHiddenFrom] = useState<Id<"users">[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [groupMembers, setGroupMembers] =
    useState<{ id: Id<"users">; name: string | undefined }[]>();
  const generateUploadUrl = useMutation(api.conversations.generateUploadUrl);
  const sendImage = useMutation(api.messages.sendImage);
  const sendVideo = useMutation(api.messages.sendVideo);
  const me = useQuery(api.users.getMe);
  const { selectedConversation } = useConversationStore();

  const [isLoading, setIsLoading] = useState(false);
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

  const handleSendImage = async () => {
    setIsLoading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedImage!.type },
        body: selectedImage,
      });

      const { storageId } = await result.json();
      await sendImage({
        conversation: selectedConversation!._id,
        imgId: storageId,
        sender: me!._id,
        hiddenFrom: hiddenFrom,
      });

      setHiddenFrom([]);
      setSelectedImage(null);
    } catch (err) {
      toast.error("Failed to send image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendVideo = async () => {
    setIsLoading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedVideo!.type },
        body: selectedVideo,
      });

      const { storageId } = await result.json();

      await sendVideo({
        videoId: storageId,
        conversation: selectedConversation!._id,
        sender: me!._id,
        hiddenFrom: hiddenFrom,
      });

      setHiddenFrom([]);
      setSelectedVideo(null);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  type MediaImageDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    selectedImage: File;
    isLoading: boolean;
    isGroup: boolean;
    groupMembers: { id: Id<"users">; name: string | undefined }[];
    handleSendImage: () => void;
  };

  const MediaImageDialog = ({
    isOpen,
    onClose,
    selectedImage,
    isLoading,
    handleSendImage,
    isGroup,
    groupMembers,
  }: MediaImageDialogProps) => {
    const [renderedImage, setRenderedImage] = useState<string | null>(null);
    useEffect(() => {
      if (!selectedImage) return;
      const reader = new FileReader();
      reader.onload = (e) => setRenderedImage(e.target?.result as string);
      reader.readAsDataURL(selectedImage);
    }, [selectedImage]);

    return (
      <Dialog
        open={isOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) onClose();
        }}
      >
        <DialogContent>
          <DialogDescription className="flex flex-col gap-10 justify-center items-center">
            {renderedImage && (
              <Image
                src={renderedImage}
                width={200}
                height={200}
                alt="selected image"
              />
            )}

            {isGroup && (
              <MessageControls
                msgText="Video"
                groupMembers={groupMembers!}
                onSubmit={(blocked) => {
                  console.log("Blocked user IDs:", blocked);
                  setHiddenFrom(blocked);
                }}
              />
            )}

            <Button
              className="w-full"
              disabled={isLoading}
              onClick={handleSendImage}
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    );
  };

  type MediaVideoDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    selectedVideo: File;
    isLoading: boolean;
    isGroup: boolean;
    handleSendVideo: () => void;
  };

  const MediaVideoDialog = ({
    isOpen,
    onClose,
    selectedVideo,
    isLoading,
    handleSendVideo,
    isGroup,
  }: MediaVideoDialogProps) => {
    const renderedVideo = URL.createObjectURL(
      new Blob([selectedVideo], { type: "video/mp4" })
    );

    return (
      <Dialog
        open={isOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) onClose();
        }}
      >
        <DialogContent>
          <DialogDescription>Video</DialogDescription>
          <div className="w-full">
            {renderedVideo && (
              <ReactPlayer url={renderedVideo} controls width="100%" />
            )}
          </div>
          {isGroup && (
            <MessageControls
              msgText="Video"
              groupMembers={groupMembers!}
              onSubmit={(blocked) => {
                console.log("Blocked user IDs:", blocked);
                setHiddenFrom(blocked);
              }}
            />
          )}
          <Button
            className="w-full"
            disabled={isLoading}
            onClick={handleSendVideo}
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <input
        type="file"
        ref={imageInput}
        accept="image/*"
        onChange={(e) => setSelectedImage(e.target.files![0])}
        hidden
      />

      <input
        type="file"
        ref={videoInput}
        accept="video/mp4"
        onChange={(e) => setSelectedVideo(e.target?.files![0])}
        hidden
      />

      {selectedImage && (
        <>
          <MediaImageDialog
            isOpen={true}
            onClose={() => setSelectedImage(null)}
            selectedImage={selectedImage}
            isLoading={isLoading}
            handleSendImage={handleSendImage}
            groupMembers={groupMembers!}
            isGroup={selectedConversation!.isGroup}
          />
        </>
      )}

      {selectedVideo && (
        <MediaVideoDialog
          isOpen={true}
          onClose={() => setSelectedVideo(null)}
          selectedVideo={selectedVideo}
          isLoading={isLoading}
          handleSendVideo={handleSendVideo}
          isGroup={selectedConversation!.isGroup}
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <Plus className="text-gray-600 dark:text-gray-400" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="rounded-xl shadow-lg p-2 bg-white dark:bg-gray-900 text-sm min-w-[160px] z-[9999]">
          <DropdownMenuItem
            onClick={() => imageInput.current!.click()}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer"
          >
            <ImageIcon size={18} />
            <span>Upload Image</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => videoInput.current!.click()}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer"
          >
            <Video size={20} />
            <span>Upload Video</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default MediaDropdown;

"use client";
import { useEffect, useState, useRef } from "react";
import Recorder from "recorder-js";
import { Laugh, Mic, Send, Loader2, Pause } from "lucide-react";
import { Input } from "../ui/input";
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
  const [record, setRecord] = useState(false);
  const [hiddenFrom, setHiddenFrom] = useState<Id<"users">[]>([]);
  const [transcribing, setTranscribing] = useState(false);
  const mediaRecorderRef = useRef<Recorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const startRecording = async () => {
    setRecord(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;
    const recorder = new Recorder(audioContext);
    await recorder.init(stream);
    recorder.start();
    mediaRecorderRef.current = recorder;
    streamRef.current = stream;
  };

  const stopRecording = async () => {
    setRecord(false);
    setTranscribing(true);
    if (!mediaRecorderRef.current) return;
    const result = (await mediaRecorderRef.current.stop()) as any;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    const { blob } = result;
    const formData = new FormData();
    formData.append("audio", blob, "recording.wav");
    const response = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      const text = await response.json();
      setMsgText(text.transcription);
    } else {
      setMsgText("");
    }
    setTranscribing(false);
  };

  const sendTextMsg = useMutation(api.messages.sendTextMessage);
  const me = useQuery(api.users.getMe);
  const { selectedConversation } = useConversationStore();
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const [groupMembers, setGroupMembers] = useState<{ id: Id<"users">; name: string | undefined}[]>();
  const users = useQuery(api.users.getGroupMembers, {
    conversationId: selectedConversation!._id,
  });

  useEffect(() => {
    if (!users || !selectedConversation?.isGroup) return;
    setGroupMembers(users.map((user) => ({ id: user._id, name: user.name })));
  }, [users, selectedConversation]);

  if (!users) {
    return <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-gray-400" />;
  }

  const handleSendTextMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendTextMsg({
        content: msgText,
        conversation: selectedConversation!._id,
        sender: me!._id,
        hiddenFrom,
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
              onEmojiClick={(emojiObject) => setMsgText((prev) => prev + emojiObject.emoji)}
              style={{ position: "absolute", bottom: "1.5rem", left: "1rem", zIndex: 50 }}
            />
          )}
          <Laugh className="text-gray-600 dark:text-gray-400 cursor-pointer" />
        </div>
        <MediaDropdown />
      </div>
      <form onSubmit={handleSendTextMsg} className="w-full flex gap-3 rounded-l-lg rounded-r-lg">
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
                  onSubmit={(blocked) => setHiddenFrom(blocked)}
                />
              )}
              <Button
                type="submit"
                size="sm"
                className="bg-transparent text-foreground hover:bg-transparent"
              >
                <Send />
              </Button>
            </>
          ) : (
            <Button
              type="button"
              size="sm"
              className="bg-transparent text-foreground hover:bg-transparent"
              onClick={!record ? startRecording : stopRecording}
            >
              {!record && !transcribing ? (
                <Mic />
              ) : transcribing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                </div>
              ) : (
                <div className="relative inline-block">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-1 rounded shadow-md text-sm animate-fade-in z-[9999]">
                    Click to send
                  </div>
                  <Pause className="text-red-500 animate-pulse" />
                </div>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
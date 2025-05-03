import { randomID } from "@/lib/utils";
import {useState, useMemo} from "react"
import { useClerk } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Id } from "../../../convex/_generated/dataModel";
export function getUrlParams(url = window.location.href) {
  let urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

interface Props {
  conversationId: Id<"conversations">;
  userId: Id<"users">;
}

export default function VideoUIKit({ conversationId, userId }: Props) {
  const roomID = getUrlParams().get("roomID") || randomID(5);
  const sendTextMsg = useMutation(api.messages.sendTextMessage);
  const { user } = useClerk();
  const meetingUrl = useMemo(() => {
    return (
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?roomID=" +
      roomID
    );
  }, [roomID]);
  
  const content = `New video call started: <a href="${meetingUrl}" target="_blank" class="text-blue-600 underline">Join Meeting</a>`
  const hasSentRef = useRef(false);
  const meetingRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (hasSentRef.current || !conversationId || !userId) return;
    hasSentRef.current = true;
  
    const meetingUrl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?roomID=" +
      roomID;
  
    const content = `New video call started: ${meetingUrl}`;
  
    (async () => {
      try {
        await sendTextMsg({
          content,
          conversation: conversationId,
          sender: userId,
          hiddenFrom: [],
        });
      } catch (error: any) {
        toast.error(error.message);
      }
    })();
  }, [conversationId, userId]);

  useEffect(() => {
    if (user && meetingRef.current) {
      const initMeeting = async () => {
        const res = await fetch(`/api/zegocloud?userID=${user.id}`);
        const { token, appID } = await res.json();
        const meetingUrl =
          window.location.protocol +
          "//" +
          window.location.host +
          window.location.pathname +
          "?roomID=" +
          roomID;
        const username =
          user.fullName || user.emailAddresses[0].emailAddress.split("@")[0];

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
          appID,
          token,
          roomID,
          user.id,
          username
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
          container: meetingRef.current,
          sharedLinks: [
            {
              name: "Personal link",
              url: meetingUrl,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.GroupCall,
          },
        });
      };
      initMeeting();
    }
  }, [user, roomID]);

  return (
    <>
    <div
      className="myCallContainer"
      ref={meetingRef}
      style={{ width: "100vw", height: "100vh" }}
    ></div>
    </>
  );
}

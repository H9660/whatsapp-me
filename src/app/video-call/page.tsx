import { Suspense } from "react";
import VideoCall from "./video-call";

export default function VideoCallPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VideoCall />
    </Suspense>
  );
}
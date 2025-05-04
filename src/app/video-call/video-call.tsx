"use client"
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation";
const DynamicVideoUI = dynamic(() => import("./video-ui-kit"), { ssr: false });

export default function VideoCall() {
	const searchParams = useSearchParams();
	const conversationId  = searchParams.get("conversationId");
	const userId = searchParams.get("userId")
    
	return <DynamicVideoUI conversationId={conversationId} userId={userId}/>;
}
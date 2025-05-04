import LeftPannel from "@/components/home/left-panel";
import RightPanel from "@/components/home/right-panel";

export default function Home() {
  return (
    <main className="m-5">
      <div className="flex flex-col sm:flex-row sm:overflow-y-hidden overflow-y-auto h-auto sm:h-[calc(100vh-50px)] max-w-[1700px] mx-auto bg-left-panel">
        <div className="fixed top-0 left-0 w-full h-36 bg-green-primary dark:bg-transparent -z-30" />

        {/* Left Panel */}
        <LeftPannel />

        {/* Text in Between (only visible on small screens) */}
        <div className="sm:hidden w-full sm:w-auto flex justify-center items-center px-6 py-3 bg-green-flow bg-[length:300%_300%] animate-flow-green text-white mt-3 mb-3">
  <h2 className="text-lg font-semibold">Your Conversation</h2>
</div>
        {/* Right Panel */}
        <RightPanel />
      </div>
    </main>
  );
}

import { useState } from "react";
import { Ban } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

type User = {
  id: Id<"users">;
  name: string | undefined;
};

type MessageControlsProps = {
  msgText: string;
  groupMembers: User[];
  onSubmit: (blockedUsers: Id<"users">[]) => void;
};

export default function MessageControls({
  msgText,
  groupMembers,
  onSubmit,
}: MessageControlsProps) {
  const [blocked, setBlocked] = useState<Id<"users">[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleBlock = (userId: Id<"users">) => {
    setBlocked((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = () => {
    onSubmit(blocked);
    setShowDropdown(false); // optionally hide dropdown after submission
  };

  if (msgText.length === 0) return null;

  return (
    <div className="flex items-center relative">
      <div>
        <button
          type="button"
          onClick={() => setShowDropdown((prev) => !prev)}
          className="border px-2 py-1 rounded"
        >
          Block Users
        </button>

        {showDropdown && (
          <div className="absolute z-10 bottom-full mb-1 w-48 bg-white border rounded shadow p-2 text-black z-[9999]">
            {groupMembers.map((user) => (
              <label key={user.id} className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={blocked.includes(user.id)}
                  onChange={() => toggleBlock(user.id)}
                  className="accent-blue-600"
                />
                <span>{user.name}</span>
              </label>
            ))}

            <button
              type="button"
              onClick={handleSubmit}
              className="mt-2 w-full flex justify-center items-center bg-black text-red-600 font-bold hover:bg-gray-800 px-3 py-1 rounded"
            >
              <Ban size={16} className="mr-2" />
              Block Selected
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

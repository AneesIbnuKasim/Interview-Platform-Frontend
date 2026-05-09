import { ShieldOff, UserX, Eye } from "lucide-react";
import formatImageUrl from "../../utils/formatImageUrl";

export default function UserProfileCard({ user, onBlock, unBlock, onVerify, onView }) {
  return (
    <div className="bg-slate-100 rounded-xl shadow-sm border border-gray-300 p-4 flex gap-4 hover:shadow-md hover:scale-102 transition">

      {/* Avatar */}
      <div className="shrink-0">
        {user.avatar ? (
          <img
            src={`${formatImageUrl(user.avatar)}` || "../public/LOGO.png"}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xl font-semibold">
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800">{user.name}</h4>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          {/* Status badge */}
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium
              ${user.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
              }`}
          >
            {user.status}
          </span>
        </div>

        {/* Meta */}
        <div className="flex gap-4 text-sm text-gray-600 mt-2">
          <span>
            Role:{" "}
            <span className="font-medium capitalize">{user.role}</span>
          </span>
          <span>
            Verified:{" "}
            <span
              className={`font-medium ${
                user.isVerified ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {user.isVerified ? "Yes" : "No"}
            </span>
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          {/* <button
            onClick={() => onView(user._id)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
          >
            <Eye size={16} />
            View
          </button> */}

          {/* {!user.isVerified && (
            <button
              onClick={() => onVerify(user._id)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            >
              <ShieldCheck size={16} />
              Verify
            </button>
          )} */}

          <button
            onClick={() => user.status === 'active' ? onBlock(user._id) : unBlock(user._id)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-red-100 text-red-700 hover:bg-red-200"
          >
            {user.status === "active" ? (
              <>
                <UserX size={16} />
                Block
              </>
            ) : (
              <>
                <ShieldOff size={16} />
                Unblock
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
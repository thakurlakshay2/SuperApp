import React from "react";
import Link from "next/link";

interface GroupListProps {
  groups: any[];
  isLoading: boolean;
}

export default function GroupList({ groups, isLoading }: GroupListProps) {
  if (isLoading)
    return (
      <div className="space-y-4 w-full max-w-md">
        {[1, 2].map((_, idx) => (
          <div
            key={idx}
            className="animate-pulse w-full h-16 bg-gray-300 rounded-lg"
          ></div>
        ))}
      </div>
    );

  return (
    <div className="w-full max-w-md space-y-4">
      {groups.map((group) => (
        <Link key={group.id} href={`/payUrFren/${group.id}`} passHref>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm cursor-pointer">
            <h2 className="text-lg font-semibold">{group.name}</h2>
            <p className="text-gray-500 text-sm">
              {group.members.length} members • Created on {group.createdAt}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Skill {
  name: string;
  icon: string;
}

export function EventDetails() {
  const skills: Skill[] = [
    { name: "CSS", icon: "🎨" },
    { name: "HTML", icon: "📝" },
    { name: "Github", icon: "💻" }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Building the Fastest Growing Gaming Tech</h1>
      <p className="text-gray-600">Deploy your first website in minutes</p>
      
      <div className="space-y-4">
        <h3 className="font-semibold">Skill you'll be learning</h3>
        <div className="flex gap-2">
          {skills.map((skill) => (
            <div key={skill.name} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
              <span>{skill.icon}</span>
              <span>{skill.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=faces" />
          <AvatarFallback>DK</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">Dr. Prateek kaien</div>
          <div className="text-sm text-gray-500">Karnataka</div>
        </div>
      </div>

      <p className="text-gray-600">
        Lorem ipsum dolor sit amet consectetur. Ut dictum aenean diam eros faucibus consequat risus vel. Libero sit dis feugiat vestibulum. Nisl massa donec diam suscipit. Mattis rhoncus amet leo feugiat eu. Mauris amet proin in mi facilisi. Ut sem id.
      </p>
    </div>
  );
}
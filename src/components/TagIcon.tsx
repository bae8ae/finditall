"use client";

import {
  Wallet, Key, Tv, Glasses, Smartphone, IdCard, Pill, Folder,
  Headphones, Armchair, Activity, Tablet, Package, Brush,
  FlaskConical, Boxes, Briefcase, Laptop, Projector, Camera,
  Speaker, KeyRound, Radio, Box, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MAP: Record<string, LucideIcon> = {
  wallet: Wallet, key: Key, tv: Tv, glasses: Glasses, smartphone: Smartphone,
  "id-card": IdCard, pill: Pill, folder: Folder, headphones: Headphones,
  armchair: Armchair, activity: Activity, tablet: Tablet, package: Package,
  brush: Brush, "flask-conical": FlaskConical, boxes: Boxes, briefcase: Briefcase,
  laptop: Laptop, projector: Projector, camera: Camera, speaker: Speaker,
  "key-round": KeyRound, radio: Radio,
};

export function TagIcon({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  const Icon = MAP[icon] ?? Box;
  return <Icon className={cn("size-5", className)} />;
}

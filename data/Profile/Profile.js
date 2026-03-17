import { User, Image, Shield, CreditCard, Bell } from "lucide-react";

export const profileMenu = [
  {
    title: "Profil sozlamalari",
    path: "",
    icon: User,
  },
  {
    title: "Profil rasmi",
    path: "avatar",
    icon: Image,
  },
  {
    title: "Xavfsizlik",
    path: "security",
    icon: Shield,
  },
  {
    title: "To'lovlar",
    path: "payments",
    icon: CreditCard,
  },
  {
    title: "Bildirishnomalar",
    path: "notifications",
    icon: Bell,
  },
];

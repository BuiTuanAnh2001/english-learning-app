"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  Camera,
  Edit2,
  Eye,
  LogOut,
  Mail,
  MapPin,
  Moon,
  Phone,
  Save,
  User,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  });
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    darkModeEnabled: false,
    onlineStatusVisible: true,
  });

  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || "",
        username: session.user.username || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
        location: session.user.location || "",
        bio: session.user.bio || "",
      });
      setSettings({
        notificationsEnabled: session.user.notificationsEnabled ?? true,
        darkModeEnabled: session.user.darkModeEnabled ?? false,
        onlineStatusVisible: session.user.onlineStatusVisible ?? true,
      });
    }
  }, [session]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profileData, ...settings }),
      });

      if (res.ok) {
        await update();
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const handleDeleteAccount = async () => {
    if (
      confirm(
        "Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác."
      )
    ) {
      try {
        const res = await fetch("/api/user/profile", {
          method: "DELETE",
        });

        if (res.ok) {
          await signOut({ callbackUrl: "/login" });
        }
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/chat")}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5 mr-2" />
            Đóng
          </Button>
          <h1 className="text-2xl font-bold text-white">Hồ sơ của bạn</h1>
          <div className="w-24"></div>
        </div>

        {/* Profile Card */}
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700 p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-cyan-500">
                  <AvatarImage src={session?.user?.image || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-4xl">
                    {session?.user?.name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="mt-4 text-center">
                <h2 className="text-xl font-bold text-white">
                  {session?.user?.name}
                </h2>
                <p className="text-slate-400">
                  @{session?.user?.username || "user"}
                </p>
                <div className="mt-2 inline-flex items-center px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Đang hoạt động
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Thông tin cá nhân
                </h3>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white border-0"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                      className="bg-slate-700 hover:bg-slate-600 text-white border-0"
                    >
                      Hủy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white border-0"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? "Đang lưu..." : "Lưu"}
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Tên
                  </Label>
                  <Input
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    disabled={!isEditing}
                    className="bg-slate-700/50 border-slate-600 text-white disabled:opacity-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Tên người dùng
                  </Label>
                  <Input
                    value={profileData.username}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        username: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    className="bg-slate-700/50 border-slate-600 text-white disabled:opacity-100"
                    placeholder="username"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    value={profileData.email}
                    disabled
                    className="bg-slate-700/50 border-slate-600 text-white disabled:opacity-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Số điện thoại
                  </Label>
                  <Input
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    disabled={!isEditing}
                    className="bg-slate-700/50 border-slate-600 text-white disabled:opacity-100"
                    placeholder="+84 901234567"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Địa điểm
                  </Label>
                  <Input
                    value={profileData.location}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        location: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    className="bg-slate-700/50 border-slate-600 text-white disabled:opacity-100"
                    placeholder="Ho Chi Minh City, Vietnam"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Giới thiệu</Label>
                  <Textarea
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    disabled={!isEditing}
                    className="bg-slate-700/50 border-slate-600 text-white disabled:opacity-100 min-h-[100px]"
                    placeholder="Yêu thích công nghệ và lập trình. Luôn tìm kiếm những điều mới mẻ. Liên hệ qua email cho công việc."
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Settings Card */}
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700 p-8 mb-6">
          <h3 className="text-lg font-semibold text-white mb-6">
            Cài đặt ứng dụng
          </h3>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Thông báo</p>
                  <p className="text-sm text-slate-400">
                    Nhận thông báo khi có tin nhắn mới
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.notificationsEnabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, notificationsEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center">
                  <Moon className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Chế độ tối</p>
                  <p className="text-sm text-slate-400">
                    Sử dụng giao diện tối cho ứng dụng
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.darkModeEnabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, darkModeEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Trạng thái hoạt động</p>
                  <p className="text-sm text-slate-400">
                    Hiển thị khi bạn đang online
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.onlineStatusVisible}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, onlineStatusVisible: checked })
                }
              />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Đăng xuất
          </Button>

          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            className="w-full bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
          >
            Xóa tài khoản
          </Button>
        </div>
      </div>
    </div>
  );
}

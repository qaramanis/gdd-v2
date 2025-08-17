"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/database/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Plus,
  Users,
  Mail,
  Clock,
  Check,
  X,
  Shield,
  Eye,
  Edit,
  MessageSquare,
  Crown,
  Settings,
  UserPlus,
  FileText,
  Gamepad,
  Bell,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/providers/user-context";

interface Invitation {
  id: string;
  document_id: string | null;
  team_id: string | null;
  game_id: string | null;
  inviter_id: string;
  invitee_email: string;
  permission: string;
  status: string;
  message: string | null;
  created_at: string;
  expires_at: string;
  documents?: { title: string };
  teams?: { name: string };
  games?: { name: string };
  user?: { name: string; email: string };
}

interface Team {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
  user?: { name: string; email: string };
  team_members?: TeamMember[];
}

interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  user?: { name: string; email: string; image: string };
}

interface SharedDocument {
  id: string;
  title: string;
  permission: string;
  added_at: string;
  game_id: string;
  games?: { name: string };
  added_by_user?: { name: string };
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data: any;
  read: boolean;
  created_at: string;
}

export default function TeamsPage() {
  const { userId, user } = useUser();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("invitations");

  // Invitations state
  const [pendingInvitations, setPendingInvitations] = useState<Invitation[]>(
    [],
  );
  const [sentInvitations, setSentInvitations] = useState<Invitation[]>([]);

  // Teams state
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");

  // Shared documents state
  const [sharedDocuments, setSharedDocuments] = useState<SharedDocument[]>([]);

  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchAllData();
    }
  }, [userId]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchInvitations(),
        fetchTeams(),
        fetchSharedDocuments(),
        fetchNotifications(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitations = async () => {
    if (!user?.email) return;

    // Fetch pending invitations for the user
    const { data: received, error: receivedError } = await supabase
      .from("invitations")
      .select(
        `
        *,
        documents(title),
        teams(name),
        games(name),
        user:inviter_id(name, email)
      `,
      )
      .eq("invitee_email", user.email)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (receivedError) {
      console.error("Error fetching received invitations:", receivedError);
    } else {
      setPendingInvitations(received || []);
    }

    // Fetch sent invitations
    const { data: sent, error: sentError } = await supabase
      .from("invitations")
      .select(
        `
        *,
        documents(title),
        teams(name),
        games(name)
      `,
      )
      .eq("inviter_id", userId)
      .order("created_at", { ascending: false });

    if (sentError) {
      console.error("Error fetching sent invitations:", sentError);
    } else {
      setSentInvitations(sent || []);
    }
  };

  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from("team_members")
      .select(
        `
        *,
        teams:team_id(
          *,
          user:owner_id(name, email),
          team_members(
            *,
            user:user_id(name, email, image)
          )
        )
      `,
      )
      .eq("user_id", userId)
      .order("joined_at", { ascending: false });

    if (error) {
      console.error("Error fetching teams:", error);
    } else {
      const teams = data?.map((item) => item.teams).filter(Boolean) || [];
      setMyTeams(teams);
    }
  };

  const fetchSharedDocuments = async () => {
    const { data, error } = await supabase
      .from("document_collaborators")
      .select(
        `
        *,
        documents:document_id(
          id,
          title,
          game_id,
          games:game_id(name)
        ),
        added_by_user:added_by(name)
      `,
      )
      .eq("user_id", userId)
      .order("added_at", { ascending: false });

    if (error) {
      console.error("Error fetching shared documents:", error);
    } else {
      const docs =
        data?.map((item) => ({
          id: item.documents.id,
          title: item.documents.title,
          permission: item.permission,
          added_at: item.added_at,
          game_id: item.documents.game_id,
          games: item.documents.games,
          added_by_user: item.added_by_user,
        })) || [];
      setSharedDocuments(docs);
    }
  };

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching notifications:", error);
    } else {
      setNotifications(data || []);
      setUnreadCount(data?.filter((n) => !n.read).length || 0);
    }
  };

  const handleAcceptInvitation = async (invitation: Invitation) => {
    try {
      const { error } = await supabase.rpc("accept_invitation", {
        p_invitation_id: invitation.id,
        p_user_id: userId,
      });

      if (error) throw error;

      toast.success("Invitation accepted successfully!");
      await fetchAllData();
    } catch (error: any) {
      console.error("Error accepting invitation:", error);
      toast.error(error.message || "Failed to accept invitation");
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from("invitations")
        .update({ status: "declined", responded_at: new Date().toISOString() })
        .eq("id", invitationId);

      if (error) throw error;

      toast.success("Invitation declined");
      await fetchInvitations();
    } catch (error: any) {
      console.error("Error declining invitation:", error);
      toast.error("Failed to decline invitation");
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }

    try {
      // Create team
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .insert({
          name: newTeamName,
          description: newTeamDescription,
          owner_id: userId,
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Add owner as team member
      const { error: memberError } = await supabase
        .from("team_members")
        .insert({
          team_id: teamData.id,
          user_id: userId,
          role: "owner",
        });

      if (memberError) throw memberError;

      toast.success("Team created successfully!");
      setCreateTeamOpen(false);
      setNewTeamName("");
      setNewTeamDescription("");
      await fetchTeams();
    } catch (error: any) {
      console.error("Error creating team:", error);
      toast.error("Failed to create team");
    }
  };

  const handleMarkNotificationRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true, read_at: new Date().toISOString() })
        .eq("id", notificationId);

      if (error) throw error;

      await fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case "owner":
        return <Crown className="h-4 w-4" />;
      case "admin":
      case "editor":
        return <Edit className="h-4 w-4" />;
      case "commenter":
        return <MessageSquare className="h-4 w-4" />;
      case "viewer":
        return <Eye className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case "owner":
        return "destructive";
      case "admin":
      case "editor":
        return "default";
      case "commenter":
        return "secondary";
      case "viewer":
        return "outline";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Teams & Collaboration</h1>
          <p className="text-muted-foreground mt-2">
            Manage your teams, invitations, and shared documents
          </p>
        </div>
        <div className="flex items-center gap-4">
          {unreadCount > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Bell className="h-3 w-3" />
              {unreadCount} new
            </Badge>
          )}
          <Dialog open={createTeamOpen} onOpenChange={setCreateTeamOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
                <DialogDescription>
                  Create a team to collaborate with others on multiple projects
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input
                    id="team-name"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="e.g., My Game Studio"
                  />
                </div>
                <div>
                  <Label htmlFor="team-description">
                    Description (Optional)
                  </Label>
                  <Input
                    id="team-description"
                    value={newTeamDescription}
                    onChange={(e) => setNewTeamDescription(e.target.value)}
                    placeholder="What's your team about?"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setCreateTeamOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateTeam}>Create Team</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Pending Invitations Alert */}
      {pendingInvitations.length > 0 && (
        <Card className="mb-6 border-yellow-500/50 bg-yellow-50/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-yellow-500" />
              You have {pendingInvitations.length} pending invitation
              {pendingInvitations.length > 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingInvitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center justify-between p-4 bg-background rounded-lg border"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {invitation.user?.name || invitation.inviter_id}
                    </span>
                    <span className="text-muted-foreground">
                      invited you to
                    </span>
                    <span className="font-medium">
                      {invitation.documents?.title ||
                        invitation.teams?.name ||
                        invitation.games?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <Badge variant={getPermissionColor(invitation.permission)}>
                      {getPermissionIcon(invitation.permission)}
                      <span className="ml-1">{invitation.permission}</span>
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(invitation.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  {invitation.message && (
                    <p className="mt-2 text-sm text-muted-foreground italic">
                      &quot;{invitation.message}&quot;
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeclineInvitation(invitation.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAcceptInvitation(invitation)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="teams">My Teams</TabsTrigger>
          <TabsTrigger value="shared">Shared Documents</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="invitations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sent Invitations</CardTitle>
              <CardDescription>
                Track invitations you&apos;ve sent to collaborate
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sentInvitations.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No invitations sent yet
                </p>
              ) : (
                <div className="space-y-3">
                  {sentInvitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {invitation.invitee_email}
                          </span>
                          <Badge
                            variant={getPermissionColor(invitation.permission)}
                          >
                            {invitation.permission}
                          </Badge>
                          <Badge
                            variant={
                              invitation.status === "accepted"
                                ? "default"
                                : invitation.status === "declined"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {invitation.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          For:{" "}
                          {invitation.documents?.title ||
                            invitation.teams?.name ||
                            invitation.games?.name}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(invitation.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
          {myTeams.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No teams yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create a team to collaborate with others on multiple projects
                </p>
                <Button onClick={() => setCreateTeamOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Team
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {myTeams.map((team) => (
                <Card key={team.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{team.name}</CardTitle>
                        {team.description && (
                          <CardDescription>{team.description}</CardDescription>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-3">
                          Team Members
                        </h4>
                        <div className="grid gap-2">
                          {team.team_members?.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={member.user?.image} />
                                  <AvatarFallback>
                                    {member.user?.name?.charAt(0) || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">
                                    {member.user?.name || "Unknown User"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {member.user?.email}
                                  </p>
                                </div>
                              </div>
                              <Badge variant={getPermissionColor(member.role)}>
                                {member.role}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite Members
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="shared" className="space-y-6">
          {sharedDocuments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  No shared documents
                </h3>
                <p className="text-muted-foreground">
                  Documents shared with you will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {sharedDocuments.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <h3 className="font-medium">{doc.title}</h3>
                          <Badge variant={getPermissionColor(doc.permission)}>
                            {getPermissionIcon(doc.permission)}
                            <span className="ml-1">{doc.permission}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Gamepad className="h-3 w-3" />
                            {doc.games?.name || "Unknown Game"}
                          </span>
                          <span>
                            Shared by {doc.added_by_user?.name || "Unknown"}
                          </span>
                          <span>
                            {formatDistanceToNow(new Date(doc.added_at), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/games/${doc.game_id}`}>Open</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Stay updated on team activities</CardDescription>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No notifications yet
                </p>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        !notification.read ? "bg-muted/50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <span className="text-xs text-muted-foreground mt-2 block">
                            {formatDistanceToNow(
                              new Date(notification.created_at),
                              { addSuffix: true },
                            )}
                          </span>
                        </div>
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleMarkNotificationRead(notification.id)
                            }
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

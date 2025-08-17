"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/database/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Check,
  X,
  Clock,
  FileText,
  Users,
  Gamepad,
  Crown,
  Edit,
  MessageSquare,
  Eye,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/providers/user-context";

interface InvitationDetails {
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
  documents?: {
    id: string;
    title: string;
    game_id: string;
    games?: {
      name: string;
      image_url: string;
    };
  };
  teams?: {
    id: string;
    name: string;
    description: string;
  };
  games?: {
    id: string;
    name: string;
    image_url: string;
    concept: string;
  };
  user?: {
    name: string;
    email: string;
    image: string;
  };
}

export default function InvitePage() {
  const router = useRouter();
  const { token } = useParams<{ token: string }>();
  const { userId, user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLoading) {
      fetchInvitation();
    }
  }, [token, userLoading]);

  const fetchInvitation = async () => {
    try {
      const { data, error } = await supabase
        .from("invitations")
        .select(
          `
          *,
          documents(
            id,
            title,
            game_id,
            games(name, image_url)
          ),
          teams(id, name, description),
          games(id, name, image_url, concept),
          user:inviter_id(name, email, image)
        `,
        )
        .eq("token", token)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          setError("This invitation link is invalid or has expired.");
        } else {
          throw error;
        }
        return;
      }

      if (data.status !== "pending") {
        setError(`This invitation has already been ${data.status}.`);
        return;
      }

      const expiresAt = new Date(data.expires_at);
      if (expiresAt < new Date()) {
        setError("This invitation has expired.");
        // Update status in database
        await supabase
          .from("invitations")
          .update({ status: "expired" })
          .eq("id", data.id);
        return;
      }

      setInvitation(data);
    } catch (err: any) {
      console.error("Error fetching invitation:", err);
      setError("Failed to load invitation details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!invitation) return;

    if (!userId) {
      // Store the invitation token and redirect to login
      localStorage.setItem("pending_invitation", token);
      router.push("/login");
      return;
    }

    // Check if the logged-in user's email matches the invitation
    if (invitation.invitee_email && user?.email !== invitation.invitee_email) {
      toast.error("This invitation was sent to a different email address.");
      return;
    }

    setProcessing(true);
    try {
      const { error } = await supabase.rpc("accept_invitation", {
        p_invitation_id: invitation.id,
        p_user_id: userId,
      });

      if (error) throw error;

      toast.success("Invitation accepted successfully!");

      // Redirect to the appropriate page
      if (invitation.document_id && invitation.documents) {
        router.push(`/games/${invitation.documents.game_id}`);
      } else if (invitation.team_id) {
        router.push("/teams");
      } else if (invitation.game_id) {
        router.push(`/games/${invitation.game_id}`);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Error accepting invitation:", err);
      toast.error(err.message || "Failed to accept invitation");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeclineInvitation = async () => {
    if (!invitation) return;

    setProcessing(true);
    try {
      const { error } = await supabase
        .from("invitations")
        .update({
          status: "declined",
          responded_at: new Date().toISOString(),
        })
        .eq("id", invitation.id);

      if (error) throw error;

      toast.success("Invitation declined");
      router.push("/");
    } catch (err: any) {
      console.error("Error declining invitation:", err);
      toast.error("Failed to decline invitation");
    } finally {
      setProcessing(false);
    }
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case "owner":
        return <Crown className="h-5 w-5" />;
      case "admin":
      case "editor":
        return <Edit className="h-5 w-5" />;
      case "commenter":
        return <MessageSquare className="h-5 w-5" />;
      case "viewer":
        return <Eye className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getPermissionDescription = (permission: string) => {
    switch (permission) {
      case "owner":
        return "Full access including deletion";
      case "admin":
        return "Can manage team and projects";
      case "editor":
        return "Can edit content";
      case "commenter":
        return "Can view and add comments";
      case "viewer":
        return "Can view only";
      default:
        return "";
    }
  };

  if (loading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-red-600">Invalid Invitation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => router.push("/")} className="w-full">
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invitation) {
    return null;
  }

  const invitationType = invitation.document_id
    ? "document"
    : invitation.team_id
      ? "team"
      : "game";

  // const invitationTarget =
  //   invitationType === "document"
  //     ? invitation.documents
  //     : invitationType === "team"
  //       ? invitation.teams
  //       : invitation.games;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {invitationType === "document" ? (
              <FileText className="h-12 w-12 text-primary" />
            ) : invitationType === "team" ? (
              <Users className="h-12 w-12 text-primary" />
            ) : (
              <Gamepad className="h-12 w-12 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl">
            You&apos;re invited to collaborate!
          </CardTitle>
          <CardDescription>
            {invitation.user?.name || "Someone"} has invited you to join
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Invitation Details */}
          <div className="bg-muted rounded-lg p-4 space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {invitationType === "document"
                  ? "Document"
                  : invitationType === "team"
                    ? "Team"
                    : "Game"}
              </p>
              <p className="font-semibold text-lg">
                {invitationType === "document"
                  ? invitation.documents?.title
                  : invitationType === "team"
                    ? invitation.teams?.name
                    : invitation.games?.name}
              </p>
              {invitationType === "document" && invitation.documents?.games && (
                <p className="text-sm text-muted-foreground mt-1">
                  Game: {invitation.documents.games.name}
                </p>
              )}
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Your role</p>
              <Badge className="gap-1" variant="secondary">
                {getPermissionIcon(invitation.permission)}
                <span className="capitalize">{invitation.permission}</span>
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {getPermissionDescription(invitation.permission)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Invited by</p>
              <p className="font-medium">
                {invitation.user?.name || "Unknown User"}
              </p>
              <p className="text-sm text-muted-foreground">
                {invitation.user?.email}
              </p>
            </div>

            {invitation.message && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Message</p>
                <p className="text-sm italic">
                  &quot;{invitation.message}&quot;
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                Expires{" "}
                {formatDistanceToNow(new Date(invitation.expires_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {!userId ? (
            <div className="space-y-3">
              <Button
                onClick={() => {
                  localStorage.setItem("pending_invitation", token);
                  router.push("/login");
                }}
                className="w-full"
                size="lg"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign in to Accept
              </Button>
              <Button
                onClick={() => {
                  localStorage.setItem("pending_invitation", token);
                  router.push("/signup");
                }}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create Account
              </Button>
              <Button
                onClick={handleDeclineInvitation}
                variant="ghost"
                className="w-full"
                disabled={processing}
              >
                Decline Invitation
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                onClick={handleDeclineInvitation}
                variant="outline"
                className="flex-1"
                disabled={processing}
              >
                <X className="h-4 w-4 mr-2" />
                Decline
              </Button>
              <Button
                onClick={handleAcceptInvitation}
                className="flex-1"
                disabled={processing}
              >
                <Check className="h-4 w-4 mr-2" />
                Accept
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { supabase } from "@/database/supabase";

export interface CollaborationPermission {
  canView: boolean;
  canComment: boolean;
  canEdit: boolean;
  canShare: boolean;
  canDelete: boolean;
}

export class CollaborationService {
  /**
   * Check if a user has access to a document
   */
  static async checkDocumentAccess(
    userId: string,
    documentId: string,
    requiredPermission: "viewer" | "commenter" | "editor" | "owner" = "viewer",
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc("has_document_access", {
        p_user_id: userId,
        p_document_id: documentId,
        p_required_permission: requiredPermission,
      });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error("Error checking document access:", error);
      return false;
    }
  }

  /**
   * Get permission level for a user on a document
   */
  static async getDocumentPermission(
    userId: string,
    documentId: string,
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from("user_accessible_documents")
        .select("permission")
        .eq("accessor_id", userId)
        .eq("id", documentId)
        .single();

      if (error) throw error;
      return data?.permission || null;
    } catch (error) {
      console.error("Error getting document permission:", error);
      return null;
    }
  }

  /**
   * Parse permission string to permission object
   */
  static parsePermission(permission: string | null): CollaborationPermission {
    switch (permission) {
      case "owner":
        return {
          canView: true,
          canComment: true,
          canEdit: true,
          canShare: true,
          canDelete: true,
        };
      case "editor":
        return {
          canView: true,
          canComment: true,
          canEdit: true,
          canShare: false,
          canDelete: false,
        };
      case "commenter":
        return {
          canView: true,
          canComment: true,
          canEdit: false,
          canShare: false,
          canDelete: false,
        };
      case "viewer":
        return {
          canView: true,
          canComment: false,
          canEdit: false,
          canShare: false,
          canDelete: false,
        };
      default:
        return {
          canView: false,
          canComment: false,
          canEdit: false,
          canShare: false,
          canDelete: false,
        };
    }
  }

  /**
   * Send document invitation
   */
  static async sendDocumentInvitation(
    documentId: string,
    inviterId: string,
    inviteeEmail: string,
    permission: "viewer" | "commenter" | "editor",
    message?: string,
    canShare: boolean = false,
  ) {
    try {
      const { data, error } = await supabase.rpc("send_document_invitation", {
        p_document_id: documentId,
        p_inviter_id: inviterId,
        p_invitee_email: inviteeEmail,
        p_permission: permission,
        p_message: message || null,
      });

      if (error) throw error;

      // If permission is editor and canShare is true, update the flag
      if (permission === "editor" && canShare) {
        const { error: updateError } = await supabase
          .from("invitations")
          .update({
            data: { can_share: true },
          })
          .eq("id", data);

        if (updateError) {
          console.error("Error updating can_share flag:", updateError);
        }
      }

      return { success: true, invitationId: data };
    } catch (error: any) {
      console.error("Error sending invitation:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create a team
   */
  static async createTeam(name: string, description: string, ownerId: string) {
    try {
      // Create team
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .insert({
          name,
          description,
          owner_id: ownerId,
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Add owner as team member
      const { error: memberError } = await supabase
        .from("team_members")
        .insert({
          team_id: teamData.id,
          user_id: ownerId,
          role: "owner",
        });

      if (memberError) throw memberError;

      return { success: true, team: teamData };
    } catch (error: any) {
      console.error("Error creating team:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Add team member
   */
  static async addTeamMember(
    teamId: string,
    userEmail: string,
    role: "admin" | "editor" | "viewer",
    invitedBy: string,
  ) {
    try {
      // Check if user exists
      const { data: userData, error: userError } = await supabase
        .from("user")
        .select("id")
        .eq("email", userEmail)
        .single();

      if (userError || !userData) {
        // User doesn't exist, send invitation
        const { data: inviteData, error: inviteError } = await supabase
          .from("invitations")
          .insert({
            team_id: teamId,
            inviter_id: invitedBy,
            invitee_email: userEmail,
            permission: role,
          })
          .select()
          .single();

        if (inviteError) throw inviteError;
        return { success: true, invitation: inviteData };
      }

      // User exists, add as team member
      const { data: memberData, error: memberError } = await supabase
        .from("team_members")
        .insert({
          team_id: teamId,
          user_id: userData.id,
          role,
          invited_by: invitedBy,
        })
        .select()
        .single();

      if (memberError) throw memberError;

      // Send notification
      await supabase.from("notifications").insert({
        user_id: userData.id,
        type: "team_added",
        title: "Added to Team",
        message: "You have been added to a new team",
        data: { team_id: teamId },
      });

      return { success: true, member: memberData };
    } catch (error: any) {
      console.error("Error adding team member:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Log activity
   */
  static async logActivity(
    userId: string,
    action: string,
    details: any,
    documentId?: string,
    gameId?: string,
    teamId?: string,
  ) {
    try {
      const { error } = await supabase.from("activity_log").insert({
        user_id: userId,
        action,
        details,
        document_id: documentId,
        game_id: gameId,
        team_id: teamId,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  }

  /**
   * Add comment to document section
   */
  static async addComment(
    sectionId: string,
    userId: string,
    content: string,
    parentCommentId?: string,
    position?: { start: number; end: number },
  ) {
    try {
      const { data, error } = await supabase
        .from("comments")
        .insert({
          document_section_id: sectionId,
          user_id: userId,
          content,
          parent_comment_id: parentCommentId,
          position: position || null,
        })
        .select(
          `
          *,
          user:user_id(name, email, image)
        `,
        )
        .single();

      if (error) throw error;
      return { success: true, comment: data };
    } catch (error: any) {
      console.error("Error adding comment:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get comments for a document section
   */
  static async getSectionComments(sectionId: string) {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(
          `
          *,
          user:user_id(name, email, image),
          replies:comments(
            *,
            user:user_id(name, email, image)
          )
        `,
        )
        .eq("document_section_id", sectionId)
        .is("parent_comment_id", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { success: true, comments: data };
    } catch (error: any) {
      console.error("Error fetching comments:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mark notification as read
   */
  static async markNotificationRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({
          read: true,
          read_at: new Date().toISOString(),
        })
        .eq("id", notificationId);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error("Error marking notification as read:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user's unread notification count
   */
  static async getUnreadNotificationCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("read", false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error("Error getting notification count:", error);
      return 0;
    }
  }
}

import {
  hasDocumentAccess as checkAccess,
  sendDocumentInvitation as sendInvitation,
  createTeam as createTeamData,
  createNotification,
  markNotificationRead as markRead,
  getUnreadNotificationCount as getUnreadCount,
  getSectionComments as getComments,
  createComment as addCommentData,
  logActivity as logActivityData,
} from "@/lib/data/collaboration";
import { db, schema } from "@/database/drizzle";
import { eq } from "drizzle-orm";

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
    requiredPermission: "viewer" | "commenter" | "editor" | "owner" = "viewer"
  ): Promise<boolean> {
    try {
      return await checkAccess(userId, documentId, requiredPermission);
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
    documentId: string
  ): Promise<string | null> {
    try {
      // Check if user owns the document
      const document = await db.query.documents.findFirst({
        where: eq(schema.documents.id, documentId),
      });

      if (document?.userId === userId) {
        return "owner";
      }

      // Check collaborator permission
      const collaborator = await db.query.documentCollaborators.findFirst({
        where: (cols, { and, eq }) =>
          and(eq(cols.documentId, documentId), eq(cols.userId, userId)),
      });

      return collaborator?.permission || null;
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
    canShare: boolean = false
  ) {
    try {
      const token = await sendInvitation(
        documentId,
        inviterId,
        inviteeEmail,
        permission,
        message,
        canShare
      );

      return { success: true, invitationId: token };
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
      const team = await createTeamData(name, description, ownerId);
      return { success: true, team };
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
    invitedBy: string
  ) {
    try {
      // Check if user exists
      const user = await db.query.user.findFirst({
        where: eq(schema.user.email, userEmail),
      });

      if (!user) {
        // User doesn't exist, send invitation
        const [invitation] = await db
          .insert(schema.invitations)
          .values({
            teamId,
            inviterId: invitedBy,
            inviteeEmail: userEmail,
            permission: role,
          })
          .returning();

        return { success: true, invitation };
      }

      // User exists, add as team member
      const [member] = await db
        .insert(schema.teamMembers)
        .values({
          teamId,
          userId: user.id,
          role,
          invitedBy,
        })
        .returning();

      // Send notification
      await createNotification({
        userId: user.id,
        type: "team_added",
        title: "Added to Team",
        message: "You have been added to a new team",
        data: { teamId },
      });

      return { success: true, member };
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
    teamId?: string
  ) {
    try {
      await logActivityData({
        userId,
        action,
        details,
        documentId,
        gameId,
        teamId,
      });
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
    position?: { start: number; end: number }
  ) {
    try {
      const comment = await addCommentData({
        documentSectionId: sectionId,
        userId,
        content,
        parentCommentId,
        position,
      });

      // Fetch the comment with user info
      const commentWithUser = await db.query.comments.findFirst({
        where: eq(schema.comments.id, comment.id),
        with: {
          user: true,
        },
      });

      return { success: true, comment: commentWithUser };
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
      const comments = await getComments(sectionId);
      return { success: true, comments };
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
      await markRead(notificationId);
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
      return await getUnreadCount(userId);
    } catch (error) {
      console.error("Error getting notification count:", error);
      return 0;
    }
  }
}

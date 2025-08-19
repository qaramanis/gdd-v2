"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  FileText,
  Gamepad2,
  Play,
  Settings,
  Users,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Download,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/progress";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/date-utils";
import Image from "next/image";
import GameScenesList from "./game-scenes-list";
import { useUser } from "@/providers/user-context";
import { formatDistanceToNow } from "date-fns";
import { ShareDocumentDialog } from "../collaboration/share-document-dialog";

interface GameDetailViewProps {
  game: any;
  document: any;
  sections: any[];
}

export default function GameDetailView({
  game,
  document,
  sections,
}: GameDetailViewProps) {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const { userId } = useUser();

  if (!document) {
    console.error(
      "Document is null - this should not happen with database triggers",
    );
    return (
      <div className="game-detail-view error">
        <div className="alert alert-error">
          <h3>System Error</h3>
          <p>Game document is missing</p>
        </div>
      </div>
    );
  }

  // Calculate document progress
  const totalSections = sections.length;
  const completedSections = sections.filter(
    (s) => s.content && s.content.length > 50,
  ).length;
  const documentProgress =
    totalSections > 0 ? (completedSections / totalSections) * 100 : 0;

  // Calculate days since start
  const daysSinceStart = game.start_date
    ? Math.floor(
        (new Date().getTime() - new Date(game.start_date).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/games")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Games
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Star className="h-4 w-4" />
            Star
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/games/${game.id}/edit`)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/games/${game.id}/settings`)}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Game Info Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
          {game.image_url && game.image_url !== "/game-placeholder.jpg" ? (
            <Image
              width={128}
              height={128}
              src={game.image_url}
              alt={game.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Gamepad2 className="h-12 w-12 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{game.name}</h1>
          <p className="text-muted-foreground mb-4">
            {game.concept || "No concept description provided"}
          </p>
          <div className="flex flex-wrap gap-2">
            {game.platforms?.map((platform: string) => (
              <Badge key={platform} variant="secondary">
                {platform.toUpperCase()}
              </Badge>
            ))}
            {game.sections?.map((section: string) => (
              <Badge key={section} variant="outline">
                {section}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Project Status
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              {daysSinceStart} days in development
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Document Progress
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(documentProgress)}%
            </div>
            <Progress value={documentProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {completedSections}/{totalSections} sections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{game.timeline}</div>
            <p className="text-xs text-muted-foreground">
              Started {game.start_date ? formatDate(game.start_date) : "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(game.updated_at).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(game.updated_at).toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="w-full flex flex-row bg-gray-100 border-black border-1 gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="document">Document</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="scenes">Scenes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Document Overview */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">
                        {document.title}
                      </CardTitle>
                      <CardDescription>
                        Created{" "}
                        {formatDistanceToNow(new Date(document.created_at), {
                          addSuffix: true,
                        })}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <ShareDocumentDialog
                        documentId={document.id}
                        documentTitle={document.title}
                        userId={userId as string}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/editor/${document.id}`)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Document
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {document ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Overall Progress
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(documentProgress)}%
                        </span>
                      </div>
                      <Progress value={documentProgress} />

                      <Separator />

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Recent Sections</h4>
                        {sections.slice(0, 3).map((section) => (
                          <div
                            key={section.id}
                            className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                            onClick={() =>
                              router.push(
                                `/games/${game.id}/document#${section.id}`,
                              )
                            }
                          >
                            <span className="text-sm">{section.title}</span>
                            {section.content && section.content.length > 50 ? (
                              <Badge variant="secondary" className="text-xs">
                                Complete
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                In Progress
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        No document created yet
                      </p>
                      <Button
                        onClick={() =>
                          router.push(`/games/${game.id}/document/new`)
                        }
                      >
                        Create Document
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Unity Scene Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Unity Scene Preview</span>
                    <Button
                      size="sm"
                      onClick={() => router.push(`/playground?game=${game.id}`)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Open in Playground
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative h-64 bg-black rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Play className="h-12 w-12 text-white mb-4 mx-auto" />
                        <p className="text-white mb-2">Main Game Scene</p>
                        <p className="text-white/60 text-sm">
                          Click to view in playground
                        </p>
                      </div>
                    </div>
                    {/* Placeholder for actual Unity WebGL content */}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Badge className="bg-blue-500">Unity</Badge>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => router.push(`/playground?game=${game.id}`)}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Play
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Fullscreen
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Notes & Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Notes & Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Document Update Needed
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Gameplay mechanics section needs review
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Milestone Complete</p>
                      <p className="text-xs text-muted-foreground">
                        Core mechanics implemented
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <Button variant="outline" size="sm" className="w-full">
                    View All Notes
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => router.push(`/games/${game.id}/document`)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Edit Document
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => router.push(`/playground?game=${game.id}`)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Open Playground
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => router.push(`/games/${game.id}/team`)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Team
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => router.push(`/games/${game.id}/export`)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Game
                  </Button>
                </CardContent>
              </Card>

              {/* Development Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Development Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span>{formatDate(game.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Modified</span>
                    <span>{formatDate(game.updated_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Project ID</span>
                    <span className="font-mono text-xs">{game.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="document" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Document editing interface will be displayed here.
              </p>
              <Button
                className="mt-4"
                onClick={() => router.push(`/games/${game.id}/document`)}
              >
                Open Document Editor
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Game Scenes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Unity and Unreal Engine scenes will be displayed here.
              </p>
              <Button
                className="mt-4"
                onClick={() => router.push(`/playground?game=${game.id}`)}
              >
                Open Playground
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Team management interface will be displayed here.
              </p>
              <Button
                className="mt-4"
                onClick={() => router.push(`/games/${game.id}/team`)}
              >
                Manage Team
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenes" className="space-y-4">
          <GameScenesList
            gameId={params.id as string}
            userId={userId as string}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

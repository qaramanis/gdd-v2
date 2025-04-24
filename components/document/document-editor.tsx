import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  LexicalComposer,
  InitialConfigType,
} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

interface DocumentEditorProps {
  documentId: string;
  sectionId?: string;
  initialContent: string;
  documentTitle: string;
  sectionTitle?: string;
  onSave?: (content: string) => Promise<void>;
  readOnly?: boolean;
}

export default function DocumentEditor({
  initialContent = "",
  documentTitle,
  sectionTitle,
  onSave,
  readOnly = false,
}: DocumentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const router = useRouter();

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    try {
      await onSave(content);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Error saving document:", error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const autoSaveInterval = setTimeout(() => {
      if (content !== initialContent && !saving && onSave) {
        handleSave();
      }
    }, 30000);
    return () => clearTimeout(autoSaveInterval);
  }, [content, initialContent, saving]);

  const editorConfig: InitialConfigType = {
    namespace: "DocumentEditor",
    theme: {},
    onError: (error) => {
      throw error;
    },
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (
                content !== initialContent &&
                !confirm(
                  "You have unsaved changes. Are you sure you want to leave?"
                )
              ) {
                return;
              }
              router.back();
            }}
            className="gap-1"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{documentTitle}</h1>
            {sectionTitle && (
              <p className="text-sm text-muted-foreground">{sectionTitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {lastSaved && (
            <span className="text-xs text-muted-foreground">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <Button
            onClick={handleSave}
            disabled={saving || content === initialContent || readOnly}
            size="sm"
          >
            <Save className="size-4 mr-1" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 max-w-6xl mx-auto rounded-lg shadow p-4 min-h-screen">
          <LexicalComposer initialConfig={editorConfig}>
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="h-[calc(100vh-200px)] outline-none p-4" />
              }
              placeholder={
                <div className="text-muted-foreground">
                  Start writing your document...
                </div>
              }
              ErrorBoundary={(props) => (
                <div className="text-red-500">
                  Editor error: {props.onError.toString()}
                </div>
              )}
            />
            <HistoryPlugin />
            <OnChangePlugin
              onChange={(editorState) => {
                editorState.read(() => {
                  const content = editorState.toJSON();
                  setContent(JSON.stringify(content));
                });
              }}
            />
          </LexicalComposer>
        </div>
      </div>
    </div>
  );
}

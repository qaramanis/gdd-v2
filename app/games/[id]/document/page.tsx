"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DocumentEditor from "@/components/document/document-editor";
import SectionNavigator, {
  Section,
} from "@/components/document/section-navigatior";
import { supabase } from "@/database/supabase";

export default function FullDocumentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [game, setGame] = useState<any>(null);
  const [document, setDocument] = useState<any>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sectionContent, setSectionContent] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        if (!params.id) {
          throw new Error("Game ID is missing");
        }

        setLoading(true);

        // Fetch game data
        const { data: gameData, error: gameError } = await supabase
          .from("games")
          .select("*")
          .eq("id", params.id)
          .single();

        if (gameError) throw gameError;
        if (!gameData) throw new Error("Game not found");

        setGame(gameData);

        const { data: documentData, error: documentError } = await supabase
          .from("documents")
          .select("*")
          .eq("game_id", params.id)
          .single();

        if (documentError) throw documentError;
        if (!documentData) throw new Error("Document not found");

        setDocument(documentData);

        const { data: sectionsData, error: sectionsError } = await supabase
          .from("document_sections")
          .select("*")
          .eq("document_id", documentData.id)
          .order("order", { ascending: true });

        if (sectionsError) throw sectionsError;

        const formattedSections = sectionsData.map((section) => ({
          id: section.id,
          title: section.title,
          content: section.content || "",
          order: section.order,
        }));

        setSections(formattedSections);

        if (formattedSections.length > 0) {
          setActiveSection(formattedSections[0].id);
          setSectionContent(formattedSections[0].content || "");
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  const handleSelectSection = (sectionId: string) => {
    // Find the section in our sections array
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      setActiveSection(sectionId);
      setSectionContent(section.content || "");
    }
  };

  const handleSaveContent = async (content: string) => {
    if (!activeSection || !document) return;

    try {
      // Update the section content in the database
      const { error } = await supabase
        .from("document_sections")
        .update({ content })
        .eq("id", activeSection);

      if (error) throw error;

      // Update the local state
      setSections((prev) =>
        prev.map((section) =>
          section.id === activeSection ? { ...section, content } : section
        )
      );

      return Promise.resolve();
    } catch (error) {
      console.error("Error saving section content:", error);
      return Promise.reject(error);
    }
  };

  const handleAddSection = async (parentId?: string) => {
    if (!document) return;

    try {
      // Calculate the next order value
      const nextOrder =
        sections.length > 0
          ? Math.max(...sections.map((s) => s.order || 0)) + 1
          : 0;

      // Create a new section
      const { data, error } = await supabase
        .from("document_sections")
        .insert({
          document_id: document.id,
          title: "New Section",
          order: nextOrder,
          content: "",
        })
        .select()
        .single();

      if (error) throw error;

      // Add the new section to our state and select it
      const newSection = {
        id: data.id,
        title: data.title,
        content: data.content || "",
        order: data.order,
      };

      setSections([...sections, newSection]);
      setActiveSection(data.id);
      setSectionContent("");
    } catch (error) {
      console.error("Error adding section:", error);
    }
  };

  const handleEditSectionTitle = async (section: Section) => {
    const newTitle = prompt("Enter new section title:", section.title);
    if (!newTitle || newTitle === section.title) return;

    try {
      // Update the section title in the database
      const { error } = await supabase
        .from("document_sections")
        .update({ title: newTitle })
        .eq("id", section.id);

      if (error) throw error;

      // Update the local state
      setSections((prev) =>
        prev.map((s) => (s.id === section.id ? { ...s, title: newTitle } : s))
      );
    } catch (error) {
      console.error("Error updating section title:", error);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      // Delete the section from the database
      const { error } = await supabase
        .from("document_sections")
        .delete()
        .eq("id", sectionId);

      if (error) throw error;

      // Remove from local state
      const newSections = sections.filter((s) => s.id !== sectionId);
      setSections(newSections);

      // If this was the active section, select another one
      if (activeSection === sectionId) {
        if (newSections.length > 0) {
          setActiveSection(newSections[0].id);
          setSectionContent(newSections[0].content || "");
        } else {
          setActiveSection(null);
          setSectionContent("");
        }
      }
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (error || !game || !document) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-semibold mb-2">Error Loading Document</h2>
        <p className="text-muted-foreground mb-4">
          {error || "Document not found"}
        </p>
        <button
          onClick={() => router.push(`/games/${params.id}`)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
        >
          Back to Game
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <SectionNavigator
        sections={sections}
        activeSection={activeSection || undefined}
        onSelectSection={handleSelectSection}
        onAddSection={handleAddSection}
        onEditSectionTitle={handleEditSectionTitle}
        onDeleteSection={handleDeleteSection}
        isEditable={true}
      />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {activeSection ? (
          <DocumentEditor
            documentId={document.id}
            sectionId={activeSection}
            initialContent={sectionContent}
            documentTitle={game.name}
            sectionTitle={sections.find((s) => s.id === activeSection)?.title}
            onSave={handleSaveContent}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">
              Select a section to edit or add a new section
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { X, Upload, Save, Loader2, Edit2, Images } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/database/supabase";
import Image from "next/image";

// TypeScript interfaces
interface Game {
  id: string | number;
  name: string;
  concept?: string;
  image_url?: string;
  [key: string]: any;
}

interface EditGameModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedGame: Game) => Promise<void>;
  userId: string;
}
interface FormData {
  name: string;
  concept: string;
  image_url: string;
}

interface Errors {
  [key: string]: string;
}

const EditGameModal: React.FC<EditGameModalProps> = ({
  game,
  isOpen,
  onClose,
  onSave,
  userId,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    concept: "",
    image_url: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (game && isOpen) {
      setFormData({
        name: game.name || "",
        concept: game.concept || "",
        image_url: game.image_url || "",
      });
      setImagePreview(game.image_url || "");
      setErrors({});
    }
  }, [game, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size should be less than 5MB",
        }));
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setErrors((prev) => ({
          ...prev,
          image: "",
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Game title is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Game title must be less than 100 characters";
    }

    if (formData.concept && formData.concept.length > 1000) {
      newErrors.concept = "Description must be less than 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !game) {
      return;
    }

    setIsLoading(true);

    try {
      // If custom save handler is provided, use it
      if (onSave) {
        await onSave({
          ...game,
          ...formData,
        });
        onClose();
        return;
      }

      // Otherwise, use default Supabase update logic
      let finalImageUrl = formData.image_url || game.image_url;

      // Upload image to Supabase Storage if a new file was selected
      if (imageFile) {
        try {
          // Delete old image if it exists in storage
          if (game.image_url && game.image_url.includes("supabase")) {
            const oldImagePath = game.image_url.split("/").pop();
            if (oldImagePath) {
              await supabase.storage
                .from("game-images")
                .remove([`${userId}/${oldImagePath}`]);
            }
          }

          // Upload new image
          const fileExt = imageFile.name.split(".").pop();
          const fileName = `${game.id}-${Date.now()}.${fileExt}`;
          const filePath = `${userId}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("game-images")
            .upload(filePath, imageFile, {
              cacheControl: "3600",
              upsert: true,
            });

          if (uploadError) throw uploadError;

          // Get public URL for the uploaded image
          const {
            data: { publicUrl },
          } = supabase.storage.from("game-images").getPublicUrl(filePath);

          finalImageUrl = publicUrl;
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          setErrors({
            image:
              "Failed to upload image. Changes will be saved without image update.",
          });
          // Continue with update even if image upload fails
        }
      }

      // Update game in database
      const { error: updateError } = await supabase
        .from("games")
        .update({
          name: formData.name.trim(),
          concept: formData.concept.trim(),
          image_url: finalImageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", game.id)
        .eq("user_id", userId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Success - close modal
      onClose();

      // Show success message
      toast.success("Game information updated successfully!");
    } catch (error: any) {
      console.error("Update error:", error);
      setErrors({
        submit: error.message || "Failed to save changes. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !game) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Edit2 className="w-5 h-5" />
              Edit Game Information
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              disabled={isLoading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content - No form element */}
          <div className="p-6 space-y-6">
            {/* Game Title */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Game Title *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter game title"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Game Description */}
            <div>
              <label
                htmlFor="concept"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Description
              </label>
              <textarea
                id="concept"
                name="concept"
                value={formData.concept}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors resize-none ${
                  errors.concept ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter game description or concept"
                disabled={isLoading}
              />
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {formData.concept.length}/1000 characters
              </div>
              {errors.concept && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.concept}
                </p>
              )}
            </div>

            {/* Game Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Game Image
              </label>
              <div className="flex items-start gap-4">
                {/* Image Preview */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-lg border-2 border-gray-300 dark:border-gray-600 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Game preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Images className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Button */}
                <div className="flex-1">
                  <label
                    htmlFor="image-upload"
                    className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF up to 5MB
                  </p>
                  {errors.image && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.image}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Error message */}
            {errors.submit && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.submit}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditGameModal;

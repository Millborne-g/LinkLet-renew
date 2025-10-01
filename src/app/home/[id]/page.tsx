"use client";

import Button from "@/components/Button";
import ExternalUrl from "@/components/ExternalUrl";
import Modal from "@/components/Modal";
import {
    Add,
    ArrowLeft,
    ArrowLeft2,
    ArrowRight2,
    ArrowRotateRight,
    ArrowUp,
    ArrowUp2,
    Check,
    CloseCircle,
    Edit,
    Link,
    Link21,
    Magicpen,
    Save2,
    SearchNormal1,
    Share,
    Trash,
    User,
} from "iconsax-reactjs";
import React, { useEffect, useState, useRef } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "@/components/SortableItem";
import TextField from "@/components/TextField";
import { useParams } from "next/navigation";
import axios from "axios";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { decodeToken } from "@/lib/jwt";
import Image from "next/image";
import { useUrlStore } from "@/store/UrlStore";
import { GoogleGenAI } from "@google/genai";
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
import LoadingScreen from "@/components/LoadingScreen";

const Url = () => {
    const router = useRouter();
    const { id } = useParams();
    const ai = new GoogleGenAI({
        apiKey: GEMINI_API_KEY,
    });
    const { accessToken, refreshToken } = useAuthStore();
    const { setUrlPreviewMode, setUrlTemplate } = useUrlStore();
    const [userDetails, setUserDetails] = useState<any>(null);

    const [userAlias, setUserAlias] = useState<{
        name: string;
        image: string;
        imageFile: File | null;
    } | null>(null);

    const [userAliasOnEdit, setUserAliasOnEdit] = useState<{
        name: string;
        image: string;
        imageFile: File | null;
    } | null>(null);

    const [userAliasEdit, setUserAliasEdit] = useState(false);

    const [isFromUser, setIsFromUser] = useState<boolean>(false);

    const [title, setTitle] = useState("");
    const [titleEdit, setTitleEdit] = useState(false);
    const [description, setDescription] = useState("");
    const [descriptionEdit, setDescriptionEdit] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [exploreByAll, setExploreByAll] = useState(false);

    const [addURLModal, setAddURLModal] = useState(false);
    const [editURLModal, setEditURLModal] = useState(false);
    const [newUrlTitle, setNewUrlTitle] = useState("");
    const [newUrl, setNewUrl] = useState("");
    const [newUrlImage, setNewUrlImage] = useState<{
        preview: string;
        file: File;
    } | null>(null);
    const [editUrlImage, setEditUrlImage] = useState<{
        preview: string;
        file: File;
    } | null>(null);
    const [activeId, setActiveId] = useState("");

    const [editMode, setEditMode] = useState(true);

    const [previewMode, setPreviewMode] = useState(false);

    const [onSave, setOnSave] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUrlFound, setIsUrlFound] = useState(false);
    // const [previewMode, setPreviewMode] = useState(false);

    const [externalURLs, setExternalUrls] = useState<any[]>([]);

    // Add state variables to track original values for change detection
    const [originalTitle, setOriginalTitle] = useState("");
    const [originalDescription, setOriginalDescription] = useState("");
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [originalIsPrivate, setOriginalIsPrivate] = useState(false);
    const [originalExploreByAll, setOriginalExploreByAll] = useState(false);
    const [originalExternalURLs, setOriginalExternalURLs] = useState<any[]>([]);
    const [originalTemplate, setOriginalTemplate] = useState<any>(null);
    const [originalUserAlias, setOriginalUserAlias] = useState<any>(null);
    // Dropdown state for title suggestions
    const [showTitleDropdown, setShowTitleDropdown] = useState(false);
    const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
    const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

    // Dropdown state for description suggestions
    const [showDescriptionDropdown, setShowDescriptionDropdown] =
        useState(false);
    const [generatedDescriptions, setGeneratedDescriptions] = useState<
        string[]
    >([]);
    const [isGeneratingDescription, setIsGeneratingDescription] =
        useState(false);

    // Panel puller state menu
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartY, setDragStartY] = useState(0);

    // Panel puller state template
    const [isPanelOpenTemplate, setIsPanelOpenTemplate] = useState(true);
    const [isDraggingTemplate, setIsDraggingTemplate] = useState(false);
    const [dragStartYTemplate, setDragStartYTemplate] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    // Add ref for the scrollable container
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    // Add refs for template items to enable scrolling
    const templateRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // State to track if scroll container is at the top
    const [isAtTop, setIsAtTop] = useState(true);

    const [template, setTemplate] = useState<any>(null);
    const [templatesLoading, setTemplatesLoading] = useState(true);
    const [templates, setTemplates] = useState<any[]>([]);

    // Search state for templates
    const [templateSearchQuery, setTemplateSearchQuery] = useState("");
    const [filteredTemplates, setFilteredTemplates] = useState<any[]>([]);

    // Fetch templates from API
    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                setTemplatesLoading(true);
                const response = await fetch("/api/templates");
                const data = await response.json();

                if (data.success) {
                    setTemplates([
                        ...data.data,
                        // {
                        //     "id": "3-W",
                        //     "name": "Instagram (Web Dark UI)",
                        //     "background": "#181818",
                        //     "text": "#EFEFEF",
                        //     "primary": "#0095F6",
                        //     "secondary": "#555555",
                        //     "accent": "#ED4956"
                        // }
                    ]);
                } else {
                    console.error("Failed to fetch templates:", data.error);
                }
            } catch (error) {
                console.error("Error fetching templates:", error);
            } finally {
                setTemplatesLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    // Filter templates based on search query
    useEffect(() => {
        if (!templateSearchQuery.trim()) {
            setFilteredTemplates(templates);
        } else {
            const filtered = templates.filter((template) =>
                template.name
                    .toLowerCase()
                    .includes(templateSearchQuery.toLowerCase())
            );
            setFilteredTemplates(filtered);
        }
    }, [templateSearchQuery, templates]);

    // Handle scroll events to track if container is at top
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const handleScroll = () => {
            const scrollTop = scrollContainer.scrollTop;
            const scrollHeight = scrollContainer.scrollHeight;
            const clientHeight = scrollContainer.clientHeight;

            setIsAtTop(scrollTop <= 10); // Small threshold for better UX
        };

        scrollContainer.addEventListener("scroll", handleScroll);

        // Initial check
        handleScroll();

        return () => {
            scrollContainer.removeEventListener("scroll", handleScroll);
        };
    }, [filteredTemplates, template]); // Re-run when templates change

    // Function to convert URL to Google favicon service format
    const getFaviconUrl = (url: string): string => {
        try {
            const urlObj = new URL(url);
            const domain = urlObj.hostname;
            return `https://www.google.com/s2/favicons?sz=256&domain=${domain}`;
        } catch (error) {
            // Fallback if URL is invalid
            return "https://www.google.com/s2/favicons?sz=256&domain=google.com";
        }
    };

    // Function to check if there are any changes
    const hasChanges = () => {
        if (id === "create") {
            // For new items, check if any field has content

            return (
                title.trim() !== "" ||
                description.trim() !== "" ||
                image !== null ||
                externalURLs.length > 0 ||
                userAlias !== null
            );
        }

        // For existing items, compare with original values
        const titleChanged = title !== originalTitle;
        const descriptionChanged = description !== originalDescription;
        const imageChanged = image !== originalImage;
        const privacyChanged = isPrivate !== originalIsPrivate;
        const exploreByAllChanged = exploreByAll !== originalExploreByAll;
        const templateChanged = template !== originalTemplate;
        const userAliasChanged =
            JSON.stringify(originalUserAlias) !== JSON.stringify(userAlias);

        // Check if external URLs have changed (length, content, or order)
        const urlsChanged =
            externalURLs.length !== originalExternalURLs.length ||
            externalURLs.some((url, index) => {
                const originalUrl = originalExternalURLs[index];
                return (
                    !originalUrl ||
                    url.title !== originalUrl.title ||
                    url.url !== originalUrl.url ||
                    url.sequence !== originalUrl.sequence ||
                    url.image !== originalUrl.image
                );
            });

        return (
            titleChanged ||
            descriptionChanged ||
            imageChanged ||
            privacyChanged ||
            exploreByAllChanged ||
            templateChanged ||
            userAliasChanged ||
            urlsChanged
        );
    };

    const handleAddURL = async () => {
        if (newUrl.trim()) {
            // Validate if the input is a valid URL
            try {
                new URL(newUrl.trim());
            } catch (error) {
                toast.error("Please enter a valid URL");
                return;
            }

            let newUrlTitleString = "";
            if (newUrlTitle.trim()) {
                newUrlTitleString = newUrlTitle.trim();
            } else {
                newUrlTitleString = (() => {
                    const url = new URL(newUrl.trim());
                    const parts = url.hostname.split(".");
                    // Handle localhost and similar single-part hostnames
                    if (parts.length === 1) {
                        return (
                            parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
                        );
                    }
                    // Handle normal domains
                    const domain = parts.slice(-2, -1)[0];
                    return domain.charAt(0).toUpperCase() + domain.slice(1);
                })();
            }
            let newImageUrl = getFaviconUrl(newUrl.trim()); // Default to favicon

            // If there's a file selected, use its preview URL for display
            if (newUrlImage?.file) {
                newImageUrl = newUrlImage.preview;
            }

            // Store the file reference instead of converting to base64
            const newURLItem = {
                _id: Date.now().toString(),
                title: newUrlTitleString,
                url: newUrl.trim(),
                updatedAt: new Date().toISOString(),
                sequence: externalURLs.length + 1,
                image: newImageUrl,
                imageFile: newUrlImage?.file || null, // Store the file reference
            };

            setExternalUrls((prev) => [...prev, newURLItem]);
            setNewUrlTitle("");
            setNewUrl("");
            setNewUrlImage(null); // Clear the image state
            setAddURLModal(false);
        } else {
            toast.error("Please enter a URL");
        }
    };

    const handleDeleteURL = (id: string) => {
        setExternalUrls((prev) => {
            const filtered = prev.filter((url) => url._id !== id);
            // Update sequence values after deletion
            return filtered.map((url, index) => ({
                ...url,
                sequence: index + 1,
            }));
        });
    };

    const handleEditURL = (id: string) => {
        const urlToEdit = externalURLs.find((url) => url._id === id);
        if (urlToEdit) {
            setNewUrlTitle(urlToEdit.title);
            setNewUrl(urlToEdit.url);
            setEditUrlImage({
                preview: urlToEdit.image || getFaviconUrl(urlToEdit.url),
                file: null as any,
            });
            setActiveId(id);
            setEditURLModal(true);
        }
    };

    const handleUpdateURL = async () => {
        let newUrlTitleString = "";
        if (newUrlTitle.trim()) {
            newUrlTitleString = newUrlTitle.trim();
        } else {
            newUrlTitleString = (() => {
                const url = new URL(newUrl.trim());
                const parts = url.hostname.split(".");
                // Handle localhost and similar single-part hostnames
                if (parts.length === 1) {
                    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
                }
                // Handle normal domains
                const domain = parts.slice(-2, -1)[0];
                return domain.charAt(0).toUpperCase() + domain.slice(1);
            })();
        }

        let newImageUrl = getFaviconUrl(newUrl.trim()); // Default to favicon

        // Handle image updates - store file reference instead of converting to base64
        if (editUrlImage?.file) {
            newImageUrl = editUrlImage.preview; // Use preview for display
        } else if (editUrlImage?.preview && !editUrlImage?.file) {
            // If there's a preview but no file, it means it's the existing image or favicon
            newImageUrl = editUrlImage.preview;
        }

        setExternalUrls((prev) => {
            const updated = prev.map((url) =>
                url._id === activeId
                    ? {
                          ...url,
                          title: newUrlTitleString,
                          url: newUrl,
                          image: newImageUrl,
                          imageFile: editUrlImage?.file || null, // Store the file reference
                      }
                    : url
            );
            return updated;
        });
        setEditURLModal(false);
        setNewUrlTitle("");
        setNewUrl("");
        setEditUrlImage(null); // Clear the image state
        setActiveId("");
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            if (id === "create") {
                if (!title) {
                    toast.error("Please enter a title");
                    return;
                }

                if (externalURLs.length === 0) {
                    toast.error("Please add at least one URL");
                    return;
                }

                setIsSaving(true);

                // Create FormData for file upload
                const formData = new FormData();
                formData.append("title", title);
                formData.append("description", description);

                // Process external URLs and separate files from data
                const externalURLsData = externalURLs.map((url, index) => {
                    const { imageFile, ...urlData } = url;
                    return urlData;
                });
                formData.append(
                    "externalURLs",
                    JSON.stringify(externalURLsData)
                );

                // Append external URL image files separately
                externalURLs.forEach((url, index) => {
                    if (url.imageFile) {
                        formData.append(
                            `externalUrlImage_${index}`,
                            url.imageFile
                        );
                    }
                });

                formData.append("public", (!isPrivate).toString());
                formData.append("exploreByAll", exploreByAll.toString());
                formData.append("template", JSON.stringify(template));
                formData.append("userAlias", JSON.stringify(userAlias));

                // If image is a base64 string, convert it back to a file
                if (image) {
                    formData.append("image", image);
                }

                // If userAlias has an imageFile, append it as userAliasImage
                if (userAlias?.imageFile) {
                    formData.append("userAliasImage", userAlias.imageFile);
                }

                const response = await api.post(`/api/url`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                toast.success("Url saved successfully!");

                // Update original values after successful save
                setOriginalTitle(title);
                setOriginalDescription(description);
                setOriginalImage(image);
                setOriginalIsPrivate(isPrivate);
                setOriginalExploreByAll(exploreByAll);
                setOriginalExternalURLs([...externalURLs]);
                setOriginalTemplate(template);
                setOriginalUserAlias(userAlias);
                router.push(`${response.data._id}`);
                setIsSaving(false);
                setUrlPreviewMode(false);
            }
        } catch (error: any) {
            console.log("Save error:", error);
            // toast.error("Failed to update URL. Please try again.");
            const errorMessage =
                error?.response?.data?.error?.message ||
                error?.response?.data?.message ||
                error?.message ||
                "Failed to save URL. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
            setOnSave(false);
            setIsLoading(false);
        }
    };

    const handleUpdate = async () => {
        setIsLoading(true);
        try {
            if (!title) {
                toast.error("Please enter a title");
                return;
            }

            setIsSaving(true);

            // Create FormData for file upload
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);

            // Process external URLs and separate files from data
            const externalURLsData = externalURLs.map((url, index) => {
                const { imageFile, ...urlData } = url;
                return urlData;
            });
            formData.append("externalURLs", JSON.stringify(externalURLsData));

            // Append external URL image files separately
            externalURLs.forEach((url, index) => {
                if (url.imageFile) {
                    formData.append(`externalUrlImage_${index}`, url.imageFile);
                }
            });

            formData.append("public", (!isPrivate).toString());
            formData.append("exploreByAll", exploreByAll.toString());
            formData.append("template", JSON.stringify(template));
            formData.append("userAlias", JSON.stringify(userAlias));
            // If image is a base64 string, convert it back to a file
            if (image) {
                formData.append("image", image);
            } else {
                if (image === null) {
                    formData.append("image", null as any);
                }
            }

            if (userAlias?.imageFile) {
                formData.append("userAliasImage", userAlias.imageFile);
            }

            const response = await api.put(`/api/url/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Url updated successfully!");

            // Update original values after successful update
            setOriginalTitle(title);
            setOriginalDescription(description);
            setOriginalImage(image);
            setOriginalIsPrivate(isPrivate);
            setOriginalExploreByAll(exploreByAll);
            setOriginalExternalURLs([...externalURLs]);
            setOriginalTemplate(template);
            setOriginalUserAlias(userAlias);
            setIsSaving(false);
            setUrlPreviewMode(false);
            setPreviewMode(false);
            setOnSave(false);
        } catch (error: any) {
            console.log("Update error:", error);
            // toast.error("Failed to update URL. Please try again.");
            const errorMessage =
                error?.response?.data?.error?.message ||
                error?.response?.data?.message ||
                error?.message ||
                "Failed to update URL. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
            setIsLoading(false);
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: any) => {
        setActiveId("");
        const { active, over } = event;

        if (active.id !== over.id) {
            setExternalUrls((urls) => {
                const oldIndex = urls.findIndex((url) => url._id === active.id);
                const newIndex = urls.findIndex((url) => url._id === over.id);

                const reorderedUrls = arrayMove(urls, oldIndex, newIndex);

                // Update sequence values based on new order
                return reorderedUrls.map((url, index) => ({
                    ...url,
                    sequence: index + 1,
                }));
            });
        }
    };

    const generateTitle = async () => {
        try {
            setIsGeneratingTitle(true);

            const response = await api.post(`/api/gemini/text`, {
                method: "POST",
                prompt: `Create 10 titles separated by commas (,,). Titles may have spaces. ${
                    externalURLs.length &&
                    `The titles must be related to ${externalURLs
                        .map((url) => `${url.title} (${url.url})`)
                        .join(", ")}`
                }. Provide the answer directly with no extra text.`,
            });

            const titles = response.data.split(",,");

            setGeneratedTitles(titles);
            setIsGeneratingTitle(false);
        } catch (error) {
            setIsGeneratingTitle(false);
            console.log("Error generating title:", error);
            toast.error("Failed to generate title. Please try again.");
        } finally {
            setIsGeneratingTitle(false);
        }

        // --------------- For image generation ---------------
        // const config = {
        //     responseModalities: ["IMAGE", "TEXT"],
        // };
        // const model = "gemini-2.5-flash-image-preview";
        // const contents = [
        //     {
        //         role: "user",
        //         parts: [
        //             {
        //                 text: `Create an image of animated cat.`,
        //             },
        //         ],
        //     },
        // ];

        // const response2 = await ai.models.generateContentStream({
        //     model,
        //     config,
        //     contents,
        // });

        // console.log("Response 2:", response2);
    };

    const generateDescription = async () => {
        try {
            setIsGeneratingDescription(true);
            const response = await api.post(`/api/gemini/text`, {
                method: "POST",
                prompt: `Create 10 descriptions 300 characters max each separated by commas (,,). Descriptions may have spaces. ${
                    externalURLs.length &&
                    `The descriptions must be related to ${externalURLs
                        .map((url) => `${url.title} (${url.url})`)
                        .join(", ")}`
                }. Provide the answer directly with no extra text.`,
            });
            const descriptions = response.data.split(",,");
            setGeneratedDescriptions(descriptions);
            setIsGeneratingDescription(false);
        } catch (error) {
            setIsGeneratingDescription(false);
            console.log("Error generating description:", error);
            toast.error("Failed to generate description. Please try again.");
        } finally {
            setIsGeneratingDescription(false);
        }
    };

    const setNewTitle = (title: string) => {
        setTitle(title);
        setTitleEdit(false);
        setShowTitleDropdown(false);
    };

    const setNewDescription = (description: string) => {
        setDescription(description);
        setDescriptionEdit(false);
        setShowDescriptionDropdown(false);
    };

    const selectNewTemplate = (template: any) => {
        setUrlTemplate(template);
        setTemplate(template);
    };

    // Function to scroll to the selected template
    const scrollToSelectedTemplate = () => {
        if (!template) {
            // If no template is selected, scroll to the default template (first item)
            const defaultElement = templateRefs.current["default"];
            if (defaultElement && scrollContainerRef.current) {
                const containerRect =
                    scrollContainerRef.current.getBoundingClientRect();
                const templateRect = defaultElement.getBoundingClientRect();

                const scrollTop =
                    scrollContainerRef.current.scrollTop +
                    (templateRect.top - containerRect.top) -
                    containerRect.height / 2 +
                    templateRect.height / 2;

                scrollContainerRef.current.scrollTo({
                    top: Math.max(0, scrollTop),
                    behavior: "smooth",
                });
            } else {
                scrollContainerRef.current?.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            }
            return;
        }

        const templateElement = templateRefs.current[template.id];
        if (templateElement && scrollContainerRef.current) {
            const containerRect =
                scrollContainerRef.current.getBoundingClientRect();
            const templateRect = templateElement.getBoundingClientRect();

            // Calculate the position to scroll to center the template in the container
            const scrollTop =
                scrollContainerRef.current.scrollTop +
                (templateRect.top - containerRect.top) -
                containerRect.height / 2 +
                templateRect.height / 2;

            scrollContainerRef.current.scrollTo({
                top: Math.max(0, scrollTop),
                behavior: "smooth",
            });
        }
    };

    // Auto-scroll to selected template when template changes
    useEffect(() => {
        // Small delay to ensure DOM is updated
        setTimeout(() => {
            scrollToSelectedTemplate();
        }, 100);
    }, [template]);

    useEffect(() => {
        const fetchUrl = async () => {
            if (id !== "create") {
                setIsLoading(true);
                const response = await api.get(`/api/url/${id}`);

                setTitle(response.data.url.title);
                setDescription(response.data.url.description);
                setImage(response.data.url.image);
                setImagePreview(response.data.url.image);
                // Initialize external URLs with imageFile property
                const externalUrlsWithImageFile =
                    response.data.externalUrls.map((url: any) => ({
                        ...url,
                        imageFile: null, // Initialize imageFile as null for existing URLs
                    }));
                setExternalUrls(externalUrlsWithImageFile);
                setIsPrivate(!response.data.url.public);
                setExploreByAll(response.data.url.exploreByAll || false);
                setEditMode(true);
                setPreviewMode(false);
                setTemplate(response.data.url.template);
                setUrlTemplate(response.data.url.template);

                if (response.data.url.userAlias) {
                    setUserAlias({
                        name: response.data.url.userAlias.name,
                        image: response.data.url.userAlias.imageFile,
                        imageFile: response.data.url.userAlias.imageFile,
                    });
                }

                // Store original values for change detection
                setOriginalTitle(response.data.url.title);
                setOriginalDescription(response.data.url.description);
                setOriginalImage(response.data.url.image);
                setOriginalIsPrivate(!response.data.url.public);
                setOriginalExploreByAll(
                    response.data.url.exploreByAll || false
                );
                setOriginalExternalURLs(externalUrlsWithImageFile);
                setOriginalTemplate(response.data.url.template);
                if (response.data.url.userAlias) {
                    setOriginalUserAlias({
                        name: response.data.url.userAlias.name,
                        image: response.data.url.userAlias.imageFile,
                        imageFile: response.data.url.userAlias.imageFile,
                    });
                }
                if (response.data.url.userId === userDetails?.user?.id) {
                    setIsFromUser(true);
                }

                setIsUrlFound(true);
            } else {
                setIsUrlFound(true);
                setEditMode(true);
                setPreviewMode(false);
                setIsFromUser(true);
                setIsPrivate(true);
                // Initialize original values for new items
                setOriginalTitle("");
                setOriginalDescription("");
                setOriginalImage(null);
                setOriginalIsPrivate(false);
                setOriginalExploreByAll(false);
                setOriginalExternalURLs([]);
                setOriginalTemplate(null);
                setUserAlias(null);
            }
            setIsLoading(false);
        };
        fetchUrl();
    }, [id, userDetails]);

    useEffect(() => {
        const refreshUserToken = async () => {
            // setIsLoading(true);
            if (accessToken && !userDetails) {
                setUserDetails(decodeToken(accessToken));
            } else {
                // let res = await refreshToken();
                // if (res === null) {
                //     router.push("/");
                // }
            }
            // setIsLoading(false);
        };
        refreshUserToken();
    }, [accessToken, refreshToken]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showTitleDropdown) {
                const target = event.target as Element;
                if (!target.closest(".title-dropdown-container")) {
                    setShowTitleDropdown(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showTitleDropdown]);

    // Panel puller drag handlers
    const handlePanelDragStart = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStartY(e.clientY);
        e.preventDefault();
    };

    const handlePanelDragMove = (e: MouseEvent) => {
        if (!isDragging) return;

        const deltaY = e.clientY - dragStartY;
        const threshold = 50; // Minimum drag distance to trigger toggle

        if (Math.abs(deltaY) > threshold) {
            setIsPanelOpen(deltaY < 0); // Open if dragged up, close if dragged down
            setIsDragging(false);
        }
    };

    const handlePanelDragEnd = () => {
        setIsDragging(false);
    };

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    // Template panel puller drag handlers
    const handlePanelDragStartTemplate = (e: React.MouseEvent) => {
        setIsDraggingTemplate(true);
        setDragStartYTemplate(e.clientY);
        e.preventDefault();
    };

    const handlePanelDragMoveTemplate = (e: MouseEvent) => {
        if (!isDraggingTemplate) return;

        const deltaY = e.clientY - dragStartYTemplate;
        const threshold = 50; // Minimum drag distance to trigger toggle

        if (Math.abs(deltaY) > threshold) {
            setIsPanelOpenTemplate(deltaY < 0); // Open if dragged up, close if dragged down
            setIsDraggingTemplate(false);
        }
    };

    const handlePanelDragEndTemplate = () => {
        setIsDraggingTemplate(false);
    };

    const togglePanelTemplate = () => {
        setIsPanelOpenTemplate(!isPanelOpenTemplate);
    };

    // Add event listeners for drag
    React.useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handlePanelDragMove);
            document.addEventListener("mouseup", handlePanelDragEnd);
            return () => {
                document.removeEventListener("mousemove", handlePanelDragMove);
                document.removeEventListener("mouseup", handlePanelDragEnd);
            };
        }
    }, [isDragging, dragStartY]);

    // Add event listeners for template panel drag
    React.useEffect(() => {
        if (isDraggingTemplate) {
            document.addEventListener("mousemove", handlePanelDragMoveTemplate);
            document.addEventListener("mouseup", handlePanelDragEndTemplate);
            return () => {
                document.removeEventListener(
                    "mousemove",
                    handlePanelDragMoveTemplate
                );
                document.removeEventListener(
                    "mouseup",
                    handlePanelDragEndTemplate
                );
            };
        }
    }, [isDraggingTemplate, dragStartYTemplate]);

    // Close panels on small screens
    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                // md breakpoint
                setIsPanelOpen(false);
                setIsPanelOpenTemplate(false);
            }
        };

        // Check initial screen size
        handleResize();

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return isUrlFound ? (
        <div
            className="w-full flex justify-center relative px-3 md:px-0"
            style={{
                backgroundColor: template?.background || "#ffffff",
                color: template?.text || "#000000",
            }}
        >
            <div
                className={`w-full lg:max-w-[60rem] lg:px-0 xl:max-w-[76rem]  ${
                    previewMode ? "pt-30 pb-10 " : "pt-10 "
                } min-h-screen`}
            >
                <div className="flex items-center justify-center ">
                    <div className="w-full max-w-xl ">
                        {/* header */}
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-5 sm:justify-between justify-center items-start relative">
                                <div className="flex gap-5 relative sm:flex-row flex-col items-center">
                                    <div
                                        className={`${
                                            previewMode
                                                ? imagePreview === ""
                                                    ? "hidden"
                                                    : "relative"
                                                : "relative"
                                        }`}
                                    >
                                        {!previewMode && (
                                            <div
                                                className="absolute -top-5 -right-2 rounded-full bg-white group hover:bg-gray-200 cursor-pointer shadow-md h-9 w-9 text-center flex justify-center items-center"
                                                onClick={() => {
                                                    if (image) {
                                                        setImage(null);
                                                        setImagePreview("");
                                                    } else {
                                                        document
                                                            .getElementById(
                                                                "imageInput"
                                                            )
                                                            ?.click();
                                                    }
                                                }}
                                            >
                                                <span className="text-xs text-gray-800">
                                                    {image ? (
                                                        <CloseCircle />
                                                    ) : (
                                                        <Edit />
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        <input
                                            id="imageInput"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file =
                                                    e.target.files?.[0];
                                                if (file) {
                                                    // Validate file type
                                                    if (
                                                        !file.type.startsWith(
                                                            "image/"
                                                        )
                                                    ) {
                                                        alert(
                                                            "Please select a valid image file"
                                                        );
                                                        return;
                                                    }

                                                    // Validate file size (max 5MB)
                                                    const maxSize =
                                                        5 * 1024 * 1024; // 5MB
                                                    if (file.size > maxSize) {
                                                        alert(
                                                            "Image size should be less than 5MB"
                                                        );
                                                        return;
                                                    }

                                                    setImage(file);
                                                    const reader =
                                                        new FileReader();
                                                    reader.onload = (event) => {
                                                        setImagePreview(
                                                            event.target
                                                                ?.result as string
                                                        );
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                        <div className="w-30 h-30  rounded-3xl col-span-2 overflow-hidden">
                                            {imagePreview ? (
                                                <img
                                                    src={imagePreview}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                                                    <span className="text-sm">
                                                        No Image
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-span-3 flex flex-col gap-2 justify-center sm:text-left text-center">
                                        <div className="flex gap-4 items-center">
                                            {titleEdit ? (
                                                <div className="md:relative flex gap-4 title-dropdown-container">
                                                    <input
                                                        placeholder="Enter Title"
                                                        value={title}
                                                        className="text-2xl font-bold border-b border-gray-300 focus:outline-none focus:border-primary w-full"
                                                        onChange={(e) => {
                                                            const val =
                                                                e.target.value;
                                                            setTitle(
                                                                val.slice(0, 50)
                                                            );
                                                        }}
                                                        onBlur={() =>
                                                            setTitleEdit(false)
                                                        }
                                                        onKeyDown={(e) => {
                                                            if (
                                                                e.key ===
                                                                "Enter"
                                                            ) {
                                                                setTitleEdit(
                                                                    false
                                                                );
                                                            }
                                                        }}
                                                    />

                                                    <span
                                                        className="text-gray-700 hover:text-gray-400 cursor-pointer"
                                                        onClick={() => {
                                                            generateTitle();
                                                            setShowTitleDropdown(
                                                                !showTitleDropdown
                                                            );
                                                        }}
                                                    >
                                                        <Magicpen />
                                                    </span>

                                                    <span
                                                        className="text-gray-700 hover:text-gray-400 cursor-pointer"
                                                        onClick={() =>
                                                            setTitleEdit(false)
                                                        }
                                                    >
                                                        <CloseCircle />
                                                    </span>
                                                    {showTitleDropdown && (
                                                        <div className="z-20 absolute top-full left-0 mt-1 w-full bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg shadow-xl backdrop-blur-sm">
                                                            <div className="p-2">
                                                                <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs text-purple-600 font-medium border-b border-purple-100 mb-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse"></div>
                                                                        AI
                                                                        Generated
                                                                        Titles
                                                                    </div>
                                                                    <span
                                                                        className="text-gray-700 hover:text-gray-400 cursor-pointer"
                                                                        onClick={() => {
                                                                            generateTitle();
                                                                        }}
                                                                    >
                                                                        <ArrowRotateRight />
                                                                    </span>
                                                                </div>
                                                                {isGeneratingTitle ? (
                                                                    <div className="flex items-center justify-center gap-3 px-3 py-4 text-sm text-purple-600 font-medium">
                                                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-400 border-t-transparent"></div>
                                                                        <span>
                                                                            Generating
                                                                            AI
                                                                            Titles...
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="space-y-1 max-h-48 overflow-y-auto">
                                                                        {generatedTitles.map(
                                                                            (
                                                                                generatedTitle,
                                                                                index
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    className="px-3 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 cursor-pointer rounded-md transition-all duration-200 hover:shadow-sm border border-transparent hover:border-purple-200"
                                                                                    onClick={() => {
                                                                                        console.log(
                                                                                            "Title clicked:",
                                                                                            generatedTitle
                                                                                        );
                                                                                        setNewTitle(
                                                                                            generatedTitle
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <div className="flex items-center gap-2">
                                                                                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                                                                                        {
                                                                                            generatedTitle
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                )}
                                                                <div className="mt-2 px-3 py-1 text-xs text-gray-500 italic border-t border-purple-100">
                                                                    Powered by
                                                                    Gemini
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <>
                                                    <span
                                                        className="text-2xl font-bold"
                                                        style={{
                                                            color:
                                                                template?.text ||
                                                                "#000000",
                                                        }}
                                                    >
                                                        {title ? (
                                                            title
                                                        ) : (
                                                            <span
                                                                className="italic"
                                                                style={{
                                                                    color:
                                                                        template?.secondary ||
                                                                        "#6b7280",
                                                                }}
                                                            >
                                                                No Title
                                                            </span>
                                                        )}
                                                    </span>
                                                    {!previewMode && (
                                                        <span
                                                            className="text-gray-700 hover:text-gray-400 cursor-pointer"
                                                            onClick={() =>
                                                                setTitleEdit(
                                                                    true
                                                                )
                                                            }
                                                        >
                                                            <Edit />
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        <div className="flex items-center sm:justify-start justify-center gap-4">
                                            <div className="flex items-center gap-2">
                                                {userAlias ? (
                                                    <>
                                                        {userAlias.image !==
                                                            "" &&
                                                        userAlias.image !==
                                                            null ? (
                                                            <img
                                                                src={
                                                                    userAlias?.image
                                                                }
                                                                alt="user image"
                                                                className="w-8 h-8 rounded-full"
                                                            />
                                                        ) : (
                                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                                <User
                                                                    size="16"
                                                                    className=" text-gray-500"
                                                                />
                                                            </div>
                                                        )}
                                                        <span
                                                            className="text-sm"
                                                            style={{
                                                                color:
                                                                    template?.secondary ||
                                                                    "#111827",
                                                            }}
                                                        >
                                                            {userAlias?.name}
                                                        </span>

                                                        {!previewMode && (
                                                            <span
                                                                className="text-gray-700 hover:text-gray-400 cursor-pointer text-sm"
                                                                onClick={() =>
                                                                    setUserAlias(
                                                                        null
                                                                    )
                                                                }
                                                            >
                                                                <CloseCircle />
                                                            </span>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        {userDetails?.user
                                                            ?.userImage ? (
                                                            <img
                                                                src={
                                                                    userDetails
                                                                        ?.user
                                                                        ?.userImage
                                                                }
                                                                alt="user image"
                                                                className="w-8 h-8 rounded-full"
                                                            />
                                                        ) : (
                                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                                <User
                                                                    size="16"
                                                                    className=" text-gray-500"
                                                                />
                                                            </div>
                                                        )}
                                                        <span
                                                            className="text-sm"
                                                            style={{
                                                                color:
                                                                    template?.secondary ||
                                                                    "#111827",
                                                            }}
                                                        >
                                                            {
                                                                userDetails
                                                                    ?.user
                                                                    ?.firstName
                                                            }{" "}
                                                            {
                                                                userDetails
                                                                    ?.user
                                                                    ?.lastName
                                                            }
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            {!previewMode && (
                                                <span
                                                    className="text-gray-700 hover:text-gray-400 cursor-pointer text-sm"
                                                    onClick={() =>
                                                        setUserAliasEdit(true)
                                                    }
                                                >
                                                    <Edit />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {isPrivate ? (
                                    previewMode && (
                                        <>
                                            {/* ----- for large screen ----- */}
                                            <span className="hidden sm:flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                Private
                                            </span>
                                            {/* ----- for small screen ----- */}
                                            <span
                                                className={`absolute ${
                                                    imagePreview === ""
                                                        ? "-top-10"
                                                        : "top-0"
                                                } right-0 sm:hidden flex justify-center items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800`}
                                            >
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                Private
                                            </span>
                                        </>
                                    )
                                ) : (
                                    <>
                                        {/* ----- for large screen ----- */}
                                        {previewMode && (
                                            <div
                                                className="hidden px-2 py-1 rounded-2xl sm:flex items-center gap-2 y cursor-pointer hover:text-gray-400 text-primary transition-all duration-300 hover:drop-shadow-lg hover:shadow-lg"
                                                style={{
                                                    color:
                                                        template?.accent ||
                                                        "#6b7280",
                                                    filter: "drop-shadow(0 0 0 transparent)",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.filter = `drop-shadow(0 0 8px ${
                                                        template?.accent ||
                                                        "#6b7280"
                                                    })`;
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.filter =
                                                        "drop-shadow(0 0 0 transparent)";
                                                }}
                                            >
                                                <span className="flex text-sm">
                                                    Share
                                                </span>
                                                <span className="text-sm cursor-pointer">
                                                    <Share />
                                                </span>
                                            </div>
                                        )}

                                        {/* ----- for small screen ----- */}
                                        {previewMode && (
                                            <div
                                                className={`absolute ${
                                                    imagePreview === ""
                                                        ? "-top-10"
                                                        : "top-0"
                                                } px-2 py-1 rounded-2xl right-0 gap-2 y cursor-pointer hover:text-gray-400 flex justify-center items-center text-primary sm:hidden`}
                                                style={{
                                                    color:
                                                        template?.accent ||
                                                        "#6b7280",
                                                }}
                                            >
                                                <span className="flex text-sm">
                                                    Share
                                                </span>
                                                <span className="text-sm cursor-pointer">
                                                    <Share />
                                                </span>
                                            </div>
                                        )}
                                    </>
                                )}

                                {isFromUser && !editMode && (
                                    <div
                                        className="items-center gap-2 y cursor-pointer hover:text-gray-400  text-primary sm:flex absolute top-0 right-0"
                                        onClick={() => {
                                            setPreviewMode(false);
                                            setEditMode(true);
                                        }}
                                    >
                                        <span className="flex text-sm">
                                            Edit
                                        </span>
                                        <span className="text-sm cursor-pointer">
                                            <Edit />
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                {!previewMode && !descriptionEdit && (
                                    <div className="flex justify-end">
                                        <span
                                            className="text-gray-700 hover:text-gray-400 cursor-pointer text-sm"
                                            onClick={() =>
                                                setDescriptionEdit(true)
                                            }
                                        >
                                            <Edit />
                                        </span>
                                    </div>
                                )}
                                {descriptionEdit ? (
                                    <div className="flex gap-4 relative">
                                        <textarea
                                            placeholder="Enter Description"
                                            value={description}
                                            className="text-sm text-gray-700 border-b border-gray-300 focus:outline-none focus:border-primary w-full resize-none"
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setDescription(
                                                    val.slice(0, 300)
                                                );
                                            }}
                                            onBlur={() =>
                                                setDescriptionEdit(false)
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    setDescriptionEdit(false);
                                                }
                                            }}
                                            rows={3}
                                            style={{
                                                color:
                                                    template?.text || "#000000",
                                            }}
                                        />

                                        <span
                                            className="text-gray-700 hover:text-gray-400 cursor-pointer"
                                            onClick={() => {
                                                generateDescription();
                                                setShowDescriptionDropdown(
                                                    !showDescriptionDropdown
                                                );
                                            }}
                                        >
                                            <Magicpen />
                                        </span>
                                        <span
                                            className="text-gray-700 hover:text-gray-400 cursor-pointer text-sm"
                                            onClick={() =>
                                                setDescriptionEdit(false)
                                            }
                                        >
                                            <CloseCircle />
                                        </span>
                                        {showDescriptionDropdown && (
                                            <div className="z-20 absolute top-full left-0 mt-1 w-full bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg shadow-xl backdrop-blur-sm">
                                                <div className="p-2">
                                                    <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs text-purple-600 font-medium border-b border-purple-100 mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse"></div>
                                                            AI Generated
                                                            Descriptions
                                                        </div>
                                                        <span
                                                            className="text-gray-700 hover:text-gray-400 cursor-pointer"
                                                            onClick={() => {
                                                                generateDescription();
                                                            }}
                                                        >
                                                            <ArrowRotateRight />
                                                        </span>
                                                    </div>
                                                    {isGeneratingDescription ? (
                                                        <div className="flex items-center justify-center gap-3 px-3 py-4 text-sm text-purple-600 font-medium">
                                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-400 border-t-transparent"></div>
                                                            <span>
                                                                Generating AI
                                                                Descriptions...
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-1 max-h-48 overflow-y-auto">
                                                            {generatedDescriptions.map(
                                                                (
                                                                    generatedDescription,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="px-3 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 cursor-pointer rounded-md transition-all duration-200 hover:shadow-sm border border-transparent hover:border-purple-200"
                                                                        onClick={() => {
                                                                            setNewDescription(
                                                                                generatedDescription
                                                                            );
                                                                        }}
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-1.5 min-w-1.5 h-1.5 min-h-1.5 bg-purple-400 rounded-full"></div>
                                                                            {
                                                                                generatedDescription
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                                    <div className="mt-2 px-3 py-1 text-xs text-gray-500 italic border-t border-purple-100">
                                                        Powered by Gemini
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <span
                                            className="text-sm break-words whitespace-pre-wrap sm:text-left text-center"
                                            style={{
                                                color: template?.text
                                                    ? `${template.text}CC`
                                                    : "#374151CC",
                                            }}
                                        >
                                            {description ? (
                                                <>{description}</>
                                            ) : (
                                                !previewMode && (
                                                    <span
                                                        className="italic"
                                                        style={{
                                                            color:
                                                                template?.secondary ||
                                                                "#6b7280",
                                                        }}
                                                    >
                                                        No Description
                                                        (optional)
                                                    </span>
                                                )
                                            )}
                                        </span>
                                        {/* <span
                                        className="text-gray-700 hover:text-gray-400 cursor-pointer text-sm"
                                        onClick={() => setDescriptionEdit(true)}
                                    >
                                        <Edit />
                                    </span> */}
                                    </>
                                )}
                            </div>
                        </div>
                        <div
                            className="w-full h-[1px] my-5"
                            style={{
                                backgroundColor: template?.accent || "#e5e7eb",
                            }}
                        ></div>
                        <div className="flex flex-col gap-10 py-5">
                            {!previewMode && (
                                <div className="flex justify-end">
                                    <Button
                                        size="sm"
                                        text="Add"
                                        icon={<Add />}
                                        variant="primary"
                                        onClick={() => setAddURLModal(true)}
                                    />
                                </div>
                            )}
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                                onDragStart={handleDragStart}
                            >
                                {externalURLs.length > 0 ? (
                                    <div
                                        className={`grid grid-cols-2 sm:grid-cols-3 gap-x-2 ${
                                            previewMode ? "gap-y-4" : "gap-y-10"
                                        }`}
                                    >
                                        <SortableContext
                                            items={externalURLs
                                                .sort(
                                                    (a, b) =>
                                                        a.sequence - b.sequence
                                                )
                                                .map((url) => url._id)}
                                            strategy={rectSortingStrategy}
                                        >
                                            {externalURLs
                                                .sort(
                                                    (a, b) =>
                                                        a.sequence - b.sequence
                                                )
                                                .map((url) => (
                                                    <ExternalUrl
                                                        title={url.title}
                                                        url={url.url}
                                                        dateTime={
                                                            url.updatedAt || ""
                                                        }
                                                        key={url._id}
                                                        id={url._id}
                                                        image={url.image}
                                                        onDelete={() =>
                                                            handleDeleteURL(
                                                                url._id
                                                            )
                                                        }
                                                        onEdit={() =>
                                                            handleEditURL(
                                                                url._id
                                                            )
                                                        }
                                                        mode={
                                                            previewMode
                                                                ? "preview"
                                                                : "edit"
                                                        }
                                                        template={template}
                                                    />
                                                ))}
                                            {/* <DragOverlay>
                                        {activeId ? (
                                            <div
                                                style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    backgroundColor: "red",
                                                }}
                                            ></div>
                                        ) : null}
                                    </DragOverlay> */}
                                        </SortableContext>
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center h-full">
                                        <span
                                            className="italic"
                                            style={{
                                                color:
                                                    template?.secondary ||
                                                    "#6b7280",
                                            }}
                                        >
                                            No URLs found. Add some to get
                                            started.
                                        </span>
                                    </div>
                                )}
                            </DndContext>
                        </div>

                        {/* <div className="grid grid-cols-3 gap-1">
                            <ExternalUrl
                                title={"Title"}
                                url={"https://www.google.com/search?q=linktre"}
                                dateTime={"2025-01-01T00:00:00.000Z"}
                            />
                        </div> */}
                    </div>
                </div>
            </div>

            {/* menu */}
            {editMode && isFromUser && (
                <div
                    className={`z-20 fixed top-1/2 -translate-y-1/2 right-0 transition-transform duration-300 ease-in-out ${
                        isPanelOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    {/* Puller Handle */}
                    <div
                        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-6 h-16 ${
                            !hasChanges() ? "bg-gray-600" : "bg-primary"
                        }  hover:bg-gray-300 rounded-l-lg cursor-pointer flex items-center justify-center group transition-colors duration-200`}
                        onMouseDown={handlePanelDragStart}
                        onClick={togglePanel}
                    >
                        {isPanelOpen ? (
                            <ArrowRight2 className="text-white" />
                        ) : (
                            <ArrowLeft2 className="text-white" />
                        )}
                    </div>

                    <div
                        className="w-fit bg-white rounded-xl shadow-md p-4"
                        style={{ backgroundColor: "#ffffff" }}
                    >
                        <div className="flex justify-center flex-col gap-4">
                            <div className="flex items-center gap-2 mr-4">
                                <div className="flex items-center gap-3">
                                    <span className="ml-2 text-sm font-medium text-gray-900">
                                        Edit
                                    </span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={previewMode}
                                            onChange={() => {
                                                setPreviewMode(!previewMode);
                                                setUrlPreviewMode(!previewMode);
                                                setTitleEdit(false);
                                                setDescriptionEdit(false);
                                                setShowTitleDropdown(false);
                                                setShowDescriptionDropdown(
                                                    false
                                                );

                                                if (!previewMode) {
                                                    togglePanel();
                                                    setIsPanelOpenTemplate(
                                                        false
                                                    );
                                                } else {
                                                    setIsPanelOpenTemplate(
                                                        true
                                                    );
                                                }
                                            }}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        {/* <span className="ml-2 text-sm font-medium text-gray-900">
                                            {editMode ? "Edit" : "Preview"}
                                        </span> */}
                                    </label>
                                    <span className="text-sm font-medium text-gray-900">
                                        Preview
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-start gap-2 y cursor-pointer hover:text-gray-400">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            value={isPrivate.toString()}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                                            onChange={() => {
                                                if (!isPrivate === false) {
                                                    setExploreByAll(false);
                                                }
                                                setIsPrivate(!isPrivate);
                                            }}
                                            defaultChecked={!isPrivate}
                                        />
                                        <label className="ms-2 text-sm font-medium text-gray-900">
                                            Make Public
                                        </label>
                                    </div>
                                </div>
                                {!hasChanges() && id !== "create" && (
                                    <div className="flex items-center">
                                        <span
                                            className="text-sm flex items-center gap-1 underline text-gray-500 hover:text-primary cursor-pointer"
                                            onClick={() => {
                                                window.open(
                                                    `/share/${id}`,
                                                    "_blank"
                                                );
                                            }}
                                        >
                                            Visit <Link21 />
                                        </span>
                                    </div>
                                )}
                            </div>
                            {!isPrivate && (
                                <div className="flex justify-start gap-2 y cursor-pointer hover:text-gray-400">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={exploreByAll}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                                                onChange={() =>
                                                    setExploreByAll(
                                                        !exploreByAll
                                                    )
                                                }
                                            />
                                            <label className="ms-2 text-sm font-medium text-gray-900">
                                                Explore by All
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="w-full">
                                <Button
                                    text={isSaving ? "Saving..." : "Save"}
                                    variant="primary"
                                    icon={isSaving ? null : <Save2 />}
                                    onClick={() => {
                                        if (!isSaving) {
                                            setOnSave(true);
                                        }
                                    }}
                                    width="full"
                                    disabled={!hasChanges()}
                                />
                                {!hasChanges() && (
                                    <p className="text-xs text-gray-500 text-center mt-2">
                                        No changes to save
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* templates */}
            {editMode && isFromUser && (
                <div
                    className={`z-20 fixed h-[75vh] bottom-0 left-0 transition-transform duration-300 ease-in-out ${
                        isPanelOpenTemplate
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }`}
                >
                    {/* Puller Handle */}
                    <div
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-6 h-16 bg-gray-600 hover:bg-gray-300 rounded-r-lg cursor-pointer flex items-center justify-center group transition-colors duration-200"
                        onMouseDown={handlePanelDragStartTemplate}
                        onClick={togglePanelTemplate}
                    >
                        {!isPanelOpenTemplate ? (
                            <ArrowRight2 className="text-white" />
                        ) : (
                            <ArrowLeft2 className="text-white" />
                        )}
                    </div>

                    <div
                        className="w-[250px] h-full bg-red-500 rounded-xl shadow-md p-4 flex flex-col"
                        style={{ backgroundColor: "#ffffff" }}
                    >
                        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 mb-3 flex-shrink-0">
                            <ul className="flex flex-wrap ">
                                <li className="w-full">
                                    <a
                                        href="#"
                                        className="w-full inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active"
                                        aria-current="page"
                                    >
                                        Templates
                                    </a>
                                </li>

                                {/* <li className="me-2">
                                    <a
                                        href="#"
                                        className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300"
                                    >
                                        Customize
                                    </a>
                                </li> */}
                            </ul>
                        </div>

                        {/* Search Bar */}
                        <div className="mb-4 flex-shrink-0">
                            <div className="relative">
                                <SearchNormal1 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search templates..."
                                    value={templateSearchQuery}
                                    onChange={(e) =>
                                        setTemplateSearchQuery(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            </div>
                        </div>

                        <div
                            ref={scrollContainerRef}
                            className="flex flex-col gap-4 overflow-y-auto relative flex-1 min-h-0"
                        >
                            <div
                                ref={(el) => {
                                    templateRefs.current["default"] = el;
                                }}
                                className={`relative rounded-lg shadow-lg p-1 hover:shadow-xl transition-all duration-300 cursor-pointer ${
                                    template ? "bg-white" : "bg-primary"
                                }`}
                                onClick={() => {
                                    selectNewTemplate(null);
                                    setUrlTemplate(null);
                                }}
                            >
                                <div className="rounded-lg flex h-[100px] justify-center items-center bg-gray-200">
                                    {/* <div className="border-2 border-gray-400 rounded-full w-12 h-12">
                                        <div >

                                        </div>
                                    </div> */}

                                    <span>
                                        <CloseCircle className="text-gray-400 w-12 h-12" />
                                    </span>
                                </div>

                                <span className="absolute top-0 left-0 p-3 text-xs text-gray-600">
                                    Default
                                </span>
                            </div>
                            {filteredTemplates.map((templateItem, index) => (
                                <div
                                    key={index}
                                    ref={(el) => {
                                        templateRefs.current[templateItem.id] =
                                            el;
                                    }}
                                    className={`relative rounded-lg shadow-lg p-1 hover:shadow-xl transition-all duration-300 cursor-pointer ${
                                        template
                                            ? template.id === templateItem.id
                                                ? "bg-primary"
                                                : "bg-white"
                                            : "bg-white"
                                    }`}
                                    onClick={() =>
                                        selectNewTemplate(templateItem)
                                    }
                                >
                                    <div
                                        className="rounded-lg flex h-[100px] justify-center items-center"
                                        style={{
                                            backgroundColor:
                                                templateItem.background,
                                        }}
                                    >
                                        <div className="flex items-center justify-center">
                                            <div
                                                className="w-12 h-12 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        templateItem.text,
                                                }}
                                            ></div>

                                            <div
                                                className="w-12 h-12 rounded-full -ml-3"
                                                style={{
                                                    backgroundColor:
                                                        templateItem.primary,
                                                }}
                                            ></div>

                                            <div
                                                className="w-12 h-12 rounded-full -ml-3"
                                                style={{
                                                    backgroundColor:
                                                        templateItem.secondary,
                                                }}
                                            ></div>

                                            <div
                                                className="w-12 h-12 rounded-full -ml-3"
                                                style={{
                                                    backgroundColor:
                                                        templateItem.accent,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                    <span
                                        className="absolute top-0 left-0 p-3 text-xs"
                                        style={{
                                            color: templateItem.text,
                                        }}
                                    >
                                        {templateItem.name}
                                    </span>
                                </div>
                            ))}

                            {!isAtTop && (
                                <div className="fixed bottom-7 right-10 px-3 py-2 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                                    <span
                                        className="text-xs text-gray-600 flex items-center gap-2 cursor-pointer"
                                        onClick={() => {
                                            scrollContainerRef.current?.scrollTo(
                                                {
                                                    top: 0,
                                                    behavior: "smooth",
                                                }
                                            );
                                        }}
                                    >
                                        Top <ArrowUp />
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* add modal */}
            {addURLModal && (
                <Modal
                    title="Add URL"
                    onClose={() => {
                        setNewUrl("");
                        setNewUrlTitle("");
                        setAddURLModal(false);
                    }}
                    onSave={handleAddURL}
                    content={
                        <div className="flex flex-col gap-4">
                            {newUrl !== "" && (
                                <div className="flex items-center justify-center">
                                    <div className="relative w-20 h-20 rounded-sm">
                                        <input
                                            id="newUrlImageInput"
                                            type="file"
                                            accept="image/*"
                                            className="hidden w-full shadow-sm rounded-md px-2 hover:cursor-pointer hover:color-primary"
                                            onChange={(e) => {
                                                const file =
                                                    e.target.files?.[0];
                                                if (file) {
                                                    setNewUrlImage({
                                                        preview:
                                                            URL.createObjectURL(
                                                                file
                                                            ),
                                                        file: file,
                                                    });
                                                }
                                            }}
                                        />
                                        {newUrlImage?.preview ? (
                                            <div className="w-20 h-20 rounded-sm border border-gray-200">
                                                <img
                                                    src={newUrlImage?.preview}
                                                    alt="URL Image"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 rounded-sm border border-gray-200">
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                                                    <span className="text-sm">
                                                        No Image
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <div
                                            className="absolute -top-5 -right-2 rounded-full bg-white group hover:bg-gray-200 cursor-pointer shadow-md h-9 w-9 text-center flex justify-center items-center"
                                            onClick={() => {
                                                if (newUrlImage?.file == null) {
                                                    document
                                                        .getElementById(
                                                            "newUrlImageInput"
                                                        )
                                                        ?.click();
                                                } else {
                                                    setNewUrlImage({
                                                        preview:
                                                            getFaviconUrl(
                                                                newUrl
                                                            ),
                                                        file: null as any,
                                                    });
                                                }
                                            }}
                                        >
                                            <span className="text-xs text-gray-800">
                                                {/* {newUrlImage?.preview ? (
                                                <CloseCircle />
                                            ) : (
                                                <Edit />
                                            )} */}

                                                {newUrlImage?.file == null ? (
                                                    <Edit />
                                                ) : (
                                                    <CloseCircle />
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <TextField
                                placeholder="URL"
                                type="text"
                                value={newUrl}
                                onChange={(e) => {
                                    setNewUrl(e.target.value);
                                    // Only update the preview if no file is selected
                                    if (!newUrlImage?.file) {
                                        setNewUrlImage({
                                            preview: getFaviconUrl(
                                                e.target.value
                                            ),
                                            file: null as any,
                                        });
                                    }
                                }}
                            />
                            <TextField
                                placeholder="Title (Optional)"
                                type="text"
                                value={newUrlTitle}
                                onChange={(e) => setNewUrlTitle(e.target.value)}
                            />
                        </div>
                    }
                />
            )}

            {/* edit modal */}
            {editURLModal && (
                <Modal
                    title="Edit URL"
                    onClose={() => {
                        setNewUrl("");
                        setNewUrlTitle("");
                        setEditUrlImage(null);
                        setEditURLModal(false);
                    }}
                    onSave={handleUpdateURL}
                    content={
                        <div className="flex flex-col gap-4">
                            {newUrl !== "" && (
                                <div className="flex items-center justify-center">
                                    <div className="relative w-20 h-20 rounded-sm">
                                        <input
                                            id="editUrlImageInput"
                                            type="file"
                                            accept="image/*"
                                            className="hidden w-full shadow-sm rounded-md px-2 hover:cursor-pointer hover:color-primary"
                                            onChange={(e) => {
                                                const file =
                                                    e.target.files?.[0];
                                                if (file) {
                                                    setEditUrlImage({
                                                        preview:
                                                            URL.createObjectURL(
                                                                file
                                                            ),
                                                        file: file,
                                                    });
                                                }
                                            }}
                                        />
                                        {editUrlImage?.preview ? (
                                            <div className="w-20 h-20 rounded-sm border border-gray-200">
                                                <img
                                                    src={editUrlImage?.preview}
                                                    alt="URL Image"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 rounded-sm border border-gray-200">
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                                                    <span className="text-sm">
                                                        No Image
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <div
                                            className="absolute -top-5 -right-2 rounded-full bg-white group hover:bg-gray-200 cursor-pointer shadow-md h-9 w-9 text-center flex justify-center items-center"
                                            onClick={() => {
                                                if (
                                                    editUrlImage?.file == null
                                                ) {
                                                    document
                                                        .getElementById(
                                                            "editUrlImageInput"
                                                        )
                                                        ?.click();
                                                } else {
                                                    setEditUrlImage({
                                                        preview:
                                                            getFaviconUrl(
                                                                newUrl
                                                            ),
                                                        file: null as any,
                                                    });
                                                }
                                            }}
                                        >
                                            <span className="text-xs text-gray-800">
                                                {editUrlImage?.file == null ? (
                                                    <Edit />
                                                ) : (
                                                    <CloseCircle />
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <TextField
                                placeholder="URL"
                                type="text"
                                value={newUrl}
                                onChange={(e) => {
                                    setNewUrl(e.target.value);
                                    // Only update the preview if no file is selected
                                    if (!editUrlImage?.file) {
                                        setEditUrlImage({
                                            preview: getFaviconUrl(
                                                e.target.value
                                            ),
                                            file: null as any,
                                        });
                                    }
                                }}
                            />
                            <TextField
                                placeholder="Title (Optional)"
                                type="text"
                                value={newUrlTitle}
                                onChange={(e) => setNewUrlTitle(e.target.value)}
                            />
                        </div>
                    }
                />
            )}

            {/* user alias modal */}
            {userAliasEdit && (
                <Modal
                    title="User Alias"
                    onClose={() => {
                        setUserAliasOnEdit({
                            name: "",
                            image: "",
                            imageFile: null,
                        });
                        setUserAliasEdit(false);
                    }}
                    onSave={() => {
                        if (
                            userAliasOnEdit?.name &&
                            userAliasOnEdit.name.length >= 5
                        ) {
                            setUserAlias(userAliasOnEdit);
                            setUserAliasOnEdit({
                                name: "",
                                image: "",
                                imageFile: null,
                            });
                            setUserAliasEdit(false);
                        } else {
                            toast.error("Name must be at least 5 characters");
                        }
                    }}
                    content={
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-center">
                                <div className="relative w-15 h-15">
                                    <input
                                        id="userAliasImageInput"
                                        type="file"
                                        accept="image/*"
                                        className="hidden w-full shadow-sm rounded-md px-2 hover:cursor-pointer hover:color-primary"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                // Create a preview URL for the image
                                                const imageUrl =
                                                    URL.createObjectURL(file);
                                                setUserAliasOnEdit({
                                                    name:
                                                        userAliasOnEdit?.name ||
                                                        "",
                                                    image: imageUrl,
                                                    imageFile: file,
                                                });
                                            }
                                        }}
                                    />
                                    {userAliasOnEdit?.image ? (
                                        <div className="w-15 h-15 rounded-full">
                                            <img
                                                src={userAliasOnEdit?.image}
                                                alt="User Alias"
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex justify-center items-center relative">
                                            <div className="w-15 h-15 rounded-full bg-gray-200 flex items-center justify-center">
                                                <User className="w-8 h-8 text-gray-500" />
                                            </div>
                                        </div>
                                    )}

                                    <div
                                        className="absolute -top-5 -right-2 rounded-full bg-white group hover:bg-gray-200 cursor-pointer shadow-md h-9 w-9 text-center flex justify-center items-center"
                                        onClick={() => {
                                            if (userAliasOnEdit?.image) {
                                                setUserAliasOnEdit({
                                                    name:
                                                        userAliasOnEdit?.name ||
                                                        "",
                                                    image: "",
                                                    imageFile: null,
                                                });
                                            } else {
                                                document
                                                    .getElementById(
                                                        "userAliasImageInput"
                                                    )
                                                    ?.click();
                                            }
                                        }}
                                    >
                                        <span className="text-xs text-gray-800">
                                            {userAliasOnEdit?.image ? (
                                                <CloseCircle />
                                            ) : (
                                                <Edit />
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <TextField
                                placeholder="User Alias"
                                type="text"
                                value={userAliasOnEdit?.name}
                                onChange={(e) =>
                                    setUserAliasOnEdit({
                                        name: e.target.value,
                                        image: userAliasOnEdit?.image || "",
                                        imageFile:
                                            userAliasOnEdit?.imageFile || null,
                                    })
                                }
                            />
                        </div>
                    }
                />
            )}

            {/* save modal */}
            {onSave && (
                <Modal
                    title="Confirm"
                    onClose={() => setOnSave(false)}
                    onSave={() => {
                        if (id === "create") {
                            handleSave();
                        } else {
                            handleUpdate();
                        }
                    }}
                    content={
                        <div className="flex items-center justify-center flex-col gap-4">
                            <span className="text-2xl text-black text-center">
                                Are you sure you want to save?
                            </span>
                        </div>
                    }
                />
            )}
            {isLoading && <LoadingScreen />}
        </div>
    ) : (
        <>
            <div className="h-screen w-full flex justify-center items-center">
                <span className="text-2xl text-center">URL not found</span>
            </div>
            {isLoading && <LoadingScreen />}
        </>
    );
};

export default Url;

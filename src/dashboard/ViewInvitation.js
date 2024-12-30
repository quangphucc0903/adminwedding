import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Box, Typography, Snackbar, Alert } from "@mui/material";
import { getTemplateById } from "../service/templateService";

const ViewInvitation = () => {
    const { id } = useParams(); 
    const [invitation, setInvitation] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "",
    });

    useEffect(() => {
        const fetchTemplateData = async () => {
            try {
                const response = await getTemplateById(id);
                const data = response.data;
                console.log(data.invitation);
                if (data.invitation) {
                    setInvitation(data.invitation);
                    const processedSections = processMetadataToSections(data.invitation.metadata);
                    setSections(processedSections);
                } else if (data.section_user && data.section_user.length > 0) {
                    const processedSections = processSectionUserToSections(data.section_user);
                    setSections(processedSections);
                } else {
                    showSnackbar("Không tìm thấy lời mời hoặc dữ liệu!", "info");
                }
            } catch (error) {
                console.error("Error fetching template data:", error);
                showSnackbar("Lỗi khi tải dữ liệu!", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchTemplateData();
    }, [id]);

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const renderComponent = (component) => {
        switch (component.type) {
            case "text":
                return (
                    <Box
                        key={component.id}
                        sx={{
                            position: "absolute",
                            left: component.style.left,
                            top: component.style.top,
                            fontSize: component.style.fontSize,
                            fontFamily: component.style.fontFamily || "Arial",
                            width: component.style.width,
                            height: component.style.height,
                            color: component.style.color || "#000",
                            backgroundColor: component.style.fillColor || "transparent",
                        }}
                    >
                        <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
                            {component.text || "Sample Text"}
                        </Typography>
                    </Box>
                );
            case "circle":
                return (
                    <Box
                        key={component.id}
                        sx={{
                            position: "absolute",
                            left: component.style.left,
                            top: component.style.top,
                            width: component.style.width,
                            height: component.style.height,
                            backgroundColor: component.style.fillColor || "#000",
                            borderRadius: "50%",
                            border: component.style.border || "none",
                        }}
                    />
                );
            case "image":
                return (
                    <Box
                        key={component.id}
                        sx={{
                            position: "absolute",
                            left: component.style.left,
                            top: component.style.top,
                            width: component.style.width,
                            height: component.style.height,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: component.style.fillColor || "transparent",
                        }}
                    >
                        {component.src ? (
                            <img
                                src={component.src}
                                alt="Image component"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        ) : (
                            <Typography variant="caption" sx={{ color: "#aaa" }}>
                                No image source
                            </Typography>
                        )}
                    </Box>
                );
            default:
                return null;
        }
    };


    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <Typography variant="h6">Đang tải dữ liệu...</Typography>
            </Box>
        );
    }

    if (!invitation && sections.length === 0) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <Typography variant="h6">Không tìm thấy dữ liệu.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 2 }}>
            {invitation && (
                <>
                    <Typography variant="h4" gutterBottom>
                        {invitation.title || "Untitled Invitation"}
                    </Typography>
                  
                </>
            )}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {sections.map((section, index) => (
                    <Box
                        key={index}
                        sx={{
                            position: "relative",
                            border: "1px solid #ccc",
                            padding: 2,
                            minHeight: section.style?.minHeight,
                            minWidth: section.style?.minWidth,
                            backgroundColor: section.style?.backgroundColor,
                        }}
                    >
                        {section.components.map(renderComponent)}
                    </Box>
                ))}
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
};

const processMetadataToSections = (metadata) => {
    const styles = metadata?.style || [];
    const components = metadata?.components || [];

    return styles.map((styleItem, index) => ({
        id: `section-${index}`,
        style: styleItem,
        components: components[index] || [],
    }));
};

const processSectionUserToSections = (sectionUsers) => {
    return sectionUsers.map((sectionUser, index) => ({
        id: sectionUser.id || `section-${index}`,
        style: sectionUser.metadata?.style || {},
        components: sectionUser.metadata?.components || [],
    }));
};

export default ViewInvitation;

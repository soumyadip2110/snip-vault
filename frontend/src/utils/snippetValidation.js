export const validateSnippet = (formData) => {
    const errors = {};

    // Required fields
    if (!formData.title.trim()) {
        errors.title = 'Title is required.';
    }

    if (!formData.code.trim()) {
        errors.code = 'Code is required.';
    }

    if (!formData.language.trim()) {
        errors.language = 'Programming language is required.';
    }

    // Tag validation
    const tags = formData.tags
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean);

    const uniqueTags = [...new Set(tags)];

    if (uniqueTags.length > 10) {
        errors.tags = 'You can add a maximum of 10 unique tags.';
    } else if (uniqueTags.some((tag) => tag.length > 20)) {
        errors.tags = 'Each tag must be at most 20 characters.';
    }

    return errors;
};

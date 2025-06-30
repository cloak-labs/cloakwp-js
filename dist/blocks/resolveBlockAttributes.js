/**
 * Sometimes attributes bindings.
 */
export const resolveBlockAttributes = (block, blockRenderer) => {
    // Create a shallow copy of attrs to avoid mutations
    const attrs = { ...block.attrs };
    if (attrs?.metadata?.bindings) {
        const pageFields = blockRenderer.getMeta("acf");
        Object.entries(attrs.metadata.bindings).forEach(([key, binding]) => {
            if (typeof binding === "object" && binding !== null) {
                const { source, args } = binding;
                if (source === "acf/field" && pageFields) {
                    const value = pageFields[args.key];
                    if (value !== undefined) {
                        attrs[key] = value;
                    }
                }
            }
        });
    }
    return attrs;
};

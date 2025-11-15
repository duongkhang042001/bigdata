export const qdrantConfig = {
    host: process.env.QDRANT_HOST || 'localhost',
    port: parseInt(process.env.QDRANT_PORT || '6333'),
    apiKey: process.env.QDRANT_API_KEY || null,
    https: process.env.QDRANT_HTTPS === 'true',
};

export const geminiConfig = {
    apiKey: process.env.GEMINI_API_KEY || '',
};

import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const hfToken = process.env.HF_TOKEN;

        if (!hfToken) {
            return NextResponse.json(
                { error: 'HF_TOKEN environment variable is not configured on the server.' },
                { status: 500 }
            );
        }

        const response = await fetch("https://huggingface.co/api/spaces/Low-keyy/stainviz-backend/logs/run", {
            headers: {
                "Authorization": `Bearer ${hfToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`Hugging Face API responded with status: ${response.status}`);
        }

        // Since this is a streaming endpoint in HF, we'll just read the current chunk 
        // or proxy the text response to the client for debugging
        const text = await response.text();

        return NextResponse.json({ logs: text });

    } catch (error) {
        console.error("Error fetching HF logs:", error);
        return NextResponse.json(
            { error: 'Failed to fetch logs from Hugging Face.' },
            { status: 500 }
        );
    }
}

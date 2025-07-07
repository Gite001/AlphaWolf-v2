/**
 * Fetches the HTML content of a given URL.
 * @param url The URL to fetch.
 * @returns The HTML content of the page body.
 */
export async function fetchUrlContent(url: string): Promise<string> {
    try {
        const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } });
        if (!response.ok) {
            throw new Error(`Could not fetch URL. Status code: ${response.status}`);
        }
        const html = await response.text();

        // Check for client-side rendered apps (SPAs) which may not have content in initial HTML
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const bodyContent = bodyMatch ? bodyMatch[1].trim() : '';

        // If the body is very small and contains a typical SPA root element, it's likely an SPA.
        if (bodyContent.length < 500 && (bodyContent.toLowerCase().includes('id="root"') || bodyContent.toLowerCase().includes('id="app"'))) {
            throw new Error(`This page appears to require JavaScript to display content. The spy tool currently cannot analyze it correctly.`);
        }
        
        return html;
    } catch (error) {
        console.error(`Failed to fetch URL content for ${url}`, error);
        
        if (error instanceof Error) {
            // Pass specific, user-friendly errors through
            if (error.message.includes('Status code:')) {
                 throw new Error(`The competitor's website could not be reached (Status: ${error.message.split(' ').pop()}). It may be blocking analysis tools.`);
            }
            if (error.message.includes('JavaScript to display content')) {
                throw error;
            }
        }
        // Generic fallback error
        throw new Error('Failed to fetch or process the URL. The website may be down or blocking automated requests.');
    }
}

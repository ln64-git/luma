// Test script to check stable API version
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testStableAPI() {
    const apiKey = 'AIzaSyCr9nmIwaVwrpaOsaLANhWrw7rqIRSlsps';
    
    try {
        console.log('Testing stable API version...\n');
        
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Test with different base URLs to try stable API
        const baseUrls = [
            'https://generativelanguage.googleapis.com/v1/',  // Stable API
            'https://generativelanguage.googleapis.com/v1beta/', // Beta API
        ];
        
        for (const baseUrl of baseUrls) {
            console.log(`Testing base URL: ${baseUrl}`);
            
            try {
                // Test chat model
                const model = genAI.getGenerativeModel({ 
                    model: 'gemini-pro',
                    // Note: We can't easily change base URL with this SDK
                });
                
                const result = await model.generateContent('Hello!');
                console.log(`✅ Chat model works with ${baseUrl}`);
                console.log(`Response: ${result.response.text()}`);
                break;
                
            } catch (error) {
                console.log(`❌ Chat failed with ${baseUrl}: ${error.message}`);
            }
        }
        
        // Test embedding with the working model
        console.log('\nTesting embedding with text-embedding-004...');
        try {
            const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
            const result = await model.embedContent('Hello, world!');
            console.log(`✅ Embedding works! Vector length: ${result.embedding.values.length}`);
        } catch (error) {
            console.log(`❌ Embedding failed: ${error.message}`);
        }
        
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testStableAPI();

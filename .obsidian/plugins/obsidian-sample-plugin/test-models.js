// Test script to determine available Google AI models
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModels() {
    const apiKey = 'AIzaSyCr9nmIwaVwrpaOsaLANhWrw7rqIRSlsps';
    
    try {
        // Test different API configurations
        console.log('Testing Google AI API models...\n');
        
        // Test 1: List available models
        console.log('1. Testing model listing...');
        const genAI = new GoogleGenerativeAI(apiKey);
        
        try {
            const models = await genAI.listModels();
            console.log('Available models:');
            models.forEach(model => {
                console.log(`- ${model.name} (${model.displayName})`);
                console.log(`  Supported methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
            });
        } catch (error) {
            console.log('Error listing models:', error.message);
        }
        
        // Test 2: Test different model names for chat
        console.log('\n2. Testing chat models...');
        const chatModels = [
            'gemini-pro',
            'gemini-1.5-pro',
            'gemini-1.5-flash',
            'gemini-1.0-pro',
            'models/gemini-pro',
            'models/gemini-1.5-pro'
        ];
        
        for (const modelName of chatModels) {
            try {
                console.log(`Testing ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent('Hello, world!');
                console.log(`✅ ${modelName} works!`);
                break; // Stop at first working model
            } catch (error) {
                console.log(`❌ ${modelName}: ${error.message}`);
            }
        }
        
        // Test 3: Test embedding models
        console.log('\n3. Testing embedding models...');
        const embeddingModels = [
            'embedding-001',
            'models/embedding-001',
            'text-embedding-004'
        ];
        
        for (const modelName of embeddingModels) {
            try {
                console.log(`Testing ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.embedContent('Hello, world!');
                console.log(`✅ ${modelName} works!`);
                break; // Stop at first working model
            } catch (error) {
                console.log(`❌ ${modelName}: ${error.message}`);
            }
        }
        
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testModels();

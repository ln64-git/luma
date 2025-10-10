// Test to find working chat model
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function findWorkingChatModel() {
    const apiKey = 'AIzaSyCr9nmIwaVwrpaOsaLANhWrw7rqIRSlsps';
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try different model names that might work
    const modelsToTest = [
        'gemini-1.5-flash-001',
        'gemini-1.5-pro-001', 
        'gemini-1.0-pro-001',
        'gemini-pro-001',
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-1.0-pro',
        'gemini-pro'
    ];
    
    console.log('Testing chat models...\n');
    
    for (const modelName of modelsToTest) {
        try {
            console.log(`Testing ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Say hello in one word');
            console.log(`✅ ${modelName} works! Response: ${result.response.text()}`);
            break; // Stop at first working model
        } catch (error) {
            console.log(`❌ ${modelName}: ${error.message.split('\n')[0]}`);
        }
    }
}

findWorkingChatModel();

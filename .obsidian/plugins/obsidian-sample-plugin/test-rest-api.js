// Test using REST API directly
async function testRestAPI() {
    const apiKey = 'AIzaSyCr9nmIwaVwrpaOsaLANhWrw7rqIRSlsps';
    
    console.log('Testing REST API directly...\n');
    
    // Test 1: List available models
    try {
        console.log('1. Listing available models...');
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        
        if (data.models) {
            console.log('Available models:');
            data.models.forEach(model => {
                console.log(`- ${model.name}`);
                console.log(`  Display name: ${model.displayName}`);
                console.log(`  Supported methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
            });
        } else {
            console.log('Error:', data);
        }
    } catch (error) {
        console.log('Error listing models:', error.message);
    }
    
    // Test 2: Try generateContent with different models
    console.log('\n2. Testing generateContent...');
    const modelsToTest = [
        'gemini-1.5-flash',
        'gemini-1.5-pro', 
        'gemini-1.0-pro',
        'gemini-pro'
    ];
    
    for (const modelName of modelsToTest) {
        try {
            console.log(`Testing ${modelName}...`);
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: 'Hello!'
                        }]
                    }]
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ ${modelName} works! Response: ${data.candidates[0].content.parts[0].text}`);
                break;
            } else {
                const error = await response.text();
                console.log(`❌ ${modelName}: ${response.status} - ${error.substring(0, 100)}...`);
            }
        } catch (error) {
            console.log(`❌ ${modelName}: ${error.message}`);
        }
    }
}

testRestAPI();

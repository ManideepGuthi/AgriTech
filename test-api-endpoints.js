
async function testChat() {
    try {
        const response = await fetch('http://localhost:3001/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'What is the best time to plant wheat?' })
        });
        const data = await response.json();
        console.log('Chat Response:', data);
    } catch (error) {
        console.error('Chat Error:', error);
    }
}

async function testGovtSchemes() {
    try {
        const response = await fetch('http://localhost:3001/api/govt-schemes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        const data = await response.json();
        console.log('Govt Schemes Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Govt Schemes Error:', error);
    }
}

async function testLandAnalysis() {
    try {
        const response = await fetch('http://localhost:3001/api/land-analysis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                soilType: "Red Soil",
                ph: "6.5",
                location: "Karnataka",
                size: "5",
                waterSource: "Well"
            })
        });
        const data = await response.json();
        console.log('Land Analysis Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Land Analysis Error:', error);
    }
}

async function testYieldEstimate() {
    try {
        const response = await fetch('http://localhost:3001/api/yield-estimate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                crop: "Ragi",
                area: "2"
            })
        });
        const data = await response.json();
        console.log('Yield Estimate Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Yield Estimate Error:', error);
    }
}

async function testAnalyzeImage() {
    try {
        // A 5x5 red pixel base64 (larger than 1x1 to satisfy model requirements)
        const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
        const response = await fetch('http://localhost:3001/api/analyze-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: base64Image,
                lang: "en"
            })
        });
        const data = await response.json();
        console.log('Analyze Image Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Analyze Image Error:', error);
    }
}

async function testScansCRUD() {
    const userId = "test-user-123";
    const scanData = {
        userId: userId,
        diagnosis: "Healthy Crop",
        confidence: 0.95,
        symptoms: [],
        treatment: [],
        timestamp: Date.now()
    };

    console.log("Testing Scans CRUD...");
    try {
        const createRes = await fetch('http://localhost:3001/api/scans', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scanData)
        });
        if (!createRes.ok) throw new Error(await createRes.text());
        const createdScan = await createRes.json();
        console.log('Created Scan:', JSON.stringify(createdScan, null, 2));

        const listRes = await fetch(`http://localhost:3001/api/scans?userId=${userId}`);
        if (!listRes.ok) throw new Error(await listRes.text());
        const scans = await listRes.json();
        console.log(`User Scans (Found ${scans.length}):`, JSON.stringify(scans[0], null, 2));
    } catch (error) {
        console.error('Scans CRUD Error:', error);
    }
}

async function runTests() {
    console.log('Testing Chat API...');
    await testChat();
    console.log('\nTesting Govt Schemes API...');
    await testGovtSchemes();
    console.log('\nTesting Land Analysis API...');
    await testLandAnalysis();
    console.log('\nTesting Yield Estimate API...');
    await testYieldEstimate();
    console.log('\nTesting Analyze Image API...');
    await testAnalyzeImage();
    console.log('\nTesting Scans CRUD...');
    await testScansCRUD();
}

runTests();

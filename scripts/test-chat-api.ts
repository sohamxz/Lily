async function testChatApi() {
  const url = 'http://localhost:3001/api/chat';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'How much vacation do I have?' }]
      })
    });

    if (response.status !== 200) {
        console.error('❌ API Error: ' + response.status + ' ' + response.statusText);
        const text = await response.text();
        console.error(text);
        process.exit(1);
    }

    console.log("✅ API Status 200 OK");
    
    // @ts-ignore
    for await (const chunk of response.body) {
         console.log("✅ Received chunk:", chunk.toString().substring(0, 50) + "...");
         break; // Just verify one chunk
    }

  } catch (error) {
    console.error("❌ Test Failed:", error);
    process.exit(1);
  }
}

testChatApi();

import { orgChartService } from '../services/org-chart';

async function testOrgChart() {
  console.log("🧪 Starting OrgChart Verification...");
  
  try {
    const { nodes, edges } = await orgChartService.getGraphData();
    
    if (!nodes || nodes.length === 0) throw new Error("Nodes missing");
    if (!edges || edges.length === 0) throw new Error("Edges missing");
    
    // Check specific node structure
    const rootNode = nodes.find(n => n.id === '1');
    if (!rootNode || rootNode.position.y !== 0) throw new Error("Root node invalid");

    console.log(`✅ Graph Generated: ${nodes.length} nodes, ${edges.length} edges`);
  } catch (error) {
    console.error("❌ Verification Failed:", error);
    process.exit(1);
  }
}

testOrgChart();

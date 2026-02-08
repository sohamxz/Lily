// Mock Data for Org Chart
// In a real app, this would query the 'users' table recursively or via CTE.

interface UserNode {
  id: string;
  name: string;
  role: string;
  img: string;
  managerId?: string;
}

const MOCK_USERS: UserNode[] = [
  { id: '1', name: 'Sarah Connor', role: 'VP of Engineering', img: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Kyle Reese', role: 'Engineering Manager', img: 'https://i.pravatar.cc/150?u=2', managerId: '1' },
  { id: '3', name: 'T-800', role: 'Staff Engineer', img: 'https://i.pravatar.cc/150?u=3', managerId: '1' },
  { id: '4', name: 'John Connor', role: 'Senior Frontend', img: 'https://i.pravatar.cc/150?u=4', managerId: '2' },
  { id: '5', name: 'Cameron Phillips', role: 'Backend Engineer', img: 'https://i.pravatar.cc/150?u=5', managerId: '2' },
];

export class OrgChartService {
  async getGraphData() {
    // Simulate latency
    await new Promise(resolve => setTimeout(resolve, 300));

    // Convert flat list to React Flow Nodes & Edges
    const nodes = MOCK_USERS.map((user) => ({
      id: user.id,
      type: 'custom',
      data: { label: user.name, role: user.role, img: user.img },
      // Simple layout logic for mock purposes (tree structure)
      position: this.calculatePosition(user),
    }));

    const edges = MOCK_USERS
      .filter(user => user.managerId)
      .map(user => ({
        id: `e${user.managerId}-${user.id}`,
        source: user.managerId!,
        target: user.id,
      }));

    return { nodes, edges };
  }

  private calculatePosition(user: UserNode) {
    // Very basic static layouting based on ID/Hierarchy for demo
    // Real app would use dagre or elkjs
    if (!user.managerId) return { x: 250, y: 0 }; // Root
    if (user.managerId === '1') {
        if (user.id === '2') return { x: 100, y: 150 };
        if (user.id === '3') return { x: 400, y: 150 };
    }
    if (user.managerId === '2') {
        if (user.id === '4') return { x: 0, y: 300 };
        if (user.id === '5') return { x: 200, y: 300 };
    }
    return { x: 0, y: 0 };
  }
}

export const orgChartService = new OrgChartService();

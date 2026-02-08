
import { v4 as uuidv4 } from 'uuid';

// Mock Events
let events: any[] = [];

// We need access to Users and Candidates to simulate updates.
// Since those are in other service files (which use local variables), 
// we should ideally export/import them or use a shared store.
// For this Mock architecture, we will simulate "Remote Procedure Calls" to other services 
// or just maintain a local mock state that "pretends" to be the DB.
// To keep it simple, we will mock the "User Update" by just logging an event, 
// and in a real app this would transactionally update the User table.

export async function promoteUser(userId: string, newTitle: string, newSalary: number, reason: string) {
    // 1. Create Event
    const event = {
        id: crypto.randomUUID(),
        userId,
        type: 'promote',
        previousValue: { title: 'Old Title', salary: 100000 }, // Mock
        newValue: { title: newTitle, salary: newSalary },
        effectiveDate: new Date().toISOString(),
        reason,
        createdAt: new Date().toISOString(),
    };
    events.push(event);

    // 2. Update User (Mocked - we assume user service handles this)
    // console.log(`User ${userId} promoted to ${newTitle}`);
    
    return event;
}

export async function terminateUser(userId: string, reason: string) {
    const event = {
        id: crypto.randomUUID(),
        userId,
        type: 'terminate',
        previousValue: { status: 'active' },
        newValue: { status: 'terminated' },
        effectiveDate: new Date().toISOString(),
        reason,
        createdAt: new Date().toISOString(),
    };
    events.push(event);
    return event;
}

export async function getLifecycleEvents(userId: string) {
    return events.filter(e => e.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

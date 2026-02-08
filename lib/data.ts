export const MOCK_USERS = [
  { id: '1', name: "Alice Johnson", role: "Manager", status: 'online', mood: 80 },
  { id: '2', name: "Bob Smith", role: "Engineer", status: 'in-meeting', mood: 60 },
  { id: '3', name: "Charlie Davis", role: "Designer", status: 'online', mood: 90 },
  { id: '4', name: "David Wilson", role: "Engineer", status: 'offline', mood: 40 },
  { id: '5', name: "Eve Brown", role: "Product Owner", status: 'online', mood: 75 },
]

export const MOCK_ACTION_ITEMS = [
  { id: 1, title: "Expense Approval", subtitle: "Alice Johnson", type: 'approval', content: ",200 - MacBook Pro" },
  { id: 2, title: "Time Off Request", subtitle: "Bob Smith", type: 'approval', content: "Mar 10 - Mar 15 (Vacation)" },
  { id: 3, title: "Performance Review", subtitle: "Q1 Cycle", type: 'review', content: "Self-review due in 2 days" },
]

export const MOCK_TIME_OFF_BALANCES = {
  vacation: 12,
  sick: 5,
  personal: 2
}

export const MOCK_INSIGHTS_DATA = {
    burn_rate: [
        { month: 'Jan', amount: 4000 },
        { month: 'Feb', amount: 3000 },
        { month: 'Mar', amount: 2000 },
        { month: 'Apr', amount: 2780 },
        { month: 'May', amount: 1890 },
        { month: 'Jun', amount: 2390 },
        { month: 'Jul', amount: 3490 },
    ],
    attrition_risk: [
        { name: 'Engineering', risk: 85 },
        { name: 'Sales', risk: 45 },
        { name: 'Marketing', risk: 30 },
        { name: 'HR', risk: 10 },
        { name: 'Product', risk: 65 },
    ]
}

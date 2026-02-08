from playwright.sync_api import sync_playwright, expect

def run():
    print("Starting verification on http://localhost:3001")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Login first
        page.goto("http://localhost:3001/login")
        page.get_by_placeholder("Email address").fill("admin@flowstate.com")
        page.get_by_placeholder("Password").fill("password")
        page.get_by_role("button", name="Sign in").click()
        page.wait_for_url("http://localhost:3001/")
        print("Logged in")

        # Navigate to Expenses
        page.goto("http://localhost:3001/expenses")
        print("On Expenses Page")
        
        # Verify page loaded
        expect(page.get_by_role("heading", name="Expense Management")).to_be_visible(timeout=30000)
        
        # Verify List (Mock data)
        expect(page.get_by_text("Starbucks")).to_be_visible()
        expect(page.get_by_text("Uber")).to_be_visible()
        
        # Verify Approve Button
        expect(page.get_by_role("button", name="Approve").first).to_be_visible()

        # Take screenshot
        page.screenshot(path="verification/expenses.png", full_page=True)
        print("Screenshot saved to verification/expenses.png")

        browser.close()

if __name__ == "__main__":
    run()

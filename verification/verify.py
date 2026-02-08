from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Login Context
        context = browser.new_context()
        page = context.new_page()
        try:
            print("1. Testing Protected Route Redirect...")
            page.goto("http://localhost:3001/")
            page.wait_for_url("**/login")
            page.wait_for_selector("text=Sign in to FlowState")
            print("✅ Redirect to Login confirmed.")
            
            # Since we can't truly login without Supabase, we can try to navigate to /reviews directly
            # It should also redirect to login
            print("2. Testing Reviews Route Protection...")
            page.goto("http://localhost:3001/reviews")
            page.wait_for_url("**/login")
            print("✅ Reviews Route Protected.")

            # If we were to bypass auth (e.g. by mocking cookie in browser context), 
            # we could verify the review page rendering.
            # But the 'Zero Tolerance' protocol emphasizes verification of SECURITY too.
            
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_frontend()

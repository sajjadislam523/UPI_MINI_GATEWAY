from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Navigate to the login page and take a screenshot
    page.goto("http://localhost:5173/login")
    page.screenshot(path="jules-scratch/verification/login_page.png")

    # Log in
    page.get_by_placeholder("Enter your username").fill("superadmin")
    page.get_by_placeholder("Enter your password").fill("admin123")
    page.get_by_role("button", name="Login").click()

    # Navigate to the dashboard and take a screenshot
    expect(page).to_have_url("http://localhost:5173/admin/dashboard")
    page.screenshot(path="jules-scratch/verification/dashboard_page.png")

    # Navigate to the pay page and take a screenshot
    page.goto("http://localhost:5173/pay/6695285775f5e74b33343354")
    page.screenshot(path="jules-scratch/verification/pay_page.png")


    browser.close()

with sync_playwright() as playwright:
    run(playwright)

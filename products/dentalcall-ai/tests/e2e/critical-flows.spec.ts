import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("should display hero section with key value props", async ({ page }) => {
    await page.goto("/");

    // Hero is visible
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Never Miss Another Patient Call"
    );

    // Key stats are visible
    await expect(page.getByText("32%")).toBeVisible();
    await expect(page.getByText("$850+")).toBeVisible();
    await expect(page.getByText("93%")).toBeVisible();

    // CTA buttons are visible
    await expect(
      page.getByRole("link", { name: /Start Free 7-Day Trial/i })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /View Pricing/i })
    ).toBeVisible();
  });

  test("should display pricing section with 3 tiers", async ({ page }) => {
    await page.goto("/");

    // Scroll to pricing
    await page.getByRole("link", { name: /View Pricing/i }).click();

    // All 3 plans visible
    await expect(page.getByText("Starter")).toBeVisible();
    await expect(page.getByText("Professional")).toBeVisible();
    await expect(page.getByText("Business")).toBeVisible();

    // Prices visible
    await expect(page.getByText("$299")).toBeVisible();
    await expect(page.getByText("$599")).toBeVisible();
    await expect(page.getByText("$999")).toBeVisible();

    // Most popular badge
    await expect(page.getByText("Most Popular")).toBeVisible();
  });

  test("should navigate to signup from CTA", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /Start Free 7-Day Trial/i }).first().click();

    await expect(page).toHaveURL(/\/auth\/signup/);
    await expect(page.getByText("Start Your Free Trial")).toBeVisible();
  });
});

test.describe("Authentication", () => {
  test("signup page should have required fields", async ({ page }) => {
    await page.goto("/auth/signup");

    // Form fields present
    await expect(page.getByLabel("Practice Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();

    // Signup button
    await expect(
      page.getByRole("button", { name: /Start Free Trial/i })
    ).toBeVisible();

    // Google OAuth option
    await expect(
      page.getByRole("button", { name: /Continue with Google/i })
    ).toBeVisible();

    // Login link
    await expect(page.getByRole("link", { name: /Log in/i })).toBeVisible();
  });

  test("login page should have required fields", async ({ page }) => {
    await page.goto("/auth/login");

    // Form fields present
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();

    // Login button
    await expect(page.getByRole("button", { name: /Log In/i })).toBeVisible();

    // Forgot password link
    await expect(
      page.getByRole("link", { name: /Forgot password/i })
    ).toBeVisible();

    // Signup link
    await expect(
      page.getByRole("link", { name: /Start free trial/i })
    ).toBeVisible();
  });

  test("should show validation for empty form submission", async ({ page }) => {
    await page.goto("/auth/signup");

    // Try to submit empty form
    await page.getByRole("button", { name: /Start Free Trial/i }).click();

    // Browser validation should prevent submission
    // Check that we're still on the signup page
    await expect(page).toHaveURL(/\/auth\/signup/);
  });
});

test.describe("Navigation", () => {
  test("footer links should be present", async ({ page }) => {
    await page.goto("/");

    // Footer sections
    await expect(page.getByText("DentalCall AI").last()).toBeVisible();
    await expect(page.getByRole("link", { name: /Privacy Policy/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Terms of Service/i })).toBeVisible();
  });
});

test.describe("Responsive Design", () => {
  test("should be mobile responsive", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Hero should still be visible
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // CTA should be visible
    await expect(
      page.getByRole("link", { name: /Start Free 7-Day Trial/i })
    ).toBeVisible();
  });
});

test.describe("SEO", () => {
  test("should have proper meta tags", async ({ page }) => {
    await page.goto("/");

    // Title
    const title = await page.title();
    expect(title).toContain("DentalCall AI");

    // Meta description
    const metaDescription = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(metaDescription).toBeTruthy();
    expect(metaDescription).toContain("AI receptionist");
  });
});

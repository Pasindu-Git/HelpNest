# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: canteen-management\canteen.spec.js >> Canteen Management >> should display cart when opened
- Location: tests\canteen-management\canteen.spec.js:34:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="cart-modal"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[data-testid="cart-modal"]')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - navigation [ref=e4]:
      - generic [ref=e6]:
        - link "Campus Portal Student Hub" [ref=e7] [cursor=pointer]:
          - /url: /
          - img [ref=e9]
          - generic [ref=e12]:
            - heading "Campus Portal" [level=1] [ref=e13]
            - paragraph [ref=e14]: Student Hub
        - generic [ref=e15]:
          - link "Home" [ref=e16]:
            - /url: /
            - img [ref=e17]
            - text: Home
          - link "About Us" [ref=e20]:
            - /url: /about
            - img [ref=e21]
            - text: About Us
          - link "Study Sessions" [ref=e23]:
            - /url: /student-sessions
            - img [ref=e24]
            - text: Study Sessions
          - link "Slot Reservations" [ref=e26]:
            - /url: /slot-reservation
            - img [ref=e27]
            - text: Slot Reservations
          - link "Smart Canteen" [ref=e30]:
            - /url: /student-canteen
            - img [ref=e31]
            - text: Smart Canteen
          - link "Feedback" [ref=e33]:
            - /url: /feedbacks
            - img [ref=e34]
            - text: Feedback
        - generic [ref=e37]:
          - link "Login" [ref=e38]:
            - /url: /student-login
            - img [ref=e39]
            - text: Login
          - link "Register" [ref=e42]:
            - /url: /student-register
            - img [ref=e43]
            - text: Register
    - generic [ref=e46]:
      - generic [ref=e49]:
        - generic [ref=e50]:
          - img [ref=e52]
          - generic [ref=e55]:
            - heading "Campus Canteen" [level=1] [ref=e56]
            - paragraph [ref=e57]: Order delicious meals from your favorite canteen
        - generic [ref=e58]:
          - button "Cart" [ref=e59] [cursor=pointer]:
            - img [ref=e60]
            - generic [ref=e64]: Cart
          - button [ref=e65] [cursor=pointer]:
            - img [ref=e66]
      - generic [ref=e71]:
        - generic [ref=e72]:
          - button "All Items" [ref=e73] [cursor=pointer]:
            - img [ref=e74]
            - generic [ref=e77]: All Items
          - button "Main Course" [ref=e78] [cursor=pointer]:
            - img [ref=e79]
            - generic [ref=e85]: Main Course
          - button "Snacks" [ref=e86] [cursor=pointer]:
            - img [ref=e87]
            - generic [ref=e93]: Snacks
          - button "Beverages" [ref=e94] [cursor=pointer]:
            - img [ref=e95]
            - generic [ref=e97]: Beverages
          - button "Desserts" [ref=e98] [cursor=pointer]:
            - img [ref=e99]
            - generic [ref=e103]: Desserts
          - button "Healthy" [ref=e104] [cursor=pointer]:
            - img [ref=e105]
            - generic [ref=e108]: Healthy
        - generic [ref=e109]:
          - img [ref=e110]
          - textbox "Search for food items..." [ref=e113]
        - generic [ref=e114]:
          - img [ref=e115]
          - paragraph [ref=e118]: No items found
      - generic [ref=e120]:
        - generic [ref=e121]:
          - heading "Your Cart" [level=3] [ref=e122]
          - button [ref=e123] [cursor=pointer]:
            - img [ref=e124]
        - generic [ref=e129]:
          - img [ref=e130]
          - paragraph [ref=e134]: Your cart is empty
          - paragraph [ref=e135]: Add some delicious items!
  - contentinfo [ref=e136]:
    - generic [ref=e137]:
      - generic [ref=e138]:
        - generic [ref=e139]:
          - generic [ref=e140]:
            - img [ref=e142]
            - generic [ref=e145]:
              - heading "Campus Portal" [level=3] [ref=e146]
              - paragraph [ref=e147]: Student Hub
          - paragraph [ref=e148]: Your one-stop digital platform for managing study sessions, seat reservations, canteen orders, and feedback. Empowering students to excel in their academic journey.
          - generic [ref=e149]:
            - link [ref=e150]:
              - /url: https://facebook.com
              - img [ref=e151]
            - link [ref=e153]:
              - /url: https://twitter.com
              - img [ref=e154]
            - link [ref=e156]:
              - /url: https://instagram.com
              - img [ref=e157]
            - link [ref=e160]:
              - /url: https://linkedin.com
              - img [ref=e161]
            - link [ref=e165]:
              - /url: https://github.com
              - img [ref=e166]
        - generic [ref=e169]:
          - heading "Quick Links" [level=3] [ref=e170]:
            - img [ref=e171]
            - text: Quick Links
          - list [ref=e173]:
            - listitem [ref=e174]:
              - link "Home" [ref=e175]:
                - /url: /
                - img [ref=e176]
                - text: Home
            - listitem [ref=e179]:
              - link "About Us" [ref=e180]:
                - /url: /about
                - img [ref=e181]
                - text: About Us
            - listitem [ref=e183]:
              - link "Study Sessions" [ref=e184]:
                - /url: /student-registered-sessions
                - img [ref=e185]
                - text: Study Sessions
            - listitem [ref=e187]:
              - link "Slot Reservations" [ref=e188]:
                - /url: /slot-reservation
                - img [ref=e189]
                - text: Slot Reservations
            - listitem [ref=e192]:
              - link "Smart Canteen" [ref=e193]:
                - /url: /student-canteen
                - img [ref=e194]
                - text: Smart Canteen
            - listitem [ref=e196]:
              - link "Feedback" [ref=e197]:
                - /url: /feedbacks
                - img [ref=e198]
                - text: Feedback
        - generic [ref=e200]:
          - heading "Get in Touch" [level=3] [ref=e201]:
            - img [ref=e202]
            - text: Get in Touch
          - list [ref=e204]:
            - listitem [ref=e205]:
              - img [ref=e206]
              - generic [ref=e209]: 123 Campus Road, Colombo 07, Sri Lanka
            - listitem [ref=e210]:
              - img [ref=e211]
              - link "support@campusportal.com" [ref=e214]:
                - /url: mailto:support@campusportal.com
            - listitem [ref=e215]:
              - img [ref=e216]
              - link "+94 11 234 5678" [ref=e218]:
                - /url: tel:+94123456789
            - listitem [ref=e219]:
              - img [ref=e220]
              - generic [ref=e223]: "Mon - Fri: 8:00 AM - 6:00 PM"
      - generic [ref=e225]:
        - generic [ref=e226]:
          - heading "Stay Updated" [level=3] [ref=e227]:
            - img [ref=e228]
            - text: Stay Updated
          - paragraph [ref=e231]: Subscribe to our newsletter for updates on new sessions, events, and campus news.
        - generic [ref=e232]:
          - textbox "Enter your email" [ref=e233]
          - button "Subscribe" [ref=e234] [cursor=pointer]
      - generic [ref=e236]:
        - generic [ref=e237]:
          - generic [ref=e238]: © 2026 Campus Portal. All rights reserved.
          - generic [ref=e239]: •
          - link "Privacy Policy" [ref=e240]:
            - /url: /privacy
          - generic [ref=e241]: •
          - link "Terms of Service" [ref=e242]:
            - /url: /terms
          - generic [ref=e243]: •
          - link "Sitemap" [ref=e244]:
            - /url: /sitemap
        - generic [ref=e245]:
          - generic [ref=e246]: Made with
          - img [ref=e247]
          - generic [ref=e249]: for students
        - button "Back to Top" [ref=e250] [cursor=pointer]:
          - img [ref=e251]
          - text: Back to Top
```
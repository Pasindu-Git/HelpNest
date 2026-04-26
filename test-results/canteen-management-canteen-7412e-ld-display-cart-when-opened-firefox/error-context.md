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
          - generic [ref=e13]:
            - heading "Campus Portal" [level=1] [ref=e14]
            - paragraph [ref=e15]: Student Hub
        - generic [ref=e16]:
          - link "Home" [ref=e17] [cursor=pointer]:
            - /url: /
            - img [ref=e18]
            - text: Home
          - link "About Us" [ref=e21] [cursor=pointer]:
            - /url: /about
            - img [ref=e22]
            - text: About Us
          - link "Study Sessions" [ref=e26] [cursor=pointer]:
            - /url: /student-sessions
            - img [ref=e27]
            - text: Study Sessions
          - link "Slot Reservations" [ref=e30] [cursor=pointer]:
            - /url: /slot-reservation
            - img [ref=e31]
            - text: Slot Reservations
          - link "Smart Canteen" [ref=e36] [cursor=pointer]:
            - /url: /student-canteen
            - img [ref=e37]
            - text: Smart Canteen
          - link "Feedback" [ref=e42] [cursor=pointer]:
            - /url: /feedbacks
            - img [ref=e43]
            - text: Feedback
        - generic [ref=e46]:
          - link "Login" [ref=e47] [cursor=pointer]:
            - /url: /student-login
            - img [ref=e48]
            - text: Login
          - link "Register" [ref=e52] [cursor=pointer]:
            - /url: /student-register
            - img [ref=e53]
            - text: Register
    - generic [ref=e58]:
      - generic [ref=e61]:
        - generic [ref=e62]:
          - img [ref=e64]
          - generic [ref=e68]:
            - heading "Campus Canteen" [level=1] [ref=e69]
            - paragraph [ref=e70]: Order delicious meals from your favorite canteen
        - generic [ref=e71]:
          - button "Cart" [active] [ref=e72] [cursor=pointer]:
            - img [ref=e73]
            - generic [ref=e77]: Cart
          - button [ref=e78] [cursor=pointer]:
            - img [ref=e79]
      - generic [ref=e84]:
        - generic [ref=e85]:
          - button "All Items" [ref=e86] [cursor=pointer]:
            - img [ref=e87]
            - generic [ref=e91]: All Items
          - button "Main Course" [ref=e92] [cursor=pointer]:
            - img [ref=e93]
            - generic [ref=e99]: Main Course
          - button "Snacks" [ref=e100] [cursor=pointer]:
            - img [ref=e101]
            - generic [ref=e107]: Snacks
          - button "Beverages" [ref=e108] [cursor=pointer]:
            - img [ref=e109]
            - generic [ref=e114]: Beverages
          - button "Desserts" [ref=e115] [cursor=pointer]:
            - img [ref=e116]
            - generic [ref=e120]: Desserts
          - button "Healthy" [ref=e121] [cursor=pointer]:
            - img [ref=e122]
            - generic [ref=e125]: Healthy
        - generic [ref=e126]:
          - img [ref=e127]
          - textbox "Search for food items..." [ref=e130]
        - generic [ref=e131]:
          - img [ref=e132]
          - paragraph [ref=e136]: No items found
      - generic [ref=e138]:
        - generic [ref=e139]:
          - heading "Your Cart" [level=3] [ref=e140]
          - button [ref=e141] [cursor=pointer]:
            - img [ref=e142]
        - generic [ref=e147]:
          - img [ref=e148]
          - paragraph [ref=e152]: Your cart is empty
          - paragraph [ref=e153]: Add some delicious items!
  - contentinfo [ref=e154]:
    - generic [ref=e155]:
      - generic [ref=e156]:
        - generic [ref=e157]:
          - generic [ref=e158]:
            - img [ref=e160]
            - generic [ref=e164]:
              - heading "Campus Portal" [level=3] [ref=e165]
              - paragraph [ref=e166]: Student Hub
          - paragraph [ref=e167]: Your one-stop digital platform for managing study sessions, seat reservations, canteen orders, and feedback. Empowering students to excel in their academic journey.
          - generic [ref=e168]:
            - link [ref=e169] [cursor=pointer]:
              - /url: https://facebook.com
              - img [ref=e170]
            - link [ref=e172] [cursor=pointer]:
              - /url: https://twitter.com
              - img [ref=e173]
            - link [ref=e175] [cursor=pointer]:
              - /url: https://instagram.com
              - img [ref=e176]
            - link [ref=e180] [cursor=pointer]:
              - /url: https://linkedin.com
              - img [ref=e181]
            - link [ref=e185] [cursor=pointer]:
              - /url: https://github.com
              - img [ref=e186]
        - generic [ref=e189]:
          - heading "Quick Links" [level=3] [ref=e190]:
            - img [ref=e191]
            - text: Quick Links
          - list [ref=e193]:
            - listitem [ref=e194]:
              - link "Home" [ref=e195] [cursor=pointer]:
                - /url: /
                - img [ref=e196]
                - text: Home
            - listitem [ref=e199]:
              - link "About Us" [ref=e200] [cursor=pointer]:
                - /url: /about
                - img [ref=e201]
                - text: About Us
            - listitem [ref=e205]:
              - link "Study Sessions" [ref=e206] [cursor=pointer]:
                - /url: /student-registered-sessions
                - img [ref=e207]
                - text: Study Sessions
            - listitem [ref=e210]:
              - link "Slot Reservations" [ref=e211] [cursor=pointer]:
                - /url: /slot-reservation
                - img [ref=e212]
                - text: Slot Reservations
            - listitem [ref=e217]:
              - link "Smart Canteen" [ref=e218] [cursor=pointer]:
                - /url: /student-canteen
                - img [ref=e219]
                - text: Smart Canteen
            - listitem [ref=e224]:
              - link "Feedback" [ref=e225] [cursor=pointer]:
                - /url: /feedbacks
                - img [ref=e226]
                - text: Feedback
        - generic [ref=e228]:
          - heading "Get in Touch" [level=3] [ref=e229]:
            - img [ref=e230]
            - text: Get in Touch
          - list [ref=e232]:
            - listitem [ref=e233]:
              - img [ref=e234]
              - generic [ref=e237]: 123 Campus Road, Colombo 07, Sri Lanka
            - listitem [ref=e238]:
              - img [ref=e239]
              - link "support@campusportal.com" [ref=e242] [cursor=pointer]:
                - /url: mailto:support@campusportal.com
            - listitem [ref=e243]:
              - img [ref=e244]
              - link "+94 11 234 5678" [ref=e246] [cursor=pointer]:
                - /url: tel:+94123456789
            - listitem [ref=e247]:
              - img [ref=e248]
              - generic [ref=e251]: "Mon - Fri: 8:00 AM - 6:00 PM"
      - generic [ref=e253]:
        - generic [ref=e254]:
          - heading "Stay Updated" [level=3] [ref=e255]:
            - img [ref=e256]
            - text: Stay Updated
          - paragraph [ref=e261]: Subscribe to our newsletter for updates on new sessions, events, and campus news.
        - generic [ref=e262]:
          - textbox "Enter your email" [ref=e263]
          - button "Subscribe" [ref=e264] [cursor=pointer]
      - generic [ref=e266]:
        - generic [ref=e267]:
          - generic [ref=e268]: © 2026 Campus Portal. All rights reserved.
          - generic [ref=e269]: •
          - link "Privacy Policy" [ref=e270] [cursor=pointer]:
            - /url: /privacy
          - generic [ref=e271]: •
          - link "Terms of Service" [ref=e272] [cursor=pointer]:
            - /url: /terms
          - generic [ref=e273]: •
          - link "Sitemap" [ref=e274] [cursor=pointer]:
            - /url: /sitemap
        - generic [ref=e275]:
          - generic [ref=e276]: Made with
          - img [ref=e277]
          - generic [ref=e279]: for students
        - button "Back to Top" [ref=e280] [cursor=pointer]:
          - img [ref=e281]
          - text: Back to Top
```

<img width="1796" alt="Screenshot 2025-05-29 at 5 10 36 PM" src="https://github.com/user-attachments/assets/22ec0cb7-e646-4f70-8593-12fd11659a2e" />
<img width="1802" alt="Screenshot 2025-05-29 at 5 11 52 PM" src="https://github.com/user-attachments/assets/d9e714ed-b3cc-4a93-bb08-a7c29df7e2ad" />

How to start the server:

npx http-server -c-1 -p 8080


Notes:

-use the -c-1 parameter to disable the browser cache (using a value of -1)

-use p 8080 to specify the TCP port 8080


Go to chrome and load the page:

http://localhost:8080/

---

You can drag new albums into songs/Artist/Album/

Re-run node generatePlaylist.js

Your app picks them up automatically — no manual changes needed

Full nested support: two levels deep or more


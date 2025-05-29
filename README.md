
<img width="1706" alt="Screenshot 2025-05-28 at 5 51 08 PM" src="https://github.com/user-attachments/assets/8d363692-65c2-4c94-b7fa-fa85b43ebd54" />

<img width="1709" alt="Screenshot 2025-05-28 at 5 51 19 PM" src="https://github.com/user-attachments/assets/57b775d5-1e19-4cf8-a02c-c7e184a2e6a6" />

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


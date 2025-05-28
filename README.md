<img width="1326" alt="Screenshot 2025-05-27 at 9 34 40 PM" src="https://github.com/user-attachments/assets/7951a5d3-76ae-4519-ad9a-f0e8fbd84a72" />

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


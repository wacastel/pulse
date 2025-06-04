The audio player is hosted here:
https://pulse-visual-player.netlify.app

---

<img width="1405" alt="Screenshot 2025-06-03 at 5 07 56 PM" src="https://github.com/user-attachments/assets/00176c04-2c67-40e5-be94-dfa3aefb54f6" />

<img width="1413" alt="Screenshot 2025-06-03 at 5 08 27 PM" src="https://github.com/user-attachments/assets/fb8d53c1-a627-4f41-b3ae-e4c06ec6b9df" />

<img width="1410" alt="Screenshot 2025-06-03 at 5 08 46 PM" src="https://github.com/user-attachments/assets/7cb714bf-59cd-47e0-b5c4-ed445f41a8e7" />

<img width="1410" alt="Screenshot 2025-06-03 at 5 08 56 PM" src="https://github.com/user-attachments/assets/9fa541bf-6c13-4293-863a-e05b12bc705a" />

---

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


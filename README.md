# Reset Password and Verify Email Node Appwrite Backend

This is the simple backend that can be used to handle reset password and email verification for appwrite very easily.

## ⚠ For Using
- Add the Web Platform to your appwrite project
- Then make sure to replace with your **APPWRITE PROJECT ID**
with the `'<YOUR-PROJECT-ID>'` in `/controllers/auth_controller.js`.

## 🔥 All Endpoints 
|Method | Endpoint | Query | Usage
|:--- | :--- |:---|:---|
|GET| /  |  | Simple Home Page |
|POST| /verify| `userId, secret`| Email verification |
|GET| /recovery| `userId, secret`| Reset Password Page |
|POST| /reset_password| `userId, secret, password, password_confirm `| Reset Password |




## 💻 Tech Stack

**Server:** Node, Express

**Backend:** Appwrite

## 👨‍💻 Author : [@Snehasis4321](https://www.github.com/Snehasis4321)

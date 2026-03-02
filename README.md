# KeepCalmAndDoing

KeepCalmAndDoing là một ứng dụng quản lý và lập kế hoạch dự án thông minh được hỗ trợ bởi AI (Gemini API). Ứng dụng giúp người dùng chuyển đổi ý tưởng dự án thành một danh sách công việc chi tiết với mốc thời gian cụ thể, giúp bạn quản lý công việc một cách bình tĩnh và hiệu quả.

<img width="1229" height="783" alt="image" src="https://github.com/user-attachments/assets/c837aded-ed73-4e37-bb97-525296988d72" />

## 🚀 Chức năng chính

- **Lập kế hoạch bằng AI**: Sử dụng sức mạnh của Gemini AI để tự động phân tích ý tưởng dự án và tạo ra danh sách công việc (WBS - Work Breakdown Structure) chi tiết.
- **Đăng nhập thông minh**: Tích hợp **Google One Tap** và **Sign-in with Google** mới nhất, mang lại trải nghiệm đăng nhập mượt mà và an toàn.
- **Quản lý đa dự án**: Giao diện Sidebar hiện đại cho phép bạn chuyển đổi nhanh chóng giữa các dự án khác nhau.
- **Theo dõi tiến độ**: Thanh tiến độ trực quan và hệ thống tính toán tiến độ tự động dựa trên trạng thái của các công việc con.
- **Quản lý công việc phân cấp**:
  - Hỗ trợ công việc đa cấp (Sub-tasks).
  - Hệ thống trạng thái linh hoạt: *To Do, In Progress, Done, Blocked, Canceled*.
  - Tự động cập nhật trạng thái của công việc cha dựa trên các công việc con.
- **Đa ngôn ngữ**: Hỗ trợ đầy đủ Tiếng Anh và Tiếng Việt, chuyển đổi tức thì không cần tải lại trang.
- **Giao diện hiện đại (Crafted UI)**: Sử dụng Tailwind CSS với các hiệu ứng chuyển động mượt mà từ Framer Motion.

## 🛠 Công nghệ sử dụng

- **Frontend**: React 19, TypeScript, Vite.
- **Backend**: Sử dụng GO, được triển khai ở repo riêng.
- **Styling**: Tailwind CSS 4.0.
- **Animations**: Motion (Framer Motion).
- **Icons**: Lucide React.
- **AI Integration**: Google Gemini API (`@google/genai`).
- **Security**: Google Identity Services (GSI), JWT Authentication.

## 🔐 Bảo mật & Xác thực

Dự án được thiết kế với tiêu chuẩn bảo mật cao:
- **Client-side**: Sử dụng Google One Tap với cấu hình an toàn, xử lý tốt trong môi trường iframe.
- **Server-side**: Xác thực ID Token từ Google bằng thư viện chính thức, kiểm tra Audience (Client ID), Signature và Expiration.
- **Session**: Quản lý phiên làm việc thông qua JWT được lưu trữ trong HttpOnly Cookie.

## 🔄 CI/CD

Dự án tích hợp **GitHub Actions** để tự động kiểm tra chất lượng mã nguồn:
- **Workflow**: `.github/workflows/ci.yml`
- **Tự động chạy**: Khi có Pull Request open.
- **Các bước kiểm tra**:
  - Cài đặt dependencies.
  - Chạy `npm run lint` (TypeScript check).
  - Chạy `npm run build` (Vite build).

## ⚙️ Cấu hình môi trường

Để ứng dụng hoạt động đầy đủ, bạn cần cấu hình các biến môi trường trong file `.env`:

```env
# Google Cloud Console Client ID
VITE_GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"

# Gemini API Key (Dùng cho tính năng lập kế hoạch AI)
GEMINI_API_KEY="your-gemini-api-key"

# API Base URL
VITE_API_BASE_URL="http://localhost:3000"
```

## 📏 Quy tắc phát triển

- **Giao diện**: Luôn ưu tiên trải nghiệm người dùng (UX), sử dụng `cursor: pointer` cho tất cả các thành phần tương tác.
- **I18n**: Tất cả nội dung văn bản phải được định nghĩa trong `LanguageContext` để hỗ trợ đa ngôn ngữ.
- **Type Safety**: Sử dụng TypeScript nghiêm ngặt cho toàn bộ các interface dữ liệu (User, Task, Project).
- **Clean Code**: Tách biệt rõ ràng giữa logic API (`src/api`), Logic nghiệp vụ (`src/contexts`) và Giao diện (`src/components`).

## ✍️ Tác giả

- **Author**: Nhan Ho Van (nhanhv.qt@gmail.com)

---

*Keep Calm and Start Doing!*

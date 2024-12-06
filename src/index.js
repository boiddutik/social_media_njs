import { app } from "./app.js";
import connectDB from "./db/index.js";

console.log("**********************************************************************")
// console.log("Loaded PORT:", process.env.PORT);

const PORT = process.env.PORT || 8001;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at port ${PORT}`)
        console.log("**********************************************************************")
    });
}).catch((err) => {
    console.log(`MongoDB connection error: ${err}`)
})

// ### **1. Notifications System**
// - **Purpose**: Inform users about follow requests, accepted requests, new followers, etc.
// - **Endpoints to Consider**:
//   - `GET /api/v1/notifications` - Fetch a list of notifications.
//   - `POST /api/v1/notifications/mark-as-read` - Mark notifications as read.
//   - `DELETE /api/v1/notifications/:id` - Delete a notification.

// ---

// ### **2. Enhanced Search**
// - Add filters for location, interests, or other profile fields.
// - Pagination and sorting support for large search results.
// - `GET /api/v1/profiles/search` with advanced query options (e.g., `?location=USA&interest=coding`).

// ---

// ### **3. Privacy Settings**
// - Enable granular privacy options for profiles:
//   - Public vs. private.
//   - Visible to friends only.
// - **Endpoints**:
//   - `PATCH /api/v1/profile/privacy` - Update privacy settings.
//   - Add middleware to restrict access based on these settings.

// ---

// ### **4. Analytics**
// - Track and provide users with metrics:
//   - Number of followers, followings, blocks, etc.
//   - Account activity (e.g., "X people viewed your profile").
// - **Endpoints**:
//   - `GET /api/v1/profile/analytics` - Fetch analytics data.

// ---

// ### **5. Profile Media Management**
// - Add multiple avatars/covers and enable galleries.
// - **Endpoints**:
//   - `POST /api/v1/profile/media` - Upload new media.
//   - `DELETE /api/v1/profile/media/:mediaId` - Remove specific media.

// ---

// ### **6. Friendships (Bidirectional Relationships)**
// - A step beyond following—add "friendship" functionality.
// - **Endpoints**:
//   - `POST /api/v1/profile/friends/:id` - Send a friend request.
//   - `POST /api/v1/profile/friends/accept` - Accept a friend request.
//   - `DELETE /api/v1/profile/friends/:id` - Remove a friend.

// ---

// ### **7. Admin Features**
// - Moderation tools for reports and violations.
// - Admin overrides for user accounts (e.g., ban, deactivate).
// - **Endpoints**:
//   - `GET /api/v1/admin/reports` - View reported users/profiles.
//   - `PATCH /api/v1/admin/users/:id` - Modify user status.

// ---

// ### **8. Activity Feed**
// - Show recent activities (e.g., "X followed Y", "Z updated their profile").
// - **Endpoints**:
//   - `GET /api/v1/profile/activity-feed` - Fetch recent activity for the user.

// ---

// ### **9. Multi-Language Support**
// - Add localization options for user profiles.

// ---

// ### **10. Security and Enhancements**
// - Add rate limiting, request validation, and auditing.
// - Use services like AWS S3 or Cloudinary for media storage.

// ---

// Let’s decide which of these to build next, or refine something you already have.
# Social Network DRF

A responsive single-page social media application that allows users to create profiles, publish posts with images, follow other users, and engage in real-time WebSocket-based chat. The user interface is modern, clean, and intuitive, with Vuetify providing a consistent look and feel across all pages. Custom CSS adds additional styling and interactivity.

### Live Demo on Firebase: <https://karnaukh-vue-test.web.app/social/home>

![Social Network screenshot](https://github.com/SerhiiKarnaukh/vue-test-manager/blob/main/src/views/social/social_network_main.jpg)

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Pages and Routes](#pages-and-routes)
- [Architecture](#architecture)
- [Components](#components)
- [State Management](#state-management)
- [API Endpoints](#api-endpoints)
- [WebSocket Integration](#websocket-integration)
- [Authentication](#authentication)
- [Related Folders](#related-folders)
- [Backend](#backend)

## Overview

The frontend is built using **Vue.js 3**, a popular JavaScript framework that simplifies the development of complex user interfaces. Navigation is managed by **Vue Router**, allowing seamless transitions between pages, while **Vuex** handles state management to ensure the frontend stays in sync with the backend API. The interface is built around a material design aesthetic using **Vuetify 3** components.

On the home page, users can see recent posts from users they follow and search for other users by username to follow them. The post creation page allows users to enter text content and attach images, with form validation implemented using **Vuelidate**. The user profile page displays profile information such as username, email, and follower count, with options to edit profile details.

One key feature of the platform is its **WebSocket-based chat**, enabling users to communicate in real-time. Additionally, **JWT** is used for authentication, ensuring secure access to user-specific resources and actions. Overall, the platform provides a powerful, modern, and intuitive interface for seamless interaction with the backend API, facilitating profile creation, messaging, following, and chat.

## Key Features

- **Posts feed** -- Infinite-scrolling feed of posts from followed users, with like and comment support.
- **Post creation** -- Authenticated users can write posts with text and multiple image attachments, with public/private visibility toggle.
- **Comments** -- Users can comment on individual posts with a dedicated comment form.
- **User profiles** -- Profile cards showing avatar, full name, friends count, posts count, and an editable profile form.
- **Friend system** -- Send, accept, or reject friendship requests; view friends list and friend suggestions ("People You May Know").
- **Real-time chat** -- WebSocket-powered private messaging with conversation list, message history, and active conversation switching.
- **Real-time notifications** -- WebSocket-delivered notifications for likes, comments, chat messages, and friend requests, with unread badge count.
- **Trends** -- Trending hashtags displayed in a sidebar, with filterable post lists per trend.
- **Search** -- Combined search across users and posts with infinite scroll pagination.
- **JWT authentication** -- Secure login/signup with Vuelidate form validation, password visibility toggle, and protected route guards.
- **Profile management** -- Edit username, name, email, avatar upload, and password change.
- **Theme toggling** -- Light/dark theme switching via Vuetify's theme system.
- **Responsive navigation** -- Collapsible drawer menu on mobile, full navbar with avatar on desktop.

## Pages and Routes

| Route                               | View                     | Auth | Description                                  |
| ----------------------------------- | ------------------------ | ---- | -------------------------------------------- |
| `/social/home`                      | `HomeView.vue`           | No   | Posts feed with create form and sidebar       |
| `/social/profile/:slug`             | `ProfileView.vue`        | No   | User profile with posts and actions           |
| `/social/profile/edit`              | `EditProfileView.vue`    | Yes  | Edit profile details and avatar               |
| `/social/profile/:slug/friends`     | `FriendsView.vue`        | Yes  | Friends list and pending requests             |
| `/social/:id`                       | `PostView.vue`           | No   | Single post detail with comments              |
| `/social/trends/:id`               | `TrendView.vue`          | No   | Posts filtered by trending hashtag            |
| `/social/chat`                      | `ChatView.vue`           | Yes  | Real-time private messaging                   |
| `/social/notifications`             | `NotificationsView.vue`  | Yes  | Unread notifications list                     |
| `/social/search`                    | `SearchView.vue`         | No   | Search users and posts                        |
| `/social/signup`                    | `SignupView.vue`         | No   | Account registration form                     |
| `/social/login`                     | `LoginView.vue`          | No   | Login form with redirect support              |
| `/social/edit/password`             | `EditPasswordView.vue`   | Yes  | Change password form                          |

All routes use the `MainSocialLayout` layout with `TheNavbar` and `TheFooter`.

## Architecture

```
src/
├── views/social/
│   ├── HomeView.vue              # Posts feed (infinite scroll)
│   ├── ProfileView.vue           # User profile + posts
│   ├── EditProfileView.vue       # Edit profile form
│   ├── FriendsView.vue           # Friends list + requests
│   ├── PostView.vue              # Single post + comments
│   ├── TrendView.vue             # Trend-filtered posts
│   ├── ChatView.vue              # Real-time chat
│   ├── NotificationsView.vue     # Notifications center
│   ├── SearchView.vue            # Combined user/post search
│   ├── SignupView.vue            # Registration form
│   ├── LoginView.vue             # Login form
│   └── EditPasswordView.vue      # Password change form
├── components/social/
│   ├── TheNavbar.vue             # Navigation bar with auth-aware links
│   ├── TheFooter.vue             # Footer
│   ├── TheCreatePostForm.vue     # Post creation with image upload
│   ├── TheSocialPostCard.vue     # Post card (like, comment, report, delete)
│   ├── TheCommentItem.vue        # Single comment display
│   ├── ThePeopleYouMayKnow.vue   # Friend suggestions sidebar widget
│   └── TheTrends.vue             # Trending hashtags sidebar widget
├── layouts/social/
│   └── MainSocialLayout.vue      # Layout wrapper (navbar + footer)
└── store/modules/socialNetworkData/
    ├── socialPostData.module.js         # Posts, search, trends state
    ├── socialProfileData.module.js      # User profile, friends state
    ├── socialChatData.module.js         # Chat conversations, WebSocket
    └── socialNotificationData.module.js # Notifications, WebSocket
```

## Components

### TheNavbar

Responsive navigation bar that adapts based on authentication state:
- **Unauthenticated:** Shows Login and Signup buttons.
- **Authenticated:** Shows Chat, Logout, Notifications badge (unread count), user avatar, and profile link.
- Always shows: Home, Apps Manager dropdown, Search, and Toggle Theme.
- Mobile: Collapsible navigation drawer.

### TheCreatePostForm

Post creation form available to authenticated users. Supports:
- Text input via textarea.
- Multiple image attachments (JPEG/PNG) with preview thumbnails.
- Public/private visibility toggle checkbox.

### TheSocialPostCard

Reusable post card component displaying:
- Author avatar, name (linked to profile), and timestamp.
- Post body text and image attachments.
- Like button with count, comment link with count, and private indicator.
- Context menu with "Report Post" (for others' posts) or "Delete Post" (for own posts).

### ThePeopleYouMayKnow

Sidebar widget showing friend suggestions fetched from the API. Displays avatar, name, and friend/post counts for each suggested user.

### TheTrends

Sidebar widget displaying trending hashtags fetched from `/api/social-posts/trends/`. Each trend links to a filtered post list.

### TheCommentItem

Displays a single comment with the author's avatar, name, body text, and timestamp.

## State Management

The Social Network uses four namespaced Vuex store modules:

### socialPostData

Manages all post-related state including feeds, profiles, search, and trends.

| State Property           | Type     | Description                                |
| ------------------------ | -------- | ------------------------------------------ |
| `postList`               | `Array`  | Home feed posts                            |
| `profilePostList`        | `Array`  | Posts on a specific profile                |
| `post`                   | `Object` | Single post detail (with comments)         |
| `profile`                | `Object` | Viewed user profile data                   |
| `searchPosts`            | `Array`  | Search results (posts)                     |
| `searchProfiles`         | `Object` | Search results (user profiles)             |
| `trends`                 | `Array`  | Trending hashtags                          |
| `trendPosts`             | `Array`  | Posts filtered by trend                    |
| `postImages`             | `Array`  | Selected images for new post               |
| `canSendFriendshipRequest` | `Boolean` | Whether friend request is allowed        |
| `postsNextPage`          | `String` | Next page URL for feed pagination          |
| `profilePostListNextPage`| `String` | Next page URL for profile posts            |
| `searchNextPage`         | `String` | Next page URL for search results           |
| `trendNextPage`          | `String` | Next page URL for trend posts              |

### socialProfileData

Manages user profile, friends, and friendship requests. Stores user data encrypted in localStorage via CryptoJS.

| State Property           | Type     | Description                                |
| ------------------------ | -------- | ------------------------------------------ |
| `user`                   | `Object` | Current authenticated user info            |
| `currentProfile`         | `Object` | Profile being viewed in friends page       |
| `friendshipRequests`     | `Array`  | Pending incoming friend requests           |
| `currentProfileFriends`  | `Array`  | Friends of the viewed profile              |
| `friendSuggestions`      | `Array`  | "People You May Know" suggestions          |

### socialChatData

Manages conversations, active conversation, and WebSocket connection for real-time messaging.

| State Property           | Type        | Description                             |
| ------------------------ | ----------- | --------------------------------------- |
| `conversations`          | `Array`     | List of user's conversations            |
| `activeConversation`     | `Object`    | Currently selected conversation + messages |
| `chatWebSocket`          | `WebSocket` | Active chat WebSocket connection        |

### socialNotificationData

Manages notifications and a dedicated WebSocket for real-time notification delivery.

| State Property           | Type        | Description                             |
| ------------------------ | ----------- | --------------------------------------- |
| `notifications`          | `Array`     | Unread notifications list               |
| `unreadCount`            | `Number`    | Badge count for unread notifications    |
| `notificationWebSocket`  | `WebSocket` | Notification WebSocket connection       |

## API Endpoints

### Posts

| Method | Endpoint                                 | Purpose                           |
| ------ | ---------------------------------------- | --------------------------------- |
| GET    | `/api/social-posts/`                     | Get paginated feed posts          |
| POST   | `/api/social-posts/create/`              | Create a new post with images     |
| GET    | `/api/social-posts/:id/`                 | Get single post with comments     |
| POST   | `/api/social-posts/:id/comment/`         | Add a comment to a post           |
| POST   | `/api/social-posts/:id/like/`            | Like a post                       |
| POST   | `/api/social-posts/:id/report/`          | Report a post                     |
| DELETE | `/api/social-posts/:id/delete/`          | Delete own post                   |
| GET    | `/api/social-posts/profile/:slug/`       | Get profile data + posts          |
| POST   | `/api/social-posts/search/`              | Search posts and users            |
| GET    | `/api/social-posts/trends/`              | Get trending hashtags             |
| GET    | `/api/social-posts/?trend=:id`           | Get posts by trend                |

### Profiles

| Method | Endpoint                                           | Purpose                        |
| ------ | -------------------------------------------------- | ------------------------------ |
| GET    | `/api/social-profiles/me/`                         | Get current user data          |
| POST   | `/api/social-profiles/editprofile/`                | Update profile details + avatar|
| POST   | `/api/social-profiles/editpassword/`               | Change password                |
| GET    | `/api/social-profiles/friends/:slug/`              | Get friends + requests         |
| POST   | `/api/social-profiles/friends/:slug/request/`      | Send friend request            |
| POST   | `/api/social-profiles/friends/:slug/:status/`      | Accept/reject friend request   |
| GET    | `/api/social-profiles/friends/suggested/`           | Get friend suggestions         |

### Chat

| Method | Endpoint                                    | Purpose                        |
| ------ | ------------------------------------------- | ------------------------------ |
| GET    | `/api/social-chat/`                         | Get all conversations          |
| GET    | `/api/social-chat/:id/`                     | Get conversation messages      |
| POST   | `/api/social-chat/:id/send/`                | Send a chat message            |
| GET    | `/api/social-chat/:slug/get-or-create/`     | Get or create a conversation   |

### Notifications

| Method | Endpoint                                    | Purpose                        |
| ------ | ------------------------------------------- | ------------------------------ |
| GET    | `/api/social-notifications/`                | Get unread notifications       |
| POST   | `/api/social-notifications/read/:id/`       | Mark notification as read      |

## WebSocket Integration

The Social Network uses two independent WebSocket connections:

### Chat WebSocket

Established when a user selects a conversation in the chat view.

- **URL:** `ws(s)://<backend-domain>/ws/social-chat/<conversationId>/<userId>/`
- Messages arrive in real-time and are pushed directly into the active conversation's message list.
- The connection is disconnected when switching conversations or navigating away from the chat page.

### Notification WebSocket

Established on login and maintained throughout the session.

- **URL:** `ws(s)://<backend-domain>/ws/notification/<userId>/`
- When a notification event is received, the full notification list is re-fetched and the unread count is updated in the navbar badge.
- The connection is disconnected on logout.

## Authentication

The platform uses **JWT (JSON Web Token)** authentication via the shared `authJWT` Vuex module:

1. **Signup** -- Registers a new user with username, first name, last name, email, and password (validated with Vuelidate). Uses the `authToken` module for registration.
2. **Login** -- Authenticates with email and password. On success, fetches user data, loads notifications, and establishes the notification WebSocket.
3. **Route guards** -- Routes with `meta.authJWT: true` redirect unauthenticated users to the login page with a message.
4. **Logout** -- Clears JWT tokens, resets profile state, disconnects the notification WebSocket, and redirects to login.
5. **Encrypted storage** -- User profile data is persisted in localStorage encrypted with CryptoJS for security.

## Related Folders

- [Social Network Components](https://github.com/SerhiiKarnaukh/vue-test-manager/tree/main/src/components/social)
- [Social Network Vuex Store](https://github.com/SerhiiKarnaukh/vue-test-manager/tree/main/src/store/modules/socialNetworkData)

## Backend

The Django REST Framework backend powering the Social Network is hosted on AWS.

See [Social Network Backend](https://django.karnaukh-webdev.com/category/django/social-network-drf/)

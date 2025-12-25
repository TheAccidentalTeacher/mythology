# 📡 API REFERENCE

**Complete API documentation for Mythology Builder Platform**

---

## 🎯 API OVERVIEW

**Base URL:** `https://your-app.vercel.app/api`  
**Authentication:** Session-based (Supabase Auth)  
**Format:** JSON  
**Rate Limiting:** 100 requests per minute per IP

---

## 🔐 AUTHENTICATION ENDPOINTS

### **POST /api/auth/signup**

Create new student or teacher account.

**Request:**
```json
{
  "email": "student@school.edu",
  "password": "SecurePass123!",
  "full_name": "Jane Doe",
  "role": "student",
  "join_code": "ABC123",  // Required for students
  "grade_level": 7        // Required for students
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "student@school.edu",
    "role": "student"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

**Errors:**
- `400` - Invalid join code, email already exists
- `422` - Validation error

---

### **POST /api/auth/login**

Authenticate existing user.

**Request:**
```json
{
  "email": "student@school.edu",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "user": { ... },
  "session": { ... }
}
```

**Errors:**
- `401` - Invalid credentials

---

### **POST /api/auth/logout**

End user session.

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## 🏛️ MYTHOLOGY ENDPOINTS

### **GET /api/mythologies**

Get all mythologies (filtered by visibility and permissions).

**Query Parameters:**
- `type` - Filter by mythology_type (greek, norse, etc.)
- `visibility` - Filter by visibility (public, classroom, private)
- `created_by` - Filter by creator user ID
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

**Response (200):**
```json
{
  "mythologies": [
    {
      "id": "uuid",
      "name": "My Epic Mythology",
      "description": "A world of magic...",
      "mythology_type": "fantasy",
      "created_by": "uuid",
      "creator_name": "Jane Doe",
      "visibility": "classroom",
      "cover_image_url": "https://...",
      "created_at": "2025-01-01T00:00:00Z",
      "character_count": 5,
      "creature_count": 3,
      "story_count": 2
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "total_pages": 3
  }
}
```

---

### **POST /api/mythologies**

Create new mythology.

**Request:**
```json
{
  "name": "My Epic Mythology",
  "description": "A world of magic and wonder",
  "mythology_type": "fantasy",
  "geography": "islands",
  "visibility": "classroom"
}
```

**Response (201):**
```json
{
  "mythology": {
    "id": "uuid",
    "name": "My Epic Mythology",
    ...
  },
  "points_awarded": 25
}
```

**Errors:**
- `400` - Content moderation failed
- `401` - Not authenticated
- `422` - Validation error

---

### **GET /api/mythologies/:id**

Get single mythology with full details.

**Response (200):**
```json
{
  "mythology": {
    "id": "uuid",
    "name": "My Epic Mythology",
    "description": "...",
    "characters": [...],
    "creatures": [...],
    "stories": [...],
    "locations": [...]
  }
}
```

**Errors:**
- `403` - No permission to view
- `404` - Mythology not found

---

### **PATCH /api/mythologies/:id**

Update mythology.

**Request:**
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "mythology": { ... }
}
```

---

### **DELETE /api/mythologies/:id**

Delete mythology and all related content.

**Response (200):**
```json
{
  "message": "Mythology deleted successfully"
}
```

---

## 👤 CHARACTER ENDPOINTS

### **POST /api/characters**

Create new character.

**Request:**
```json
{
  "mythology_id": "uuid",
  "name": "Zeus",
  "title": "King of the Gods",
  "archetype": "god",
  "domain": ["thunder", "sky", "justice"],
  "appearance": "Tall, bearded, powerful",
  "personality": "Authoritative but mercurial",
  "backstory": "Overthrew his father Cronus...",
  "powers": ["Lightning bolts", "Shape-shifting"],
  "weaknesses": ["Hubris", "Infidelity"],
  "symbols": ["Eagle", "Lightning bolt"]
}
```

**Response (201):**
```json
{
  "character": { ... },
  "points_awarded": 50,
  "badges_earned": ["first_creation"]
}
```

**Errors:**
- `400` - Content moderation failed
- `403` - Not owner of mythology

---

### **GET /api/characters/:id**

Get single character.

**Response (200):**
```json
{
  "character": {
    "id": "uuid",
    "name": "Zeus",
    ...
  }
}
```

---

### **PATCH /api/characters/:id**

Update character.

---

### **DELETE /api/characters/:id**

Delete character.

---

## 🐉 CREATURE ENDPOINTS

### **POST /api/creatures**

Create new creature.

**Request:**
```json
{
  "mythology_id": "uuid",
  "name": "Cerberus",
  "creature_type": "monster",
  "alignment": "neutral",
  "intelligence": "animal",
  "danger_level": "deadly",
  "appearance": "Three-headed dog...",
  "behavior": "Guards the underworld",
  "habitat": "Entrance to Hades",
  "abilities": ["Three heads", "Venomous bite"],
  "size": "huge",
  "health_points": 500,
  "attack_power": 85,
  "defense": 70
}
```

**Response (201):**
```json
{
  "creature": { ... },
  "points_awarded": 50
}
```

---

## 📖 STORY ENDPOINTS

### **POST /api/stories**

Create new story.

**Request:**
```json
{
  "mythology_id": "uuid",
  "title": "The Epic Battle",
  "content": { /* TipTap JSON */ },
  "story_type": "adventure",
  "character_ids": ["uuid1", "uuid2"],
  "creature_ids": ["uuid3"]
}
```

**Response (201):**
```json
{
  "story": { ... },
  "points_awarded": 100,
  "badges_earned": ["storyteller"]
}
```

---

### **POST /api/stories/:id/ai-assist**

Get AI writing suggestions.

**Request:**
```json
{
  "prompt": "Continue the story where Zeus confronts Poseidon",
  "context": "Previous paragraph text..."
}
```

**Response (200):**
```json
{
  "suggestions": [
    "Zeus raised his lightning bolt...",
    "The tension between the gods grew...",
    "Poseidon's trident glowed with power..."
  ]
}
```

**Rate Limit:** 20 requests per day per student

---

## 🗺️ MAP ENDPOINTS

### **POST /api/maps**

Create new map.

**Request:**
```json
{
  "mythology_id": "uuid",
  "name": "World of the Gods",
  "canvas_data": { /* Konva JSON */ },
  "canvas_width": 1920,
  "canvas_height": 1080
}
```

**Response (201):**
```json
{
  "map": { ... }
}
```

---

## 🔗 RELATIONSHIP ENDPOINTS

### **POST /api/relationships**

Create relationship between entities.

**Request:**
```json
{
  "mythology_id": "uuid",
  "from_entity_type": "character",
  "from_entity_id": "uuid1",
  "to_entity_type": "character",
  "to_entity_id": "uuid2",
  "relationship_type": "parent",
  "description": "Zeus is the father of Apollo"
}
```

---

## ⚔️ BATTLE ENDPOINTS

### **POST /api/battles**

Generate AI battle between two entities.

**Request:**
```json
{
  "participant_1_type": "character",
  "participant_1_id": "uuid",
  "participant_2_type": "creature",
  "participant_2_id": "uuid",
  "battle_type": "duel",
  "location_description": "On Mount Olympus"
}
```

**Response (201):**
```json
{
  "battle": {
    "id": "uuid",
    "battle_narrative": "Zeus raised his lightning bolt...",
    "winner_type": "participant_1",
    "turn_count": 5
  },
  "points_awarded": 75
}
```

**Rate Limit:** 10 battles per day per student

---

## 🎨 IMAGE GENERATION ENDPOINTS

### **POST /api/images/generate**

Generate AI image for character or creature.

**Request:**
```json
{
  "entity_type": "character",
  "entity_id": "uuid",
  "prompt": "Enhanced detailed prompt...",
  "style_preset": "greek_marble",
  "generator": "dalle" // or "midjourney"
}
```

**Response (200):**
```json
{
  "image_url": "https://supabase-storage.../image.png",
  "generation_id": "uuid",
  "revised_prompt": "Final prompt used..."
}
```

**Rate Limit:** 10 generations per day per student

---

### **POST /api/images/enhance-prompt**

Enhance basic prompt with AI.

**Request:**
```json
{
  "entity_type": "character",
  "entity_id": "uuid",
  "base_prompt": "Zeus, god of thunder"
}
```

**Response (200):**
```json
{
  "enhanced_prompt": "Detailed 200-word prompt with mythology context..."
}
```

---

## 🏆 GAMIFICATION ENDPOINTS

### **GET /api/points**

Get user's point history.

**Response (200):**
```json
{
  "total_points": 450,
  "level": 5,
  "points_to_next_level": 50,
  "recent_transactions": [
    {
      "action": "character_created",
      "points": 50,
      "created_at": "2025-01-15T10:00:00Z"
    }
  ]
}
```

---

### **GET /api/badges**

Get all badges and user's progress.

**Response (200):**
```json
{
  "earned_badges": [
    {
      "badge_id": "uuid",
      "name": "First Creation",
      "description": "Created your first character",
      "icon": "🎨",
      "rarity": "common",
      "earned_at": "2025-01-15T10:00:00Z"
    }
  ],
  "locked_badges": [
    {
      "badge_id": "uuid",
      "name": "Epic Worldbuilder",
      "description": "Create 10 characters",
      "progress": 3,
      "progress_max": 10
    }
  ]
}
```

---

### **GET /api/leaderboard**

Get leaderboard rankings.

**Query Parameters:**
- `category` - points, streak, stories, characters
- `scope` - global, classroom
- `limit` - default 20

**Response (200):**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "user_id": "uuid",
      "full_name": "Jane Doe",
      "avatar_url": "...",
      "points": 850,
      "level": 8
    }
  ],
  "user_rank": 15
}
```

---

## 💬 COLLABORATION ENDPOINTS

### **POST /api/chat/rooms**

Create chat room.

**Request:**
```json
{
  "name": "Zeus & Poseidon Crossover",
  "mythology_ids": ["uuid1", "uuid2"]
}
```

---

### **POST /api/chat/rooms/:roomId/messages**

Send message in chat room.

**Request:**
```json
{
  "message": "What if Zeus and Thor met?",
  "mentions": ["uuid"] // Optional user mentions
}
```

---

### **GET /api/notifications**

Get user notifications.

**Query Parameters:**
- `unread_only` - boolean

**Response (200):**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "badge_earned",
      "title": "New Badge Earned!",
      "message": "You earned Epic Worldbuilder",
      "data": { "badge_id": "uuid" },
      "read": false,
      "created_at": "2025-01-15T10:00:00Z"
    }
  ],
  "unread_count": 3
}
```

---

### **PATCH /api/notifications/:id/read**

Mark notification as read.

---

## 🎓 PRESENTATION ENDPOINTS

### **POST /api/presentations**

Create presentation.

**Request:**
```json
{
  "mythology_id": "uuid",
  "title": "My Mythology Showcase",
  "character_ids": ["uuid1", "uuid2"],
  "creature_ids": ["uuid3"],
  "story_ids": ["uuid4"]
}
```

**Response (201):**
```json
{
  "presentation": {
    "id": "uuid",
    "slides": [
      {
        "type": "title",
        "content": { ... },
        "narration": "Welcome to my mythology..."
      }
    ]
  }
}
```

---

### **POST /api/presentations/:id/export**

Export presentation to PowerPoint or PDF.

**Request:**
```json
{
  "format": "pptx" // or "pdf"
}
```

**Response (200):**
```json
{
  "download_url": "https://supabase-storage.../presentation.pptx",
  "expires_at": "2025-01-16T10:00:00Z"
}
```

---

### **POST /api/presentations/:id/share**

Create shareable link.

**Request:**
```json
{
  "password": "optional_password",
  "expires_at": "2025-02-01T00:00:00Z"
}
```

**Response (201):**
```json
{
  "share_token": "abc123xyz",
  "share_url": "https://app.com/share/abc123xyz"
}
```

---

## 👨‍🏫 TEACHER ENDPOINTS

### **GET /api/teacher/classrooms**

Get teacher's classrooms.

**Response (200):**
```json
{
  "classrooms": [
    {
      "id": "uuid",
      "name": "Period 3 - Mythology",
      "join_code": "ABC123",
      "student_count": 35
    }
  ]
}
```

---

### **POST /api/teacher/classrooms**

Create classroom.

**Request:**
```json
{
  "name": "Period 3 - Mythology",
  "school_year": "2025-2026"
}
```

**Response (201):**
```json
{
  "classroom": {
    "id": "uuid",
    "join_code": "ABC123"
  }
}
```

---

### **GET /api/teacher/grading-queue**

Get pending student submissions.

**Response (200):**
```json
{
  "pending": [
    {
      "mythology_id": "uuid",
      "student_name": "Jane Doe",
      "submission_date": "2025-01-15T10:00:00Z",
      "content_type": "mythology"
    }
  ]
}
```

---

### **POST /api/teacher/grade**

Submit grade for student work.

**Request:**
```json
{
  "mythology_id": "uuid",
  "grade": "A",
  "feedback": "Excellent creativity!"
}
```

---

### **POST /api/teacher/impersonate**

View student account (impersonation).

**Request:**
```json
{
  "student_id": "uuid"
}
```

**Response (200):**
```json
{
  "session_token": "temp_token",
  "student_profile": { ... }
}
```

---

## ⚠️ ERROR RESPONSES

All errors follow this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Name is required",
    "details": {
      "field": "name"
    }
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` (400)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `RATE_LIMIT_EXCEEDED` (429)
- `CONTENT_MODERATION_FAILED` (400)
- `INTERNAL_SERVER_ERROR` (500)

---

## 🔒 AUTHENTICATION

All API requests require authentication via session cookie (handled automatically by Supabase Auth).

**For programmatic access:**

```typescript
// Include Supabase session token
headers: {
  'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
}
```

---

## 📊 RATE LIMITS

| Endpoint Category | Rate Limit |
|-------------------|------------|
| **Auth** | 10 requests/minute |
| **CRUD Operations** | 100 requests/minute |
| **AI Generation** | 10 per day per student |
| **Image Generation** | 10 per day per student |
| **Exports** | 20 per day per student |

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1672531200
```

---

**API documentation complete** ✅

# Verses In Creation - Product Requirements Document

## Executive Summary

### Problem Statement
Users of the platform currently lack a creative outlet for self-expression. There is no way to compose, store, and share original poetry within the application, limiting the platform's appeal to users interested in creative writing.

### Proposed Solution
Introduce a poem creation feature that allows users to compose, save, edit, and share original poetry. The feature integrates with the existing authentication system and follows established UI/UX patterns to provide a seamless creative writing experience.

### Expected Impact
- **User Engagement**: Increase user engagement by providing a creative content creation feature
- **Platform Value**: Expand platform capabilities beyond URL management to creative expression
- **Community Building**: Enable users to share their creative works, fostering community interaction

### Success Metrics
- Number of poems created per active user
- Poem completion rate (drafts vs. published poems)
- User retention rate among poem creators
- Share rate of published poems

---

## Requirements & Scope

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-1 | Users shall be able to create a new poem with title and content | Must |
| REQ-2 | Users shall be able to save poems as drafts | Must |
| REQ-3 | Users shall be able to edit existing poems | Must |
| REQ-4 | Users shall be able to delete their poems | Must |
| REQ-5 | Users shall be able to publish poems for public viewing | Should |
| REQ-6 | Users shall be able to view a list of their poems | Must |
| REQ-7 | System shall preserve line breaks and formatting in poems | Must |
| REQ-8 | Users shall be able to share published poems via unique URL | Should |
| REQ-9 | Users shall be able to add optional metadata (author name, date) | Could |

### Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-1 | Poem content shall support up to 10,000 characters | Must |
| NFR-2 | System shall auto-save drafts every 30 seconds | Should |
| NFR-3 | Poem editor shall be responsive across desktop and mobile | Must |
| NFR-4 | Page load time for poem list shall be under 2 seconds | Should |
| NFR-5 | System shall integrate with existing JWT authentication | Must |

### Out of Scope
- Collaborative poem editing (multi-author)
- AI-assisted poem generation
- Poetry analysis or feedback tools
- Monetization features (paid poems, subscriptions)
- Social features (comments, likes, follows)
- Poetry templates or structure enforcement (haiku, sonnet, etc.)

### Success Criteria
- Users can create, save, edit, and delete poems
- Poems persist across sessions with proper user association
- Published poems are accessible via shareable URLs
- Feature integrates seamlessly with existing authentication

---

## User Stories

### Personas
- **Authenticated User**: A registered user who wants to create and manage poems
- **Public Visitor**: An unauthenticated user viewing a shared poem

### Core User Stories

#### Story 1: Create New Poem
**As an** authenticated user
**I want to** create a new poem with a title and content
**So that** I can express my creativity and save my work

**Acceptance Criteria:**
- Given I am logged in
- When I navigate to the poem creation page
- Then I see a form with title and content fields
- And I can enter text with preserved line breaks
- And I can save the poem as draft or publish it

**Traceability:** REQ-1, REQ-2, REQ-7

**Priority:** Must

---

#### Story 2: View My Poems
**As an** authenticated user
**I want to** view a list of all my poems
**So that** I can access and manage my creative works

**Acceptance Criteria:**
- Given I am logged in
- When I navigate to my poems page
- Then I see a list of my poems with titles and status (draft/published)
- And poems are sorted by most recently modified
- And I can click on any poem to view or edit it

**Traceability:** REQ-6

**Priority:** Must

---

#### Story 3: Edit Existing Poem
**As an** authenticated user
**I want to** edit an existing poem
**So that** I can revise and improve my work

**Acceptance Criteria:**
- Given I have an existing poem
- When I open the poem for editing
- Then I can modify the title and content
- And I can update the publication status
- And changes are saved when I click save

**Traceability:** REQ-3

**Priority:** Must

---

#### Story 4: Delete Poem
**As an** authenticated user
**I want to** delete a poem I no longer want
**So that** I can manage my poem collection

**Acceptance Criteria:**
- Given I have an existing poem
- When I choose to delete the poem
- Then I am prompted to confirm deletion
- And upon confirmation the poem is permanently removed
- And the poem no longer appears in my list

**Traceability:** REQ-4

**Priority:** Must

---

#### Story 5: Share Published Poem
**As an** authenticated user
**I want to** share my published poem via a unique URL
**So that** others can read my work without needing an account

**Acceptance Criteria:**
- Given I have a published poem
- When I request a share link
- Then I receive a unique URL for the poem
- And anyone with the URL can view the poem
- And the viewer does not need to be logged in

**Traceability:** REQ-5, REQ-8

**Priority:** Should

---

#### Story 6: View Shared Poem
**As a** public visitor
**I want to** view a shared poem via its URL
**So that** I can read poetry shared with me

**Acceptance Criteria:**
- Given I have a valid poem share URL
- When I visit the URL
- Then I see the poem title, content, and author info
- And the poem is displayed with proper formatting
- And I do not need to log in to view it

**Traceability:** REQ-5, REQ-8

**Priority:** Should

---

#### Story 7: Auto-Save Draft
**As an** authenticated user
**I want to** have my poem draft auto-saved periodically
**So that** I don't lose my work if something goes wrong

**Acceptance Criteria:**
- Given I am editing a poem
- When 30 seconds pass since my last change
- Then the system auto-saves my draft
- And I see an indicator that draft was saved
- And I can continue editing without interruption

**Traceability:** REQ-2, NFR-2

**Priority:** Should

---

## User Experience & Interface

### User Journey

1. **Entry Point**: User navigates to "Create Poem" from dashboard or navigation
2. **Creation**: User enters title and poem content in a clean, distraction-free editor
3. **Saving**: User saves as draft or publishes immediately
4. **Management**: User views poem list, can edit or delete poems
5. **Sharing**: User generates share link for published poems

### Interface Requirements

- **Poem Editor**
  - Clean, minimal interface focused on writing
  - Large text area with monospace or serif font option
  - Title field prominently displayed
  - Save/Publish buttons clearly visible
  - Draft status indicator

- **Poem List View**
  - Card or list layout showing poem titles
  - Visual distinction between drafts and published poems
  - Quick actions (edit, delete, share)
  - Search/filter capability for users with many poems

- **Public Poem View**
  - Read-only presentation with elegant typography
  - Author attribution and date
  - Share/copy link functionality

### Accessibility Considerations
- Keyboard navigation for all editor functions
- Screen reader compatibility for poem content
- Sufficient color contrast for text
- Focus indicators for interactive elements

---

## Technical Considerations

### High-Level Technical Approach
The poem feature will extend the existing FastAPI backend with new models and endpoints, following established patterns. The frontend will add new React components and pages integrated with the current routing and state management.

### Integration Points
- **Authentication**: Leverage existing JWT authentication (AuthContext)
- **Database**: Add Poem model to existing SQLAlchemy schema
- **API**: New `/api/poems` router following existing conventions
- **Frontend Routing**: New routes under protected layout

### Key Technical Constraints
- Must use existing tech stack (FastAPI, React, SQLAlchemy)
- Must integrate with current authentication system
- Database migrations via Alembic
- Follow existing code patterns and conventions

### Performance Considerations
- Efficient text storage for poems up to 10,000 characters
- Pagination for poem list to handle large collections
- Optimized queries for poem retrieval

---

## Design Specification

### Recommended Approach
Implement a poem management system as a new module within the existing application, using the established patterns for API endpoints, database models, and React components. The feature should feel like a natural extension of the current platform.

### Key Technical Decisions

#### 1. Data Storage
- **Options Considered**: JSON field in existing table vs. dedicated Poem table vs. external storage
- **Tradeoffs**: JSON is simple but limits querying; dedicated table follows existing patterns and enables proper indexing; external storage adds complexity
- **Recommendation**: Dedicated Poem table with foreign key to User, following URL model pattern

#### 2. Text Editor Component
- **Options Considered**: Plain textarea vs. rich text editor (e.g., TipTap) vs. Markdown editor
- **Tradeoffs**: Textarea is simple and preserves formatting; rich text adds complexity but enables styling; Markdown balances features and simplicity
- **Recommendation**: Plain textarea for initial implementation - poetry typically relies on line breaks rather than rich formatting, and this matches the simplicity goal

#### 3. Share URL Structure
- **Options Considered**: UUID-based (`/poems/{uuid}`) vs. slug-based (`/poems/my-poem-title`) vs. short code (like existing URLs)
- **Tradeoffs**: UUID is unique but not memorable; slugs are readable but require uniqueness handling; short codes are consistent with platform
- **Recommendation**: UUID-based URLs for simplicity and guaranteed uniqueness

### High-Level Architecture
```mermaid
graph TB
    subgraph Frontend
        PC[Poem Creator Page]
        PL[Poem List Page]
        PV[Poem View Page]
    end

    subgraph API
        PR[/api/poems Router]
    end

    subgraph Database
        PM[Poem Model]
        UM[User Model]
    end

    PC --> PR
    PL --> PR
    PV --> PR
    PR --> PM
    PM --> UM
```

### Key Considerations
- **Performance**: Poem content stored as TEXT type; pagination for list queries; index on user_id and share_token
- **Security**: JWT authentication required for CRUD operations; share tokens enable public read access; input sanitization for XSS prevention
- **Scalability**: Database can handle large text fields efficiently; stateless API design supports horizontal scaling

### Risk Management
- **Technical Risk 1**: Text formatting loss - Mitigate by using TEXT type and preserving whitespace in frontend rendering with `white-space: pre-wrap`
- **Technical Risk 2**: Auto-save conflicts with manual save - Mitigate by implementing optimistic locking with version field or last_modified timestamp

### Success Criteria
- Users can complete full poem CRUD lifecycle
- Poems render with preserved formatting
- Share links work for unauthenticated users
- Feature integrates without breaking existing functionality

---

## Dependencies & Assumptions

### Dependencies
- Existing user authentication system
- Database migration tooling (Alembic)
- Frontend routing infrastructure (React Router)

### Assumptions
- Users have active accounts to create poems
- Existing database can support additional table
- Current hosting can handle increased storage for poem content

### Cross-Team Coordination
- None required - feature uses existing infrastructure

---

## Appendices

### Database Schema Addition

```sql
CREATE TABLE poems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    is_published BOOLEAN DEFAULT FALSE,
    share_token VARCHAR(64) UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_poems_user_id ON poems(user_id);
CREATE INDEX idx_poems_share_token ON poems(share_token);
```

### API Endpoints Overview

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/poems/ | Create new poem | Required |
| GET | /api/poems/ | List user's poems | Required |
| GET | /api/poems/{id} | Get poem by ID | Required (owner) |
| PATCH | /api/poems/{id} | Update poem | Required (owner) |
| DELETE | /api/poems/{id} | Delete poem | Required (owner) |
| POST | /api/poems/{id}/share | Generate share token | Required (owner) |
| GET | /api/poems/shared/{token} | View shared poem | Public |

### Frontend Routes

| Route | Component | Access |
|-------|-----------|--------|
| /poems | PoemList | Protected |
| /poems/new | PoemEditor | Protected |
| /poems/:id/edit | PoemEditor | Protected (owner) |
| /p/:shareToken | PoemView | Public |

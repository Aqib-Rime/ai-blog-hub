# AI Blog Hub

A modern blog platform powered by AI, featuring intelligent chat assistance using RAG (Retrieval Augmented Generation) and vector similarity search.

## 🚀 Features

- **AI-Powered Chat Assistant** - Ask questions about blog posts using RAG with vector similarity search
- **Blog Management** - Full-featured CMS with Payload CMS for content creation and management
- **Vector Search** - Automatic blog embeddings generation using Google Gemini for semantic search
- **Modern UI** - Beautiful, responsive interface built with Tailwind CSS and shadcn/ui components
- **Real-time Chat** - Stream responses using Groq's Llama 3.3 model

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **CMS**: Payload CMS 3.62
- **Database**: PostgreSQL with pgvector extension
- **AI/ML**:
  - Groq (Llama 3.3) for chat completions
  - Google Gemini for text embeddings
- **UI**: React 19, Tailwind CSS, shadcn/ui
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js 18.20.2+ or 20.9.0+
- pnpm 9+ or 10+
- PostgreSQL database with pgvector extension enabled
- API keys:
  - [Groq API Key](https://console.groq.com/)
  - [Google Gemini API Key](https://makersuite.google.com/app/apikey)

## ⚙️ Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-blog-hub
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Payload CMS
   PAYLOAD_SECRET=your-secret-key-here
   DATABASE_URI=postgresql://user:password@localhost:5432/ai_blog_hub
   
   # AI Services
   GEMINI_API_KEY=your-gemini-api-key
   GROQ_API_KEY=your-groq-api-key
   
   # Optional
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   PAYLOAD_PREVIEW_SECRET=your-preview-secret
   ```

4. **Set up PostgreSQL with pgvector**
   
   Ensure PostgreSQL has the pgvector extension enabled:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
   
   Or use Docker:
   ```bash
   docker run -d \
     --name postgres-pgvector \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=ai_blog_hub \
     -p 5432:5432 \
     pgvector/pgvector:pg16
   ```

5. **Run database migrations**
   
   The pgvector extension will be automatically enabled on first run.

6. **Start the development server**
   ```bash
   pnpm dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

8. **Create your first admin user**
   
   Follow the on-screen instructions when accessing the admin panel for the first time.

## 🐳 Docker Setup (Optional)

You can use Docker Compose for local development:

```bash
docker-compose up -d
```

Note: Update the `DATABASE_URI` in your `.env` file to match your Docker PostgreSQL connection string.

## 📝 Usage

1. **Create Blog Posts**: Access the admin panel at `/admin` and create blog posts with rich text content
2. **Automatic Embeddings**: When you publish a blog, embeddings are automatically generated and stored
3. **Chat with Blogs**: Use the chat widget on blog pages to ask questions about specific posts, or chat globally about all blogs
4. **Vector Search**: The RAG system retrieves the most relevant blog chunks using cosine similarity

## 📦 Build for Production

```bash
pnpm build
pnpm start
```

## 📄 License

MIT

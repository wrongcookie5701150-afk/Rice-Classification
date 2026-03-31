# 🚀 Quick Start Guide

## Installation & Run (3 minutes)

### 1. Install SQL Server Express (Free)

# Download and install SQL Server #

- Visit: <https://www.microsoft.com/en-us/sql-server/sql-server-downloads>
- Choose #"Express"# edition (free for development)
- Run installer and select default options
- Set `sa` password during installation (e.g., `YourPassword123!`)

# Start SQL Server service #

```bash
net start MSSQL$SQLEXPRESS
```

### 2. Install Dependencies

```bash
cd c:\Users\Chatta\Documents\KMUTT\NextJS\rice-classify-ws
npm install --legacy-peer-deps
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update with your SQL Server credentials:

```bash
# .env file
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=YourPassword123!
DB_NAME=rice_classifier
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Build & Start Development Server

```bash
npm run build
npm run start:dev
```

Expected output:

```
[Nest] XXXXX  - 30/03/2026 11:00:00     LOG [NestFactory] Starting Nest application...
🧠 ML Simulator Model initialized
[Nest] XXXXX  - 30/03/2026 11:00:01     LOG [TypeOrmModule] TypeORM initialized successfully
[Nest] XXXXX  - 30/03/2026 11:00:01     LOG [NestApplicationContext] Nest application successfully started
```

### 5. Access Application

- #Frontend#: <http://localhost:3001>
- #Archive#: <http://localhost:3001/archive.html>  
- #API Docs#: <http://localhost:3001/api/docs>

---

## What Was Built ✅

### Backend (NestJS + SQL Server)

- ✅ Complete REST API with 13 endpoints
- ✅ Image upload & classification with ML model injection
- ✅ SQL Server persistence for all results
- ✅ History, statistics, and result management
- ✅ TypeORM with automatic schema creation
- ✅ Swagger auto-documentation

### Frontend (Vanilla JS + Tailwind)

- ✅ Image upload with drag-and-drop
- ✅ Real-time classification results display (glassmorphic design)
- ✅ Rice varieties showcase with detail modals
- ✅ Classification archive with pagination
- ✅ Statistics dashboard
- ✅ Fully responsive design

### Architecture

- ✅ ML model interface ready for real model swap
- ✅ Repository pattern for clean data access
- ✅ Modular NestJS structure
- ✅ Zero 1px borders - full design system compliance

---

## Database

The application uses #SQL Server# with #TypeORM#. The database is automatically created on first run.

To verify the connection in SQL Server Management Studio:

1. Open SSMS
2. Server: `localhost`
3. Authentication: SQL Server Authentication
4. Username: `sa`
5. Password: (your configured password)
6. Click Connect
7. Expand "Databases" to see `rice_classifier`

---

## Troubleshooting

### SQL Server Won't Start

```bash
# Check service status
Get-Service MSSQL$SQLEXPRESS

# Start manually
net start MSSQL$SQLEXPRESS
```

### Connection Timeout

- Verify SQL Server service is running
- Check credentials in `.env`
- Ensure port 1433 is not blocked by firewall

### npm Install Fails

```bash
# Use legacy peer deps flag
npm install --legacy-peer-deps
```

### Port 3001 Already in Use

```bash
# Use different port
PORT=3002 npm run start:dev
```

---

## Next Steps

✅ Database tables auto-created on startup  
✅ Upload rice grain images via frontend  
✅ View classification results in real-time  
✅ Browse history in archive page  
✅ Read full [SQL_SERVER_SETUP.md](./SQL_SERVER_SETUP.md) for advanced configuration  

For complete setup guide, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

## API Endpoints

# Upload #

- `POST /api/upload/image` - Upload grain image → returns classification + resultId
- `GET /api/upload/image/:filename` - Retrieve image
- `DELETE /api/upload/image/:filename` - Delete image

# Classification #

- `GET /api/classification/varieties` - All rice varieties
- `GET /api/classification/varieties/:type` - One variety  
- `GET /api/classification/history` - Classification history (paginated)
- `GET /api/classification/history/:id` - One result
- `DELETE /api/classification/history/:id` - Delete result
- `GET /api/classification/statistics` - Stats dashboard
- `GET /api/classification/health` - Health check

---

## Next Steps

1. ✅ #Test upload workflow#
   - Go to <http://localhost:3001>
   - Drag image onto upload zone
   - See results display with design system styling

2. ✅ #Check archive#
   - Visit <http://localhost:3001/archive.html>
   - View classification history with pagination

3. ✅ #Review API docs#
   - Open <http://localhost:3001/api/docs>
   - All endpoints documented with Swagger

4. 📊 #Monitor database#
   - MongoDB stores all classification results
   - View via MongoDB Compass (local) or Atlas UI (cloud)

5. 🔄 #Future ML integration#
   - Swap `MLSimulatorService` for real TensorFlow model
   - Update `app.module.ts` provider
   - No other code changes needed!

---

## Terminal Commands Reference

```bash
# Development
npm run start:dev           # Start dev server with hot reload
npm run build              # Compile TypeScript

# Production
npm run start:prod         # Run compiled build

# Utilities
npm run lint               # Fix code style
npm test                   # Run tests

# Docker (Optional)
docker run -d -p 27017:27017 mongo:latest    # Start MongoDB
docker ps                  # Check running containers
```

---

## Troubleshooting

# MongoDB won't connect #

→ Check MongoDB is running and connection string in .env

# Port 3001 already in use #

→ Change PORT in .env or kill process: `lsof -i :3001` / `kill -9 <PID>`

# Build errors #

→ Delete `node_modules` and `dist`, run `npm install` again

# Frontend not loading #

→ Check browser console for errors, ensure static assets in `/public`

# Classification results not saving #

→ Verify MongoDB connection, check database in MongoDB CLI/Atlas

---

## Testing Checklist

- [ ] Server starts without errors
- [ ] Frontend loads at localhost:3001
- [ ] Drag-and-drop upload works
- [ ] Classification results display
- [ ] Archive page shows history
- [ ] Delete buttons work
- [ ] Swagger docs accessible
- [ ] MongoDB has saved results

---

## Support

- #Code Examples#: See comments in source files
- #API Details#: <http://localhost:3001/api/docs>
- #Design Guide#: See DESIGN.md for styling guidelines
- #Setup Help#: See SETUP_GUIDE.md for detailed instructions
- #Summary#: See IMPLEMENTATION_SUMMARY.md for complete feature list

---

## Success! 🎉

Your rice classification system is ready to use!

- Backend: #NestJS# with #MongoDB#
- Frontend: #Vanilla JS# with #Tailwind CSS#
- Design: #Editorial Agrarian# system fully implemented
- ML: #Ready for real model integration#

Start the server and begin classifying rice grains! 🌾

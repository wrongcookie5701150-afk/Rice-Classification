# Setup & Running Guide

## Prerequisites

- Node.js 18+ and npm
- SQL Server 2019 or later (Express, Standard, or Enterprise)
- SQL Server Management Studio (SSMS) 21
- Optional: Docker & Docker Compose for containerization

## Installation

### 1. Install SQL Server Express (Free)

Download and install from: <https://www.microsoft.com/en-us/sql-server/sql-server-downloads>

**Windows Installation Steps:**

1. Run SQL Server installer
2. Select **Custom** installation
3. Install **Database Engine Services**
4. Complete setup with default settings
5. Set `sa` system admin password

**Start SQL Server Service:**

```bash
# Using Services
net start MSSQL$SQLEXPRESS

# Verify it's running
sc query MSSQL$SQLEXPRESS
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Create `.env` File

```bash
cp .env.example .env
```

**Edit `.env` with your SQL Server credentials:**

```bash
# SQL Server Configuration
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=YourPassword123!
DB_NAME=rice_classifier

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

### 4. Verify SQL Server Connection

**Using SQL Server Management Studio (SSMS):**
1. Open SSMS 21
2. Server name: `localhost` or `LAPTOP-XXXX\SQLEXPRESS`
3. Authentication: **SQL Server Authentication**
4. Username: `sa`
5. Password: (your configured password)
6. Click **Connect**

**Using Command Line (sqlcmd):**

```bash
sqlcmd -S localhost -U sa -P YourPassword123! -Q "SELECT @@VERSION"
```

## Development

### Build

```bash
npm run build
```

### Start Development Server

```bash
npm run start:dev
```

Server will run on `http://localhost:3001`

The database tables will be **automatically created** on first startup because `synchronize: true` is enabled in development mode.

## Accessing the Application

- **Frontend**: http://localhost:3001
- **Archive/History**: http://localhost:3001/archive.html
- **API Documentation (Swagger)**: http://localhost:3001/api/docs

## Features

### 1. Image Upload & Classification
- Upload rice grain images (JPEG, PNG, HEIC)
- Real-time classification with confidence scores
- Morphological and colorimetric analysis
- Automatic database persistence to SQL Server

### 2. Rice Varieties Database
- Browse 5+ supported rice varieties
- Detailed characteristics and origins
- Image gallery for each variety
- Use cases and applications

### 3. Classification History & Archive
- Paginated classification results (stored in SQL Server)
- View detailed analysis of each result
- Delete individual records
- Statistics dashboard
- Search and filter capabilities (future)

### 4. API Endpoints

#### Upload & Classification
- `POST /api/upload/image` - Upload and classify grain image
- `GET /api/upload/image/:filename` - Retrieve uploaded image
- `DELETE /api/upload/image/:filename` - Delete uploaded image

#### Rice Classification
- `GET /api/classification/varieties` - List all rice varieties
- `GET /api/classification/varieties/:type` - Get specific variety details
- `POST /api/classification/classify` - Classify from image path
- `GET /api/classification/health` - Service health check

#### Classification History
- `GET /api/classification/history?page=1&limit=20` - Paginated history
- `GET /api/classification/history/:id` - Get classification result details
- `DELETE /api/classification/history/:id` - Delete result
- `GET /api/classification/statistics` - Get statistics

## Database Schema (Auto-Created)

### ClassificationResults Table
**Automatically created by TypeORM on startup**

Key columns:
- `id` - UUID primary key
- `filename` - Uploaded image filename
- `imagePath` - Server-side image path
- `confidence` - Classification confidence (0-100)
- `riceType` - Rice variety classification
- `grainColor` - Detected grain color
- `morphology*` - Physical measurements (length, width, aspect ratio, surface area)
- `colorimetric*` - Color values (RGB and LAB)
- `createdAt` / `updatedAt` - Timestamps

## Troubleshooting

### SQL Server Service Won't Start
```bash
# Check status
Get-Service MSSQL$SQLEXPRESS

# Stop and restart
Stop-Service MSSQL$SQLEXPRESS
Start-Service MSSQL$SQLEXPRESS
```

### Connection Refused
- ✅ Verify SQL Server service is running
- ✅ Check firewall allows port 1433
- ✅ Verify credentials in `.env` match SQL Server setup
- ✅ Try connecting with SSMS to confirm

### Database Not Created
- ✅ Check SQL Server is running
- ✅ Verify connection in application logs
- ✅ Check `.env` has correct DB_* variables
- ✅ Ensure `NODE_ENV=development` for auto-creation

### Port 3001 Already in Use
```bash
# Kill process on port 3001
npx kill-port 3001

# Or use a different port
PORT=3002 npm run start:dev
```

### npm Install Fails
```bash
# Use legacy peer dependencies flag
npm install --legacy-peer-deps
```

## Migration from MongoDB

If migrating from MongoDB, see [MIGRATION_MONGODB_TO_SQLSERVER.md](./MIGRATION_MONGODB_TO_SQLSERVER.md) for detailed steps.

## Production Deployment

For production setup:
1. Use SQL Server Standard or Enterprise Edition
2. Update `app.module.ts` to set `synchronize: false`
3. Use TypeORM migrations for schema changes
4. Configure proper backups and recovery procedures
5. Enable encryption and secure authentication

See [SQL_SERVER_SETUP.md](./SQL_SERVER_SETUP.md) for more details.

## Project Structure

```
rice-classify-ws/
├── src/
│   ├── main.ts                 # Entry point
│   ├── app.module.ts           # Main module
│   ├── classification/         # Classification module
│   │   ├── classification.controller.ts
│   │   ├── classification.service.ts
│   │   ├── classification.module.ts
│   │   └── dto/               # Data transfer objects
│   ├── upload/                # Upload module
│   │   ├── upload.controller.ts
│   │   ├── upload.service.ts
│   │   └── upload.module.ts
│   ├── ml/                    # ML model layer
│   │   ├── ml.interface.ts    # ML model interface
│   │   └── ml-simulator.service.ts # Simulated model
│   └── database/              # Database layer
│       ├── classification-result.schema.ts
│       └── classification-result.repository.ts
├── public/                    # Frontend assets
│   ├── index.html            # Main page
│   ├── archive.html          # Archive/history page
│   ├── js/
│   │   ├── api-client.js     # API communication
│   │   ├── upload-handler.js  # Upload logic
│   │   └── varieties-handler.js # Varieties display
│   └── css/                  # Stylesheets (Tailwind)
├── uploads/                  # Uploaded images storage
├── dist/                     # Compiled output
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## ML Model Integration (Future)

The architecture supports swapping the simulated model for a real ML model:

1. **Create ML Model Service**
```typescript
// src/ml/ml-tensorflow.service.ts
@Injectable()
export class MLTensorFlowService implements IMlModel {
  async initialize(): Promise<void> {
    // Load TensorFlow model
  }
  
  async predict(morphology, colorimetric): Promise<ClassificationResult> {
    // Real prediction logic
  }
}
```

2. **Update AppModule Provider**
```typescript
{
  provide: 'ML_MODEL',
  useClass: MLTensorFlowService, // Swap simulator for real model
}
```

No other code changes needed!

## Design System (Editorial Agrarian)

The frontend follows these design principles:
- **No 1px borders** - Use tonal surface shifts for hierarchy
- **Asymmetric spacing** - 6px/8px padding for movement
- **Glassmorphic panels** - 80% opacity + 20px blur for floating effect
- **Tonal depth** - Physical stacking of surfaces for dimension
- **Typography**: Manrope (headlines), Public Sans (body)
- **Colors**: Primary #3a6716, Secondary #755b00, Surfaces per palette

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` (local) or check Atlas status
- Check connection string in `.env`
- Verify firewall/network access to MongoDB

### Port Already in Use
```bash
# Change port in .env
PORT=3002
```

### File Upload Not Working
- Check `./uploads/` directory exists and has write permissions
- Verify file size < 10MB
- Check allowed MIME types: JPEG, PNG, HEIC

### API Docs Not Loading
- Access Swagger at: `/api/docs`
- All endpoints automatically documented from code

## Production Deployment

### Environment Setup
```bash
NODE_ENV=production
PORT=443 (or use reverse proxy)
MONGODB_URI=<production-atlas-connection>
```

### Build & Run
```bash
npm run build
npm run start:prod
```

### Considerations
- Use HTTPS/SSL certificates
- Set up MongoDB Atlas with IP whitelist
- Use environment variables for secrets
- Enable CORS for specific origins
- Set up monitoring and logging
- Configure automated backups for MongoDB

## Support & Documentation

- **API Docs**: Available at `/api/docs` when running
- **Design System**: See `DESIGN.md` for complete design guidelines
- **Code Architecture**: See code comments for detailed explanations

## License

ISC
